# 🛡️ SecureVault - Cybersecurity Monitoring Platform

> Real-time threat detection and security monitoring platform optimized for Windows environments

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10-red)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)](https://www.postgresql.org/)

## 📖 Overview

SecureVault is an enterprise-grade cybersecurity monitoring platform that provides:

- 🔍 **Real-time Threat Detection** - SSH brute force, malware, and anomaly detection
- 📊 **Security Analytics** - Comprehensive dashboards and metrics
- 🤖 **Automated Response** - Action console for automated remediation
- 🌐 **Multi-Site Management** - Centralized monitoring for multiple servers
- 🛡️ **Windows Optimized** - Designed specifically for Windows Server environments

**🎯 Built for:** VPBank Hackathon 2025

---

## 🚀 Quick Start

### For Demo/Development

See **[DEMO_GUIDE.md](./DEMO_GUIDE.md)** for complete hackathon demo instructions.

**TL;DR:**

```powershell
# 1. Start PostgreSQL
docker compose up -d

# 2. Backend
cd backend
npm install
npm run start:dev

# 3. Frontend (new terminal)
cd frontend
npm install
npm run dev

# 4. Generate demo threats
cd docker
.\attack-mock.ps1 -Token YOUR_AGENT_TOKEN
```

Access: http://localhost:3000

---

## 🏗️ Architecture

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│  Next.js        │─────▶│  NestJS          │─────▶│  PostgreSQL     │
│  Frontend       │◀─────│  Backend API     │◀─────│  Database       │
└─────────────────┘      └──────────────────┘      └─────────────────┘
                                  │
                                  │ WebSocket/HTTP
                                  ▼
                         ┌──────────────────┐
                         │  Python Agent    │
                         │  (Windows Server)│
                         └──────────────────┘
```

### Tech Stack

**Frontend:**
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Zustand (State Management)

**Backend:**
- NestJS 10
- TypeORM
- PostgreSQL
- JWT Authentication
- Swagger/OpenAPI

**Agent:**
- Python 3.8+
- Windows Event Log monitoring
- Heartbeat mechanism
- Threat detection algorithms

---

## 📁 Project Structure

```
securevault/
├── frontend/                 # Next.js Frontend
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # React components (SOLID)
│   │   ├── hooks/           # Custom hooks
│   │   ├── lib/             # Services & API clients
│   │   ├── stores/          # Zustand stores
│   │   └── types/           # TypeScript interfaces
│   └── package.json
│
├── backend/                 # NestJS Backend
│   ├── src/
│   │   ├── modules/         # Feature modules
│   │   │   ├── auth/        # Authentication
│   │   │   ├── threats/     # Threat management
│   │   │   ├── agents/      # Agent communication
│   │   │   ├── incidents/   # Incident tracking
│   │   │   └── ...
│   │   ├── config/          # Configuration
│   │   └── main.ts
│   ├── libs/
│   │   └── entities/        # Database entities
│   └── package.json
│
├── agent/                   # Python Security Agent
│   ├── securevault-agent.py # Main agent
│   ├── install.ps1         # Windows installer
│   └── install.sh          # Linux installer (future)
│
├── docker/                  # Testing & Demo
│   ├── attack-mock.ps1     # Mock attack generator
│   ├── attack.ps1          # Real SSH attack test
│   ├── attack.sh           # Linux version
│   └── Dockerfile.agent-test
│
├── docker-compose.yml       # PostgreSQL + pgAdmin
├── DEMO_GUIDE.md           # 📖 Hackathon demo guide
├── POSTGRES_SETUP.md       # Database setup
└── README.md               # This file
```

---

## 🎯 Features

### 1. Threat Intelligence
- Real-time SSH brute force detection
- IP reputation analysis
- Confidence scoring
- Threat categorization (Critical/High/Medium/Low)

### 2. Dashboard Analytics
- Active sites monitoring
- Critical threat counts
- Incident tracking
- System health metrics

### 3. Agent Management
- Windows agent deployment
- Heartbeat monitoring
- System metrics (CPU, RAM, Disk)
- Remote configuration

### 4. Incident Response
- Automated threat reporting
- Incident timeline
- Remediation actions
- Alert notifications

### 5. Windows-First Design
- Optimized for Windows Server
- PowerShell-based installation
- Windows Event Log integration
- Windows-specific threat detection

---

## 🔧 Development Setup

### Prerequisites

- Node.js 18+ LTS
- PostgreSQL 15+ (or Docker)
- Python 3.8+
- Git

### 1. Clone Repository

```bash
git clone https://github.com/locdo-freelancer/hackathon-vpb-onebillion.git
cd hackathon-vpb-onebillion
```

### 2. Backend Setup

```powershell
cd backend
npm install
```

Create `.env` file:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=onebillion
DB_PASSWORD=onebillion123
DB_NAME=one_billion

JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

Start PostgreSQL:
```powershell
docker compose up -d
```

Run backend:
```powershell
npm run start:dev
```

### 3. Frontend Setup

```powershell
cd frontend
npm install
```

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Run frontend:
```powershell
npm run dev
```

### 4. Access Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Swagger Docs: http://localhost:3001/api/docs
- pgAdmin: http://localhost:5050

---

## 📚 Documentation

- **[DEMO_GUIDE.md](./DEMO_GUIDE.md)** - Complete hackathon demo walkthrough
- **[POSTGRES_SETUP.md](./POSTGRES_SETUP.md)** - Database setup guide
- **[DOCKER_SETUP.md](./DOCKER_SETUP.md)** - Docker deployment guide

### API Documentation

Swagger UI available at: http://localhost:3001/api/docs

---

## 🧪 Testing

### Generate Demo Threats

```powershell
cd docker
.\attack-mock.ps1 -Token YOUR_AGENT_TOKEN
```

This creates 5 simulated SSH brute force attacks for testing.

### Run Unit Tests

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

---

## 🚀 Deployment

### Frontend (Vercel)

```bash
cd frontend
vercel --prod
```

### Backend (Railway/Heroku)

```bash
cd backend
railway up
# or
git push heroku main
```

### Environment Variables

See `DEMO_GUIDE.md` for production environment configuration.

---

## 🔒 Security

- JWT-based authentication
- CORS protection
- SQL injection prevention (TypeORM)
- Input validation (class-validator)
- Rate limiting
- Helmet security headers
- Password hashing (bcrypt)

---

## 🤝 Contributing

This is a hackathon project. For production use, please:

1. Change all default secrets/passwords
2. Enable HTTPS
3. Configure production database
4. Set up monitoring & logging
5. Implement rate limiting
6. Add comprehensive tests

---

## 📝 License

MIT License

---

## 👥 Team

**Project:** SecureVault  
**Event:** VPBank Hackathon 2025  
**Repository:** https://github.com/locdo-freelancer/hackathon-vpb-onebillion

---

## 🙏 Acknowledgments

- VPBank for hosting the hackathon
- Open source community
- All contributors and supporters

---

**⭐ Star this repo if you find it helpful!**

**🎉 Built with ❤️ for VPBank Hackathon 2025**
