# One Billion Site Monitoring - Backend

## 🚀 Complete Production-Ready NestJS Backend

This is a fully functional, production-ready backend application for site monitoring with agent communication, built using modern best practices.

## 📋 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Database Schema](#database-schema)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [AWS Deployment](#aws-deployment)
- [Project Structure](#project-structure)

## ✨ Features

### Core Features

- ✅ **JWT Authentication** - Secure user authentication with bcrypt password hashing
- ✅ **Site Management** - Full CRUD operations for monitoring sites
- ✅ **Agent Communication** - Secure agent check-in with bearer token authentication
- ✅ **Background Tasks** - Automated agent status monitoring with cron jobs
- ✅ **Multi-Entity Support** - 9 TypeORM entities for comprehensive security monitoring
- ✅ **Production-Ready** - Docker, AWS CDK infrastructure, CI/CD pipeline

### Security Features

- 🔒 Bcrypt password hashing (12 rounds)
- 🔑 JWT token-based authentication
- 🛡️ Cryptographically secure agent tokens
- 🔐 Request validation with class-validator
- 🚫 Owner-based access control

### Performance Features

- ⚡ Async/await throughout
- 🔄 Background task processing
- 📊 Database indexing on critical fields
- 🚀 Horizontal scaling with ECS Fargate
- 💾 Connection pooling with TypeORM

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│            User Frontend                     │
│         (React/Next.js)                      │
└───────────────┬─────────────────────────────┘
                │ JWT Auth
                ▼
┌─────────────────────────────────────────────┐
│         Application Load Balancer           │
│              (AWS ALB)                       │
└───────────────┬─────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────┐
│        NestJS Backend (ECS Fargate)         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │   Auth   │  │  Sites   │  │  Agent   │  │
│  │  Module  │  │  Module  │  │   Comm   │  │
│  └──────────┘  └──────────┘  └──────────┘  │
│  ┌──────────────────────────────────────┐  │
│  │      Background Tasks (Cron)         │  │
│  └──────────────────────────────────────┘  │
└───────────────┬─────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────┐
│      AWS RDS PostgreSQL Database            │
│         (Private Subnet)                     │
└─────────────────────────────────────────────┘
                ▲
                │ Bearer Token
┌───────────────┴─────────────────────────────┐
│         Deployed Agents                      │
│      (Monitoring Sites)                      │
└─────────────────────────────────────────────┘
```

## 🛠️ Tech Stack

| Technology           | Version | Purpose                   |
| -------------------- | ------- | ------------------------- |
| **NestJS**           | 10.x    | Backend framework         |
| **TypeScript**       | 5.x     | Programming language      |
| **TypeORM**          | 0.3.x   | ORM for PostgreSQL        |
| **PostgreSQL**       | 15.x    | Primary database          |
| **JWT**              | Latest  | Authentication            |
| **bcrypt**           | 5.x     | Password hashing          |
| **class-validator**  | 0.14.x  | Request validation        |
| **@nestjs/schedule** | 4.x     | Cron jobs                 |
| **passport**         | 0.7.x   | Authentication strategies |
| **uuid**             | 9.x     | ID generation             |

## 📊 Database Schema

### Entities (9 Total)

1. **User** - User accounts
2. **Site** - Monitored sites
3. **Agent** - Agent instances on sites
4. **Vulnerability** - Security vulnerabilities
5. **Site_Vulnerability** - Site-specific vulnerabilities
6. **Threat** - Detected threats
7. **Remediation_Action** - Remediation actions
8. **Security_Metric** - Security metrics
9. **Notification** - User notifications

### Key Relationships

- User → Sites (One-to-Many)
- Site → Agent (One-to-One)
- Site → Vulnerabilities (Many-to-Many through Site_Vulnerability)
- Site → Threats (One-to-Many)
- User → Notifications (One-to-Many)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- npm or yarn

### 1. Clone and Install

```bash
cd backend
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=onebillion
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
PORT=3001
```

### 3. Database Setup

Create the database:

```sql
CREATE DATABASE onebillion;
```

Run migrations (auto-sync in development):

```bash
npm run start:dev
```

### 4. Run the Application

Development:

```bash
npm run start:dev
```

Production:

```bash
npm run build
npm run start:prod
```

The API will be available at: `http://localhost:3001/api`

## 📡 API Endpoints

### Authentication (`/api/auth`)

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "full_name": "John Doe",
  "company_name": "Acme Corp" // optional
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}

Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe"
  }
}
```

### Sites Management (`/api/sites`)

All routes require JWT authentication: `Authorization: Bearer <token>`

#### Create Site

```http
POST /api/sites
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Production Server",
  "ip_address": "192.168.1.100",
  "domain_name": "example.com",
  "server_type": "nginx"
}

Response:
{
  "id": "uuid",
  "name": "Production Server",
  "agent_token": "a1b2c3d4..." // Only returned on creation!
  ...
}
```

#### List Sites

```http
GET /api/sites
Authorization: Bearer <jwt_token>
```

#### Get Site

```http
GET /api/sites/:id
Authorization: Bearer <jwt_token>
```

#### Update Site

```http
PATCH /api/sites/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Updated Server Name"
}
```

#### Delete Site

```http
DELETE /api/sites/:id
Authorization: Bearer <jwt_token>
```

### Agent Communication (`/api/agent`)

#### Agent Check-In

```http
POST /api/agent/check-in
Authorization: Bearer <agent_token>

Response:
{
  "success": true,
  "message": "Check-in successful",
  "timestamp": 1699876543210
}
```

### Health Check (`/api/health`)

```http
GET /api/health

Response:
{
  "status": "ok",
  "timestamp": "2024-11-07T12:00:00.000Z",
  "uptime": 3600
}
```

## 🐳 Docker Deployment

### Build Image

```bash
cd backend
docker build -t one-billion-backend .
```

### Run Container

```bash
docker run -d \
  -p 3001:3001 \
  -e DB_HOST=your-db-host \
  -e DB_PORT=5432 \
  -e DB_USERNAME=postgres \
  -e DB_PASSWORD=your_password \
  -e DB_NAME=onebillion \
  -e JWT_SECRET=your_jwt_secret \
  -e NODE_ENV=production \
  --name one-billion-api \
  one-billion-backend
```

## ☁️ AWS Deployment

### Infrastructure Components

The complete AWS infrastructure is defined using AWS CDK:

1. **Network Stack** - VPC with public/private subnets
2. **Database Stack** - RDS PostgreSQL with Secrets Manager
3. **App Stack** - ECS Fargate, ALB, ECR, Auto-scaling
4. **CI/CD Stack** - CodePipeline, CodeBuild

### Deploy Infrastructure

```bash
cd infrastructure
npm install

# Bootstrap CDK (first time only)
cdk bootstrap

# Deploy all stacks
cdk deploy --all
```

### Stack Outputs

After deployment, you'll get:

- Load Balancer DNS
- ECR Repository URI
- Database Endpoint
- Secrets ARNs

### CI/CD Pipeline

The pipeline automatically:

1. Pulls code from GitHub
2. Builds Docker image
3. Pushes to ECR
4. Deploys to ECS Fargate

## 📁 Project Structure

```
backend/
├── src/
│   ├── modules/
│   │   ├── auth/                  # Authentication module
│   │   │   ├── dto/              # Data transfer objects
│   │   │   ├── guards/           # JWT guard
│   │   │   ├── strategies/       # JWT strategy
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.module.ts
│   │   ├── sites/                # Site management
│   │   │   ├── dto/
│   │   │   ├── sites.controller.ts
│   │   │   ├── sites.service.ts
│   │   │   └── sites.module.ts
│   │   ├── agent-comm/           # Agent communication
│   │   │   ├── guards/           # Agent bearer guard
│   │   │   ├── strategies/       # Bearer strategy
│   │   │   ├── agent-comm.controller.ts
│   │   │   ├── agent-comm.service.ts
│   │   │   └── agent-comm.module.ts
│   │   └── tasks/                # Background tasks
│   │       ├── agent-status-task.service.ts
│   │       └── tasks.module.ts
│   ├── shared/
│   │   └── entities/             # TypeORM entities (9 files)
│   ├── config/
│   │   └── database.module.ts    # Database configuration
│   ├── app.module.ts
│   ├── app.controller.ts
│   ├── app.service.ts
│   └── main.ts
├── Dockerfile                     # Production Dockerfile
├── .dockerignore
├── .env.example
├── package.json
└── tsconfig.json

infrastructure/
├── bin/
│   └── app.ts                    # CDK app entry point
├── lib/
│   ├── network-stack.ts          # VPC, subnets
│   ├── database-stack.ts         # RDS PostgreSQL
│   ├── app-stack.ts              # ECS Fargate, ALB
│   └── cicd-stack.ts             # CodePipeline
├── cdk.json
├── package.json
└── tsconfig.json
```

## 🔄 Background Tasks

### Agent Status Monitoring

Runs every 5 minutes via `@Cron`:

1. Checks all agents marked as "connected"
2. Identifies agents with `last_checkin` > 10 minutes ago
3. Updates `is_connected = 0` for stale agents
4. Updates parent site `status = "Disconnected"`

## 🔐 Security Best Practices

✅ **Implemented:**

- Passwords hashed with bcrypt (12 rounds)
- JWT tokens with configurable expiration
- Cryptographically secure agent tokens (32 bytes)
- Input validation on all DTOs
- Owner-based authorization checks
- HTTPS in production (via ALB)
- Database in private subnet
- Secrets managed via AWS Secrets Manager
- Non-root Docker user
- Security group restrictions

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

## 📝 License

MIT

## 👥 Author

Senior Backend & Cloud Architect

---

**Built with ❤️ using NestJS, TypeScript, PostgreSQL, and AWS**
