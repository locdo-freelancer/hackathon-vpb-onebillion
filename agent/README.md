# SecureVault Agent

Lightweight monitoring agent for SecureVault platform.

## 🚀 Quick Start

### Option 1: One-Command Install (Recommended)

```bash
# Linux/macOS
curl -sSL https://your-domain.com/install.sh | bash -s -- \
  --server https://hackathon-vpb-onebillion.vercel.app \
  --token YOUR_TOKEN_HERE
```

### Option 2: Manual Install

**Step 1: Download Agent**
```bash
# Clone or download the agent
cd /path/to/one-billion/agent
```

**Step 2: Run Installer**
```bash
chmod +x install.sh
./install.sh --server https://hackathon-vpb-onebillion.vercel.app --token YOUR_TOKEN_HERE
```

**Step 3: Start Agent**
```bash
python3 ~/.securevault/securevault-agent.py \
  --server https://hackathon-vpb-onebillion.vercel.app \
  --token YOUR_TOKEN_HERE
```

### Option 3: Run Directly (No Install)

```bash
python3 securevault-agent.py \
  --server https://hackathon-vpb-onebillion.vercel.app \
  --token YOUR_TOKEN_HERE \
  --interval 30
```

## 📋 Requirements

- Python 3.6+ (no external dependencies!)
- Network access to SecureVault backend

## 🔧 Configuration

**Command Line Arguments:**
- `--server <URL>` - SecureVault backend URL (required)
- `--token <TOKEN>` - Installation token from onboarding (required)
- `--interval <SECONDS>` - Heartbeat interval in seconds (default: 30)

**Example:**
```bash
python3 securevault-agent.py \
  --server https://hackathon-vpb-onebillion.vercel.app \
  --token b5266534b06c6f7cba2b20f7b1747ff3178006328c00590b0144dee3c7847435 \
  --interval 30
```

## 📊 Metrics Collected

The agent sends the following metrics every heartbeat:
- **OS Information** - Operating system, version, architecture
- **Hostname** - Server hostname
- **IP Address** - Local IP address
- **CPU Usage** - Current CPU utilization (%)
- **Memory Usage** - Current RAM utilization (%)
- **Disk Usage** - Current disk utilization (%)

## 🎯 Features

✅ **Zero Dependencies** - Uses only Python standard library  
✅ **Lightweight** - <200 lines of code, minimal resource usage  
✅ **Cross-Platform** - Works on Linux, macOS, Windows  
✅ **Auto-Registration** - Automatically registers on first heartbeat  
✅ **Resilient** - Retries on connection failures  
✅ **Simple** - Easy to understand and modify  

## 🔐 Security

- Token-based authentication
- HTTPS communication (when server uses HTTPS)
- No sensitive data collection
- No remote code execution

## 🛠️ Troubleshooting

**Agent won't start:**
```bash
# Check Python version
python3 --version

# Should be 3.6 or higher
```

**Connection errors:**
```bash
# Test server connectivity
curl https://hackathon-vpb-onebillion.vercel.app/api/health

# Check firewall settings
```

**Agent registered but not showing in dashboard:**
```bash
# Wait 30 seconds for next heartbeat
# Or restart agent with shorter interval:
python3 securevault-agent.py --server <URL> --token <TOKEN> --interval 10
```

## 📝 Production Deployment

For production, consider:

1. **Install as System Service**
   - Linux: systemd service
   - macOS: launchd plist
   - Windows: Windows Service

2. **Add Dependencies**
   ```bash
   pip install psutil  # For accurate CPU/memory/disk metrics
   ```

3. **Enable Logging**
   ```bash
   # Run in background with logs
   nohup python3 securevault-agent.py --server <URL> --token <TOKEN> > agent.log 2>&1 &
   ```

4. **Set Auto-Start on Boot**
   ```bash
   # Linux systemd example
   sudo systemctl enable securevault-agent
   sudo systemctl start securevault-agent
   ```

## 🎪 Demo Mode

For hackathon demos, you can run multiple agents locally:

```bash
# Terminal 1: Linux agent
python3 securevault-agent.py --server <URL> --token <TOKEN1>

# Terminal 2: macOS agent (same machine, different token)
python3 securevault-agent.py --server <URL> --token <TOKEN2>
```

## 📄 License

MIT License - Free for hackathon and production use
