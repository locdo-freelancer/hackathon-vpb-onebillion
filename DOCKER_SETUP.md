# SecureVault Agent - Docker Test Environment

## 🐳 Tại sao dùng Docker?

### macOS (Vấn đề)
- ❌ Unified Logging System phức tạp
- ❌ Không có `/var/log/auth.log`
- ❌ Log format khác Linux
- ❌ Cần sudo, permission phức tạp

### Docker Linux Container (Giải pháp)
- ✅ Ubuntu 22.04 với `/var/log/auth.log` chuẩn
- ✅ SSH logs format giống production Linux server
- ✅ Agent code Linux đã test kỹ (v2.0/v2.1)
- ✅ Chạy local nhưng giống production
- ✅ Dễ reset, test lại nhiều lần

## 🚀 Quick Start

### Bước 1: Build Docker image

```bash
cd /Users/doxuanloc/one-billion

docker build -f docker/Dockerfile.agent-test -t securevault-agent-test .
```

### Bước 2: Lấy install token

Vào frontend → Onboarding hoặc Sites → Copy install token

### Bước 3: Chạy container

```bash
# Replace YOUR_TOKEN với token thật
docker run -d \
  --name securevault-agent \
  -p 2222:22 \
  -e SERVER_URL=http://host.docker.internal:3001 \
  -e TOKEN=YOUR_TOKEN_HERE \
  securevault-agent-test
```

**Lưu ý:** Dùng `host.docker.internal:3001` để container connect tới backend chạy trên macOS

### Bước 4: Xem logs (real-time)

```bash
docker logs -f securevault-agent
```

Output:
```
=========================================
SecureVault Agent Test Container
=========================================

Starting SSH service...
✅ SSH service started
✅ Server: http://host.docker.internal:3001
✅ Token: b5266534b06c6f7c...c7847435

Container IP: 172.17.0.2
SSH Port: 22

=========================================
Starting SecureVault Agent...
=========================================

============================================================
  SecureVault Agent v2.1.0
  🛡️  Intelligent Security Monitoring
============================================================
Server: http://host.docker.internal:3001
Token: b5266534b06c6f7c...c7847435
Heartbeat: 30s | Threat Check: 60s
OS: Linux 5.15.0
Hostname: abc123def456
============================================================
Features:
  ✓ System metrics monitoring
  ✓ SSH brute force detection
  ✓ Failed login tracking
  ✓ Real-time threat reporting
============================================================

✓ Heartbeat sent successfully (Agent ID: 123)
Agent registered successfully!

Starting monitoring loop (Press Ctrl+C to stop)...
```

### Bước 5: Test attack!

**Option A: Từ bên ngoài container (từ macOS)**
```bash
# SSH tới port 2222 (mapped từ container port 22)
for i in {1..6}; do 
    echo "Attack $i"; 
    ssh -o StrictHostKeyChecking=no -o ConnectTimeout=2 fakeuser@localhost -p 2222
    sleep 1
done
```

**Option B: Từ bên trong container**
```bash
docker exec -it securevault-agent bash /opt/attack.sh
```

### Bước 6: Xem kết quả

Agent logs sẽ hiện:
```
[2025-11-10 07:00:00] ✓ Heartbeat sent successfully (Agent ID: 123)
[2025-11-10 07:00:30] 🔍 Checking for security threats...
  → Found 15 log lines
  → Found 6 failed SSH attempts
  → IP 172.17.0.1 has 6 failed attempts (threshold: 5)

🚨 1 threat(s) detected!
  → SSH brute force attack detected from 172.17.0.1 (6 failed attempts in 10 minutes)
  🆕 NEW - Threat reported: 172.17.0.1
```

Frontend dashboard sẽ hiện threat mới! 🎉

## 🔧 Commands Reference

### Build & Run
```bash
# Build image
docker build -f docker/Dockerfile.agent-test -t securevault-agent-test .

# Run container
docker run -d \
  --name securevault-agent \
  -p 2222:22 \
  -e SERVER_URL=http://host.docker.internal:3001 \
  -e TOKEN=your_token_here \
  securevault-agent-test

# View logs
docker logs -f securevault-agent

# Stop container
docker stop securevault-agent

# Remove container
docker rm securevault-agent

# Restart fresh
docker stop securevault-agent && docker rm securevault-agent
docker run -d --name securevault-agent -p 2222:22 \
  -e SERVER_URL=http://host.docker.internal:3001 \
  -e TOKEN=your_token \
  securevault-agent-test
```

### Debugging

```bash
# Enter container
docker exec -it securevault-agent bash

# Check SSH logs inside container
docker exec securevault-agent tail -f /var/log/auth.log

# Check if SSH is running
docker exec securevault-agent service ssh status

# Manual attack from inside
docker exec securevault-agent bash /opt/attack.sh

# Check agent is running
docker exec securevault-agent ps aux | grep python
```

### Attack Testing

```bash
# Test 1: Simple attack (6 attempts)
for i in {1..6}; do ssh fakeuser@localhost -p 2222; done

# Test 2: Slower attack (1 per second)
for i in {1..6}; do echo "[$i]"; ssh -o ConnectTimeout=2 fakeuser@localhost -p 2222; sleep 1; done

# Test 3: Different usernames
for user in admin root test fakeuser invaliduser; do ssh $user@localhost -p 2222; done

# Test 4: Rapid fire (12 attempts)
for i in {1..12}; do ssh test@localhost -p 2222 & done; wait
```

## 📊 Expected Results

### Agent Detection (after ~60s)
```
🔍 Checking for security threats...
  → Found 20 log lines
  → Found 6 failed SSH attempts
  → IP 172.17.0.1 has 6 failed attempts (threshold: 5)

🚨 1 threat(s) detected!
  → SSH brute force attack detected from 172.17.0.1
  🆕 NEW - Threat reported: 172.17.0.1
```

### Database Record
```sql
SELECT * FROM threat_indicators WHERE indicator LIKE '172.17.%';

-- Fields:
-- indicator: 172.17.0.1
-- threat_type: ip
-- severity: high
-- first_seen: 2025-11-10 07:00:00
-- last_seen: 2025-11-10 07:00:30
-- tags: ["ssh", "brute-force", "linux"]
-- intelligence: [{timestamp, source: "agent", raw_logs: [...]}]
```

### Frontend Dashboard
- Threats page → New threat appears
- Indicator: `172.17.0.1`
- Type: IP Address
- Severity: High
- Description: "SSH brute force attack detected from 172.17.0.1 (6 failed attempts in 10 minutes)"
- Raw Logs: Shows actual SSH failure messages

## 🎯 Troubleshooting

### Container không connect được backend
```bash
# Check backend đang chạy
curl http://localhost:3001/api/health

# Nếu backend chạy ở port khác, update SERVER_URL
docker run ... -e SERVER_URL=http://host.docker.internal:YOUR_PORT ...
```

### Agent không detect threats
```bash
# Vào container check logs
docker exec securevault-agent tail -100 /var/log/auth.log

# Bạn phải thấy dòng:
# Failed password for invalid user fakeuser from 172.17.0.1 port 12345 ssh2

# Nếu không có → SSH attack chưa tạo log
# Thử attack lại
```

### Container crash
```bash
# Check logs
docker logs securevault-agent

# Rebuild
docker stop securevault-agent && docker rm securevault-agent
docker build -f docker/Dockerfile.agent-test -t securevault-agent-test .
docker run -d --name securevault-agent -p 2222:22 \
  -e SERVER_URL=http://host.docker.internal:3001 \
  -e TOKEN=your_token \
  securevault-agent-test
```

## 🎉 Ưu điểm của Docker approach

1. **Giống production**: Linux container = Linux server thật
2. **Dễ test**: Build → Run → Test → Reset trong giây lát
3. **Không ảnh hưởng macOS**: Chạy isolated, không cần sudo
4. **Auth logs chuẩn**: `/var/log/auth.log` với format đúng
5. **Demo tốt**: Chạy local nhưng giống real-world scenario
6. **Scalable**: Muốn test nhiều agent → chạy nhiều container

## 🚀 Production Deployment

Sau khi test thành công trên Docker local, deploy production:

```bash
# Build production image
docker build -f docker/Dockerfile.agent-test -t securevault-agent:latest .

# Push to registry (Docker Hub, ECR, etc.)
docker tag securevault-agent:latest your-registry/securevault-agent:latest
docker push your-registry/securevault-agent:latest

# Deploy on Linux server
docker run -d \
  --name securevault-agent \
  --restart unless-stopped \
  -e SERVER_URL=https://your-production-backend.com \
  -e TOKEN=production_token \
  your-registry/securevault-agent:latest
```

## 💡 Tips

- **Multiple sites**: Chạy nhiều containers với tokens khác nhau
- **Network**: Nếu backend cũng trong Docker, dùng Docker network
- **Logs**: Mount volume để persist logs: `-v ./logs:/var/log`
- **SSH keys**: Có thể mount SSH keys để test key-based auth failures

---

**Kết luận:** Docker + Linux container = Giải pháp tốt nhất cho macOS development! 🎯
