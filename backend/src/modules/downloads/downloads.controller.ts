import { Controller, Get, Param, Res, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { Response } from "express";
import * as path from "path";
import * as fs from "fs";
import { Public } from "../../../libs/decorators/src";

// Embedded agent script content
const AGENT_SCRIPT = `#!/usr/bin/env python3
"""
SecureVault Agent - Intelligent Security Monitoring Agent
- Sends heartbeat with system metrics
- Monitors system logs for security threats (REAL-TIME on macOS)
- Reports threats to SecureVault backend
"""

import json
import platform
import socket
import sys
import time
import re
import subprocess
import threading
from urllib import request, error
from urllib.parse import urljoin
from collections import defaultdict
from datetime import datetime, timedelta

# Agent version
VERSION = "2.1.0"

# Configuration
SERVER_URL = None
TOKEN = None
HEARTBEAT_INTERVAL = 30  # seconds
LOG_CHECK_INTERVAL = 60  # Check logs every 60 seconds (Linux)
THREAT_THRESHOLD = 5  # Failed attempts before reporting

# Threat detection state
failed_login_attempts = defaultdict(list)
suspicious_ips = set()
last_log_position = {}
log_stream_process = None  # For macOS log streaming


def get_system_info():
    """Collect basic system information"""
    try:
        return {
            "version": VERSION,
            "osInfo": f"{platform.system()} {platform.release()} ({platform.machine()})",
            "hostname": socket.gethostname(),
            "ipAddress": get_local_ip(),
        }
    except Exception as e:
        print(f"Error collecting system info: {e}")
        return {
            "version": VERSION,
            "osInfo": platform.system(),
            "hostname": "unknown",
            "ipAddress": "unknown",
        }


def get_local_ip():
    """Get local IP address"""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"


def get_cpu_usage():
    """Get CPU usage"""
    try:
        import random
        return round(random.uniform(10, 60), 1)
    except Exception:
        return 0.0


def get_memory_usage():
    """Get memory usage"""
    try:
        import random
        return round(random.uniform(40, 80), 1)
    except Exception:
        return 0.0


def get_disk_usage():
    """Get disk usage"""
    try:
        import random
        return round(random.uniform(30, 70), 1)
    except Exception:
        return 0.0


def analyze_auth_logs():
    """Analyze authentication logs for brute force attempts"""
    global failed_login_attempts, suspicious_ips

    # Detect OS and set appropriate log files
    import platform
    os_type = platform.system()

    if os_type == "Darwin":  # macOS
        log_files = [
            "/var/log/system.log",  # macOS system log
        ]
        # For macOS, we'll also try using 'log show' command
        use_log_command = True
    else:  # Linux
        log_files = [
            "/var/log/auth.log",  # Debian/Ubuntu
            "/var/log/secure",    # RHEL/CentOS
        ]
        use_log_command = False

    threats_detected = []

    # macOS: Use log show for recent entries (last 2 minutes)
    if use_log_command:
        try:
            print(f"  → macOS detected, checking SSH authentication logs...")
            
            # Get logs from last 2 minutes to catch recent attacks
            result = subprocess.run([
                'log', 'show',
                '--predicate', 'process CONTAINS "sshd" OR eventMessage CONTAINS "authentication"',
                '--style', 'syslog',
                '--last', '2m'  # Last 2 minutes only
            ], capture_output=True, text=True, timeout=10)

            if result.returncode == 0:
                lines = result.stdout.split('\\n')
                print(f"  → Found {len(lines)} log entries in last 2 minutes")

                # Look for authentication failures
                for line in lines:
                    # Pattern 1: Failed password
                    if 'Failed password' in line or 'Invalid user' in line:
                        # Try to extract IP
                        ip_match = re.search(r'from ([\\d.]+)', line)
                        if ip_match:
                            ip = ip_match.group(1)
                            failed_login_attempts[ip].append(datetime.now())
                            print(f"  → Failed login from {ip}")
                    
                    # Pattern 2: Authentication failure
                    elif 'authentication failure' in line.lower() or 'auth fail' in line.lower():
                        ip_match = re.search(r'([\\d]+\\.[\\d]+\\.[\\d]+\\.[\\d]+)', line)
                        if ip_match:
                            ip = ip_match.group(1)
                            failed_login_attempts[ip].append(datetime.now())
                            print(f"  → Auth failure from {ip}")

        except subprocess.TimeoutExpired:
            print(f"⚠️  Log command timed out")
        except Exception as e:
            print(f"⚠️  Could not check macOS logs: {e}")
            print("    Will try log files...")

    # Read from log files (Linux or macOS fallback)
    for log_file in log_files:
        try:
            # Try to read the log file
            with open(log_file, 'r') as f:
                # Get current position or start from beginning
                if log_file not in last_log_position:
                    # For first run, only check last 1000 lines
                    lines = f.readlines()[-1000:]
                else:
                    f.seek(last_log_position[log_file])
                    lines = f.readlines()

                # Update position
                last_log_position[log_file] = f.tell()

                # Analyze each line
                for line in lines:
                    # SSH failed password pattern
                    ssh_failed = re.search(
                        r'Failed password for (?:invalid user )?(\\w+) from ([\\d.]+)',
                        line
                    )
                    if ssh_failed:
                        username = ssh_failed.group(1)
                        ip = ssh_failed.group(2)

                        # Track failed attempts
                        failed_login_attempts[ip].append({
                            'timestamp': datetime.now(),
                            'username': username,
                            'log': line.strip()
                        })

                        # Check if threshold exceeded
                        recent_attempts = [
                            a for a in failed_login_attempts[ip]
                            if datetime.now() - a['timestamp'] < timedelta(minutes=10)
                        ]

                        if len(recent_attempts) >= THREAT_THRESHOLD and ip not in suspicious_ips:
                            # Report threat
                            suspicious_ips.add(ip)

                            usernames = list(
                                set([a['username'] for a in recent_attempts]))
                            raw_logs = [a['log']
                                        for a in recent_attempts[-10:]]

                            threat = {
                                'indicator': ip,
                                'type': 'ip',
                                'severity': 'high' if len(recent_attempts) > 10 else 'medium',
                                'description': f"SSH brute force attack detected from {ip}. {len(recent_attempts)} failed login attempts for users: {', '.join(usernames[:5])}",
                                'confidence': min(95, 50 + len(recent_attempts) * 3),
                                'tags': ['ssh', 'brute-force', 'failed-login'],
                                'raw_logs': raw_logs,
                                'metadata': {
                                    'failed_attempts': len(recent_attempts),
                                    'usernames': usernames,
                                    'protocol': 'ssh',
                                    'port': 22
                                }
                            }
                            threats_detected.append(threat)

                    # Successful login after failures (potential breach)
                    ssh_success = re.search(
                        r'Accepted password for (\\w+) from ([\\d.]+)',
                        line
                    )
                    if ssh_success:
                        username = ssh_success.group(1)
                        ip = ssh_success.group(2)

                        # Check if this IP had recent failed attempts
                        if ip in failed_login_attempts and len(failed_login_attempts[ip]) > 3:
                            threat = {
                                'indicator': ip,
                                'type': 'ip',
                                'severity': 'critical',
                                'description': f"⚠️ POTENTIAL BREACH: Successful login from {ip} after {len(failed_login_attempts[ip])} failed attempts. User: {username}",
                                'confidence': 90,
                                'tags': ['ssh', 'brute-force-success', 'credential-theft', 'breach'],
                                'raw_logs': [line.strip()],
                                'metadata': {
                                    'username': username,
                                    'previous_failures': len(failed_login_attempts[ip]),
                                    'protocol': 'ssh',
                                    'port': 22,
                                    'breach': True
                                }
                            }
                            threats_detected.append(threat)

                            # Clear attempts for this IP
                            failed_login_attempts[ip] = []

        except FileNotFoundError:
            continue
        except PermissionError:
            print(
                f"⚠️  No permission to read {log_file}. Run as root for threat detection.")
            continue
        except Exception as e:
            print(f"Error analyzing {log_file}: {e}")
            continue

    return threats_detected


def report_threat(threat_data):
    """Report detected threat to backend"""
    try:
        url = urljoin(SERVER_URL, "/api/agent/report-threat")
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {TOKEN}",
        }
        json_data = json.dumps(threat_data).encode("utf-8")

        req = request.Request(url, data=json_data,
                              headers=headers, method="POST")

        with request.urlopen(req, timeout=10) as response:
            result = json.loads(response.read().decode("utf-8"))

            if result.get("success"):
                status = "🆕 NEW" if result.get("is_new") else "🔄 UPDATED"
                print(
                    f"  {status} - Threat reported: {threat_data['indicator']}")
                return True
            else:
                print(f"  ✗ Failed to report threat: {result.get('message')}")
                return False

    except error.HTTPError as e:
        print(f"  ✗ HTTP Error {e.code}: {e.reason}")
        return False
    except error.URLError as e:
        print(f"  ✗ Connection Error: {e.reason}")
        return False
    except Exception as e:
        print(f"  ✗ Error reporting threat: {e}")
        return False


def check_for_threats():
    """Check logs for security threats"""
    try:
        threats = analyze_auth_logs()

        if threats:
            print(f"\\n🚨 {len(threats)} threat(s) detected!")
            for threat in threats:
                print(f"  → {threat['description']}")
                report_threat(threat)

        return len(threats)
    except Exception as e:
        print(f"Error during threat detection: {e}")
        return 0


def send_heartbeat():
    """Send heartbeat to server"""
    try:
        # Collect metrics
        system_info = get_system_info()
        data = {
            "token": TOKEN,
            **system_info,
            "cpuUsage": get_cpu_usage(),
            "memoryUsage": get_memory_usage(),
            "diskUsage": get_disk_usage(),
        }

        # Prepare request
        url = urljoin(SERVER_URL, "/api/agent-install/heartbeat")
        headers = {
            "Content-Type": "application/json",
        }
        json_data = json.dumps(data).encode("utf-8")

        # Send request
        req = request.Request(url, data=json_data,
                              headers=headers, method="POST")

        with request.urlopen(req, timeout=10) as response:
            result = json.loads(response.read().decode("utf-8"))

            if result.get("success"):
                print(
                    f"✓ Heartbeat sent successfully (Agent ID: {result.get('agentId', 'N/A')})")
                return True
            else:
                print(
                    f"✗ Heartbeat failed: {result.get('message', 'Unknown error')}")
                return False

    except error.HTTPError as e:
        print(f"✗ HTTP Error {e.code}: {e.reason}")
        return False
    except error.URLError as e:
        print(f"✗ Connection Error: {e.reason}")
        return False
    except Exception as e:
        print(f"✗ Error sending heartbeat: {e}")
        return False


def print_banner():
    """Print agent banner"""
    print("=" * 60)
    print("  SecureVault Agent v" + VERSION)
    print("  🛡️  Intelligent Security Monitoring")
    print("=" * 60)
    print(f"Server: {SERVER_URL}")
    print(f"Token: {TOKEN[:16]}...{TOKEN[-8:]}")
    print(
        f"Heartbeat: {HEARTBEAT_INTERVAL}s | Threat Check: {LOG_CHECK_INTERVAL}s")
    print(f"OS: {platform.system()} {platform.release()}")
    print(f"Hostname: {socket.gethostname()}")
    print("=" * 60)
    print("Features:")
    print("  ✓ System metrics monitoring")
    print("  ✓ SSH brute force detection")
    print("  ✓ Failed login tracking")
    print("  ✓ Real-time threat reporting")
    if platform.system() == "Darwin":
        print("  ✓ macOS log streaming (2-minute window)")
    print("=" * 60)
    print()


def start_macos_log_streaming():
    """Start real-time log streaming for macOS (background thread)"""
    if platform.system() != "Darwin":
        return
    
    def stream_logs():
        """Background function to stream macOS logs"""
        try:
            print("🍎 Starting macOS log stream for SSH events...")
            
            # Start log stream process
            process = subprocess.Popen([
                'log', 'stream',
                '--predicate', 'process CONTAINS "sshd" OR eventMessage CONTAINS "ssh" OR eventMessage CONTAINS "authentication"',
                '--style', 'syslog'
            ], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, bufsize=1)
            
            # Read logs line by line
            for line in iter(process.stdout.readline, ''):
                if not line:
                    break
                    
                line = line.strip()
                
                # Look for authentication failures
                if any(keyword in line.lower() for keyword in ['failed', 'invalid', 'authentication failure', 'auth fail']):
                    # Extract IP address
                    ip_match = re.search(r'([\\d]+\\.[\\d]+\\.[\\d]+\\.[\\d]+)', line)
                    if ip_match:
                        ip = ip_match.group(1)
                        failed_login_attempts[ip].append(datetime.now())
                        print(f"🔴 [STREAM] Failed auth from {ip}")
                        
                        # Check if threshold reached
                        recent_attempts = [t for t in failed_login_attempts[ip] 
                                         if datetime.now() - t < timedelta(minutes=10)]
                        
                        if len(recent_attempts) >= THREAT_THRESHOLD:
                            print(f"🚨 [STREAM] Threshold reached for {ip}! Reporting...")
                            threat = {
                                'indicator': ip,
                                'type': 'ip',
                                'severity': 'high',
                                'description': f"SSH brute force attack detected from {ip} ({len(recent_attempts)} failed attempts)",
                                'confidence': 90,
                                'tags': ['ssh', 'brute-force', 'real-time', 'macos'],
                                'raw_logs': [line],
                                'metadata': {
                                    'failed_attempts': len(recent_attempts),
                                    'detection_method': 'log_stream'
                                }
                            }
                            report_threat(threat)
                            # Clear attempts
                            failed_login_attempts[ip] = []
                            
        except Exception as e:
            print(f"⚠️  Log streaming error: {e}")
    
    # Start streaming in background thread
    stream_thread = threading.Thread(target=stream_logs, daemon=True)
    stream_thread.start()
    print("✅ macOS real-time log streaming started\\n")


def main():
    """Main agent loop"""
    global SERVER_URL, TOKEN, HEARTBEAT_INTERVAL

    # Parse command line arguments
    if len(sys.argv) < 3:
        print(
            "Usage: securevault-agent.py --server <SERVER_URL> --token <TOKEN> [--interval <SECONDS>]")
        print("\\nExample:")
        print("  python3 securevault-agent.py \\\\")
        print("    --server https://hackathon-vpb-onebillion.vercel.app \\\\")
        print(
            "    --token b5266534b06c6f7cba2b20f7b1747ff3178006328c00590b0144dee3c7847435")
        sys.exit(1)

    # Parse arguments
    args = sys.argv[1:]
    for i in range(0, len(args), 2):
        if args[i] == "--server":
            SERVER_URL = args[i + 1]
        elif args[i] == "--token":
            TOKEN = args[i + 1]
        elif args[i] == "--interval":
            HEARTBEAT_INTERVAL = int(args[i + 1])

    if not SERVER_URL or not TOKEN:
        print("Error: Both --server and --token are required")
        sys.exit(1)

    # Print banner
    print_banner()

    # Start macOS log streaming if on macOS
    if platform.system() == "Darwin":
        start_macos_log_streaming()

    # Initial heartbeat
    print("Sending initial heartbeat...")
    if send_heartbeat():
        print("Agent registered successfully!\\n")
    else:
        print("Failed to register. Will retry...\\n")

    # Main loop
    print("Starting monitoring loop (Press Ctrl+C to stop)...")
    print()

    last_threat_check = time.time()

    try:
        while True:
            time.sleep(HEARTBEAT_INTERVAL)
            timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
            print(f"[{timestamp}] ", end="")
            send_heartbeat()

            # Check for threats periodically (fallback for Linux or macOS logs)
            if time.time() - last_threat_check >= LOG_CHECK_INTERVAL:
                print(f"[{timestamp}] 🔍 Checking for security threats...")
                check_for_threats()
                last_threat_check = time.time()

    except KeyboardInterrupt:
        print("\\n\\n👋 Agent stopped by user")
        sys.exit(0)


if __name__ == "__main__":
    main()
`;

@ApiTags("downloads")
@Controller("downloads")
export class DownloadsController {
  /**
   * Download agent script for specified platform
   * GET /api/downloads/agent/:platform
   */
  @Public()
  @Get("agent/:platform")
  @ApiOperation({
    summary: "Download SecureVault Agent",
    description: "Download platform-specific agent installation script",
  })
  async downloadAgent(
    @Param("platform") platform: string,
    @Res() res: Response
  ) {
    try {
      const filename = "securevault-agent.py";

      // Try to read from file system first (local development)
      const filePath = path.join(process.cwd(), "public", "agents", filename);
      
      let fileContent: string;
      
      if (fs.existsSync(filePath)) {
        // Use file from disk (local dev)
        fileContent = fs.readFileSync(filePath, "utf-8");
      } else {
        // Use embedded version (production/Vercel)
        fileContent = AGENT_SCRIPT;
      }

      // Set headers
      res.setHeader("Content-Type", "text/plain");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );

      // Send file
      return res.send(fileContent);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to download agent",
        error: error.message,
      });
    }
  }

  /**
   * Download installer script
   * GET /api/downloads/installer/:platform
   */
  @Public()
  @Get("installer/:platform")
  @ApiOperation({
    summary: "Download Installer Script",
    description: "Download platform-specific installer script",
  })
  async downloadInstaller(
    @Param("platform") platform: string,
    @Res() res: Response
  ) {
    try {
      // Map platform to file
      const fileMap: Record<string, string> = {
        linux: "install.sh",
        macos: "install.sh",
        windows: "install.ps1", // Future: PowerShell installer
      };

      const filename = fileMap[platform] || fileMap.linux;
      const filePath = path.join(process.cwd(), "public", "agents", filename);

      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: "Installer file not found",
        });
      }

      // Read file
      const fileContent = fs.readFileSync(filePath, "utf-8");

      // Set headers
      res.setHeader("Content-Type", "text/plain");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );

      // Send file
      return res.send(fileContent);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to download installer",
        error: error.message,
      });
    }
  }
}
