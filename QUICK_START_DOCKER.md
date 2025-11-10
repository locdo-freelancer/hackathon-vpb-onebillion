# 🚀 Quick Start - Docker Agent Testing

## Tại sao Docker?
- ✅ **Linux container** → `/var/log/auth.log` chuẩn như production
- ✅ **Không cần sửa code** → Agent v2.1 chạy ngay trên Linux
- ✅ **Không ảnh hưởng macOS** → Chạy isolated container
- ✅ **Dễ reset** → Xóa container, chạy lại trong 10s
- ✅ **Giống production** → Test môi trường thật

## 📋 3 Bước để có Threat Detection hoạt động

### Bước 1: Build Docker Image (1 lần duy nhất)

```bash
cd /Users/doxuanloc/one-billion

docker build -f docker/Dockerfile.agent-test -t securevault-agent-test .
```

Sẽ mất ~2-3 phút để download Ubuntu, cài SSH, Python...

### Bước 2: Lấy Install Token

**Frontend → Sites → Tạo site mới (hoặc dùng site có sẵn) → Copy token**

Hoặc dùng token test: `b5266534b06c6f7cba2b20f7b1747ff3178006328c00590b0144dee3c7847435`

### Bước 3: Chạy Container với Agent

```bash
docker run -d \
  --name securevault-agent \
  -p 2222:22 \
  -e SERVER_URL=http://host.docker.internal:3001 \
  -e TOKEN=b5266534b06c6f7cba2b20f7b1747ff3178006328c00590b0144dee3c7847435 \
  securevault-agent-test
```

**Xem logs real-time:**
```bash
docker logs -f securevault-agent
```

Output:
```
=========================================
SecureVault Agent Test Container
=========================================

✅ SSH service started
✅ Server: http://host.docker.internal:3001
✅ Token: b5266534b06c6f7c...c7847435

=========================================
Starting SecureVault Agent...
=========================================

============================================================
  SecureVault Agent v2.1.0
  🛡️  Intelligent Security Monitoring
============================================================

✓ Heartbeat sent successfully (Agent ID: 123)
Agent registered successfully!

Starting monitoring loop (Press Ctrl+C to stop)...
```

## 🎯 Test Attack - 2 Cách

### Cách 1: Từ bên ngoài container (từ macOS)

```bash
# SSH tới port 2222 (mapped từ container)
for i in {1..6}; do 
    echo "Attack $i"
    ssh -o StrictHostKeyChecking=no fakeuser@localhost -p 2222
    sleep 1
done
```

### Cách 2: Từ bên trong container (RECOMMENDED)

```bash
docker exec -it securevault-agent bash /opt/attack.sh
```

Output:
```
🚀 SSH Brute Force Attack Test (Linux)
=======================================

Attempting 6 SSH connections with invalid user...
Agent should detect after 5 attempts!

[1/6] Attack attempt...
[2/6] Attack attempt...
[3/6] Attack attempt...
[4/6] Attack attempt...
[5/6] Attack attempt...
[6/6] Attack attempt...

✅ Attack completed!

Check /var/log/auth.log:
Nov 10 07:00:01 abc123 sshd[1234]: Failed password for invalid user fakeuser from 172.17.0.1 port 12345 ssh2
Nov 10 07:00:02 abc123 sshd[1235]: Failed password for invalid user fakeuser from 172.17.0.1 port 12346 ssh2
...
```

## 📊 Kết quả mong đợi

### Agent logs (sau ~60s):
```bash
docker logs -f securevault-agent
```

Output:
```
[2025-11-10 07:00:30] 🔍 Checking for security threats...
  → Found 20 log lines
  → Found 6 failed SSH attempts
  → IP 172.17.0.1 has 6 failed attempts (threshold: 5)

🚨 1 threat(s) detected!
  → SSH brute force attack detected from 172.17.0.1 (6 failed attempts in 10 minutes)
  🆕 NEW - Threat reported: 172.17.0.1
```

### Frontend Dashboard:
- Vào **Threats** page
- Sẽ thấy threat mới:
  - **Indicator:** `172.17.0.1`
  - **Type:** IP Address
  - **Severity:** High
  - **Description:** SSH brute force attack detected
  - **Raw Logs:** Failed password messages

## 🔄 Reset & Test lại

```bash
# Stop và xóa container
docker stop securevault-agent && docker rm securevault-agent

# Chạy lại (container mới, clean state)
docker run -d \
  --name securevault-agent \
  -p 2222:22 \
  -e SERVER_URL=http://host.docker.internal:3001 \
  -e TOKEN=your_token \
  securevault-agent-test

# Attack lại
docker exec -it securevault-agent bash /opt/attack.sh

# Xem logs
docker logs -f securevault-agent
```

## 🐛 Debug

### Check SSH logs trong container:
```bash
docker exec securevault-agent tail -f /var/log/auth.log
```

Phải thấy:
```
Failed password for invalid user fakeuser from 172.17.0.1 port 54321 ssh2
```

### Check agent có chạy không:
```bash
docker exec securevault-agent ps aux | grep python
```

### Vào container để debug:
```bash
docker exec -it securevault-agent bash

# Trong container:
tail -f /var/log/auth.log
ps aux | grep sshd
netstat -tlnp | grep 22
```

## ✅ Checklist

- [ ] Docker Desktop đang chạy
- [ ] Build image thành công: `docker images | grep securevault-agent-test`
- [ ] Backend đang chạy: `curl http://localhost:3001/api/health`
- [ ] Container running: `docker ps | grep securevault-agent`
- [ ] Agent sending heartbeat: `docker logs securevault-agent | grep Heartbeat`
- [ ] Attack script chạy: `docker exec -it securevault-agent bash /opt/attack.sh`
- [ ] Threats detected: `docker logs securevault-agent | grep "threat(s) detected"`
- [ ] Dashboard hiển thị threat ✅

## 🎉 Xong!

Bây giờ bạn có:
- ✅ Linux container chạy SSH server
- ✅ Agent detect SSH attacks (real Linux logs)
- ✅ Threats được report lên backend
- ✅ Frontend hiển thị threats
- ✅ Giống production environment

**Perfect cho hackathon demo! 🚀**

---

## 💡 Tips

**Multiple agents (multiple sites):**
```bash
# Agent 1
docker run -d --name agent1 -p 2222:22 -e TOKEN=token1 ...

# Agent 2
docker run -d --name agent2 -p 2223:22 -e TOKEN=token2 ...
```

**Custom threshold:**
Sửa `THREAT_THRESHOLD = 5` trong `agent/securevault-agent.py` thành số khác, rồi rebuild image.

**Faster testing:**
Giảm `LOG_CHECK_INTERVAL = 60` xuống `30` để agent check nhanh hơn.
