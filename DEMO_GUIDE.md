# 🎯 SecureVault - Hackathon Demo Guide

## 📋 Tổng quan

SecureVault là nền tảng giám sát và phát hiện mối đe dọa an ninh mạng thời gian thực, được tối ưu hóa cho môi trường **Windows Server**.

### ✨ Tính năng chính

- 🛡️ **Real-time Threat Detection** - Phát hiện tấn công SSH brute force
- 📊 **Dashboard Analytics** - Theo dõi metrics hệ thống
- 🌐 **Agent Management** - Quản lý agents từ xa
- 🚨 **Threat Intelligence** - Phân tích và phân loại threats
- 🔍 **Incident Management** - Quản lý sự cố bảo mật
- ⚙️ **Action Console** - Remediation tự động

---

## 🚀 Quick Start (Demo)

### 1. Prerequisites

- **Node.js** 18+ (LTS)
- **PostgreSQL** (via Docker hoặc local)
- **Python** 3.8+ (cho agent)
- **Windows** 10/11 hoặc Windows Server 2016+

### 2. Cài đặt Backend

```powershell
cd backend
npm install
```

Tạo file `.env`:
```env
# Database (Local PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=onebillion
DB_PASSWORD=onebillion123
DB_NAME=one_billion

# JWT
JWT_SECRET=your-secure-secret-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Server
PORT=3001
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000
```

Khởi động PostgreSQL (Docker):
```powershell
docker compose up -d
```

Chạy backend:
```powershell
npm run start:dev
```

### 3. Cài đặt Frontend

```powershell
cd frontend
npm install
```

Tạo file `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Chạy frontend:
```powershell
npm run dev
```

### 4. Truy cập ứng dụng

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Swagger Docs**: http://localhost:3001/api/docs
- **pgAdmin**: http://localhost:5050 (admin@onebillion.com / admin123)

---

## 🎭 Demo Workflow

### Step 1: Đăng ký tài khoản

1. Truy cập http://localhost:3000/signup
2. Tạo tài khoản demo
3. Đăng nhập vào hệ thống

### Step 2: Onboarding - Cài đặt Agent

1. **Navigate** → Onboarding page (tự động hoặc từ menu)
2. **Step 1: Site Details**
   - Site Name: `Demo Production Server`
   - IP Address: `192.168.1.100`
   - Port: `443`
   - Domain: `demo.securevault.com` (optional)

3. **Step 2: Server Type**
   - Chọn: **Windows Server** (chỉ support Windows)

4. **Step 3: Install Agent**
   - Copy PowerShell command được generate
   - Mở PowerShell as Administrator
   - Chạy command để cài agent:

   ```powershell
   # Download và chạy agent
   Invoke-WebRequest -Uri "http://localhost:3001/api/downloads/agent/windows" -OutFile "agent.py"; python agent.py --server http://localhost:3001 --token YOUR_TOKEN
   ```

   **Hoặc sử dụng file có sẵn:**
   ```powershell
   # Copy agent từ project
   Copy-Item ".\agent\securevault-agent.py" "C:\agent.py"
   
   # Chạy agent với token từ UI
   python C:\agent.py --server http://localhost:3001 --token YOUR_INSTALL_TOKEN
   ```

5. **Step 4: Validation**
   - Agent tự động kết nối
   - Validation checks sẽ pass (Network, Auth, Sync)
   - Click "Complete" để finish onboarding

### Step 3: Giả lập Threat Attack (Demo)

**Option 1: Mock Attack Script** (Recommended cho demo)

```powershell
cd docker
.\attack-mock.ps1 -Token YOUR_AGENT_TOKEN
```

Script này sẽ:
- ✅ Tạo 5 fake SSH brute force threats
- ✅ Gửi trực tiếp vào API
- ✅ Không cần SSH server
- ✅ Perfect cho demo/testing

**Option 2: Real SSH Attack** (Nếu có SSH server)

```powershell
# Nếu có OpenSSH Server running
.\attack.ps1
```

### Step 4: Xem Threats trong Dashboard

1. **Navigate** → Threats page
2. Xem danh sách threats phát hiện được:
   - 🔴 HIGH severity: 3 threats (16-18 failed attempts)
   - 🟡 MEDIUM severity: 1 threat (13 attempts)
   - 🟢 LOW severity: 1 threat (8 attempts)

3. **Click vào threat** để xem chi tiết:
   - IP Address
   - Severity level
   - Confidence score
   - Failed login attempts
   - Raw logs
   - Metadata

4. **Apply Filters:**
   - Severity: High
   - Type: IP
   - Time Range: Last 24 hours
   - Search: Nhập IP để tìm

### Step 5: Dashboard Analytics

1. **Navigate** → Dashboard
2. Xem metrics:
   - 📊 Active Sites
   - 🔴 Critical Threats
   - 🟡 Active Incidents
   - ⚡ Recent Activities

### Step 6: Agents Management

1. **Navigate** → Agents page
2. Xem agent status:
   - ✅ Connected agents
   - 📊 System metrics (CPU, Memory, Disk)
   - 🕐 Last heartbeat
   - 📍 Agent location

---

## 🎬 Demo Script (Presentation)

### 1. Opening (2 phút)

> "SecureVault là giải pháp giám sát bảo mật thời gian thực cho Windows Server. 
> Hệ thống phát hiện và ngăn chặn các cuộc tấn công mạng tự động."

### 2. Live Demo (5 phút)

**Scene 1: Onboarding (1 phút)**
- Show onboarding flow
- Windows-only support
- Easy agent installation

**Scene 2: Generate Threats (30 giây)**
```powershell
.\attack-mock.ps1 -Token YOUR_TOKEN
```

**Scene 3: Threat Detection (2 phút)**
- Navigate to Threats page
- Show real-time detection
- Click vào threat để xem detail
- Demonstrate filters

**Scene 4: Dashboard Overview (1 phút)**
- Show metrics và charts
- Real-time updates
- System health monitoring

**Scene 5: Agent Management (30 giây)**
- Show agent status
- System metrics
- Heartbeat monitoring

### 3. Key Points (Closing)

✅ **Real-time Detection** - Phát hiện tấn công trong vòng vài giây  
✅ **Windows Optimized** - Tối ưu cho môi trường Windows  
✅ **Easy Deployment** - Cài agent chỉ với 1 lệnh PowerShell  
✅ **Actionable Intelligence** - Threat intelligence với confidence scores  
✅ **Scalable** - Quản lý nhiều sites từ 1 dashboard  

---

## 🔧 Technical Stack

### Frontend
- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **Zustand** (State Management)

### Backend
- **NestJS 10**
- **TypeORM**
- **PostgreSQL**
- **JWT Authentication**
- **Swagger/OpenAPI**

### Agent
- **Python 3.8+**
- **Real-time log monitoring**
- **Heartbeat mechanism**
- **Threat detection algorithms**

---

## 📁 Project Structure

```
hackathon-vpb-onebillion/
├── frontend/                 # Next.js Frontend
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom hooks
│   │   ├── lib/             # Services & utilities
│   │   └── types/           # TypeScript types
│   └── package.json
│
├── backend/                 # NestJS Backend
│   ├── src/
│   │   ├── modules/         # Feature modules
│   │   ├── config/          # Configuration
│   │   └── main.ts
│   ├── libs/                # Shared libraries
│   │   └── entities/        # Database entities
│   └── package.json
│
├── agent/                   # Python Agent
│   ├── securevault-agent.py # Main agent script
│   ├── install.sh          # Linux installer
│   └── install.ps1         # Windows installer
│
├── docker/                  # Docker & Testing
│   ├── attack-mock.ps1     # Mock attack script (DEMO)
│   ├── attack.ps1          # Real SSH attack test
│   └── attack.sh           # Linux attack test
│
├── docker-compose.yml       # PostgreSQL + pgAdmin
├── DEMO_GUIDE.md           # This file
├── README.md               # Project overview
└── POSTGRES_SETUP.md       # Database setup guide
```

---

## 🐛 Troubleshooting

### Agent không connect được

**Check:**
1. Backend có đang chạy không? (http://localhost:3001)
2. Token có đúng không?
3. Python có được cài đặt không? `python --version`
4. Firewall có block không?

**Fix:**
```powershell
# Restart agent với correct token
python agent.py --server http://localhost:3001 --token CORRECT_TOKEN
```

### Threats không hiển thị

**Check:**
1. Agent có đang chạy không?
2. Mock attack script có chạy thành công không?
3. Database có data không?

**Fix:**
```powershell
# Chạy lại mock attack
cd docker
.\attack-mock.ps1 -Token YOUR_TOKEN

# Refresh browser
```

### Database connection error

**Check:**
1. PostgreSQL container có running không? `docker ps`
2. Credentials trong `.env` có đúng không?

**Fix:**
```powershell
# Restart PostgreSQL
docker compose down
docker compose up -d

# Restart backend
cd backend
npm run start:dev
```

---

## 📊 Demo Data

### Sample Threats (Mock Attack Script)

```
IP: 203.0.113.42      → Severity: LOW    (8 attempts)
IP: 185.220.101.67    → Severity: MEDIUM (13 attempts)
IP: 45.76.123.45      → Severity: HIGH   (16 attempts)
IP: 192.0.2.156       → Severity: HIGH   (17 attempts)
IP: 198.51.100.88     → Severity: HIGH   (18 attempts)
```

---

## 🎯 Production Deployment

### Environment Variables (Production)

**Backend `.env`:**
```env
DB_HOST=your-production-db.postgres.database.azure.com
DB_PORT=5432
DB_USERNAME=admin
DB_PASSWORD=strong-password-here
DB_NAME=securevault_prod

JWT_SECRET=generate-secure-random-key-here
JWT_EXPIRES_IN=24h

PORT=3001
NODE_ENV=production

CORS_ORIGIN=https://securevault.yourdomain.com
```

**Frontend `.env.production`:**
```env
NEXT_PUBLIC_API_URL=https://api.securevault.yourdomain.com
```

### Deploy to Vercel (Frontend)

```bash
vercel --prod
```

### Deploy to Railway/Heroku (Backend)

```bash
# Set environment variables
railway up
```

---

## 📝 License

MIT License - Hackathon Project

---

## 👥 Team

- **Developer**: [Your Team Name]
- **Event**: VPBank Hackathon
- **Year**: 2025

---

## 🔗 Links

- **GitHub**: https://github.com/locdo-freelancer/hackathon-vpb-onebillion
- **Demo Video**: [Link to demo video]
- **Presentation**: [Link to slides]

---

**🎉 Good luck with your hackathon demo! 🚀**
