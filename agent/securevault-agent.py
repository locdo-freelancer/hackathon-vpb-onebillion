#!/usr/bin/env python3
"""
SecureVault Agent - Lightweight monitoring agent
Sends heartbeat to SecureVault backend with system metrics
"""

import json
import platform
import socket
import sys
import time
from urllib import request, error
from urllib.parse import urljoin

# Agent version
VERSION = "1.0.0"

# Configuration (will be set via command line arguments)
SERVER_URL = None
TOKEN = None
HEARTBEAT_INTERVAL = 30  # seconds


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
        # Create a socket to determine the local IP
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"


def get_cpu_usage():
    """Get CPU usage (simple approximation without psutil)"""
    try:
        # For demo, return a random-ish value based on time
        # In production, use psutil.cpu_percent()
        import random
        return round(random.uniform(10, 60), 1)
    except Exception:
        return 0.0


def get_memory_usage():
    """Get memory usage (simple approximation without psutil)"""
    try:
        # For demo, return a random-ish value
        # In production, use psutil.virtual_memory().percent
        import random
        return round(random.uniform(40, 80), 1)
    except Exception:
        return 0.0


def get_disk_usage():
    """Get disk usage (simple approximation without psutil)"""
    try:
        # For demo, return a random-ish value
        # In production, use psutil.disk_usage('/').percent
        import random
        return round(random.uniform(30, 70), 1)
    except Exception:
        return 0.0


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
        url = urljoin(SERVER_URL, "/api/agent/check-in")
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {TOKEN}",
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
    print("=" * 50)
    print("  SecureVault Agent v" + VERSION)
    print("=" * 50)
    print(f"Server: {SERVER_URL}")
    print(f"Token: {TOKEN[:16]}...{TOKEN[-8:]}")
    print(f"Interval: {HEARTBEAT_INTERVAL}s")
    print(f"OS: {platform.system()} {platform.release()}")
    print(f"Hostname: {socket.gethostname()}")
    print("=" * 50)
    print()


def main():
    """Main agent loop"""
    global SERVER_URL, TOKEN, HEARTBEAT_INTERVAL

    # Parse command line arguments
    if len(sys.argv) < 3:
        print(
            "Usage: securevault-agent.py --server <SERVER_URL> --token <TOKEN> [--interval <SECONDS>]")
        print("\nExample:")
        print("  python3 securevault-agent.py \\")
        print("    --server https://hackathon-vpb-onebillion.vercel.app \\")
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

    # Initial heartbeat
    print("Sending initial heartbeat...")
    if send_heartbeat():
        print("Agent registered successfully!\n")
    else:
        print("Failed to register. Will retry...\n")

    # Main loop
    print("Starting heartbeat loop (Press Ctrl+C to stop)...")
    print()

    try:
        while True:
            time.sleep(HEARTBEAT_INTERVAL)
            timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
            print(f"[{timestamp}] ", end="")
            send_heartbeat()
    except KeyboardInterrupt:
        print("\n\nAgent stopped by user")
        sys.exit(0)


if __name__ == "__main__":
    main()
