# Project Structure Documentation

## 📁 Overview

This document provides a detailed overview of the One Billion project structure.

```
one-billion/
├── backend/                    # NestJS Backend API
│   ├── src/
│   │   ├── modules/           # Feature modules
│   │   │   ├── auth/         # Authentication module
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── auth.module.ts
│   │   │   │   └── strategies/
│   │   │   └── users/        # Users module
│   │   │       ├── users.controller.ts
│   │   │       ├── users.service.ts
│   │   │       └── users.module.ts
│   │   ├── shared/           # Shared resources
│   │   │   ├── entities/     # Database entities
│   │   │   │   └── user.entity.ts
│   │   │   └── guards/       # Auth guards
│   │   ├── config/           # Configuration files
│   │   ├── app.module.ts     # Root module
│   │   ├── app.controller.ts # Root controller
│   │   ├── app.service.ts    # Root service
│   │   └── main.ts           # Application entry point
│   ├── package.json
│   ├── tsconfig.json
│   ├── nest-cli.json
│   └── .env.example
│
├── frontend/                  # Next.js Frontend
│   ├── src/
│   │   ├── app/              # Next.js App Router
│   │   │   ├── layout.tsx    # Root layout
│   │   │   ├── page.tsx      # Home page
│   │   │   ├── providers.tsx # Global providers
│   │   │   └── globals.css   # Global styles
│   │   ├── components/       # React components
│   │   ├── lib/              # Utilities & helpers
│   │   │   └── api-client.ts # API client
│   │   ├── stores/           # Zustand stores
│   │   │   └── authStore.ts  # Auth state
│   │   └── types/            # TypeScript types
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   └── .env.example
│
├── docs/                     # Documentation
└── README.md                 # Project overview
```

## 🏗️ Architecture

### Backend Architecture

```
┌─────────────────────────────────────────────┐
│           NestJS Application                │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │   Auth   │  │  Users   │  │  Other   │ │
│  │  Module  │  │  Module  │  │ Modules  │ │
│  └──────────┘  └──────────┘  └──────────┘ │
│       │             │              │        │
│  ┌────▼─────────────▼──────────────▼─────┐ │
│  │         Shared Resources              │ │
│  │  (Entities, Guards, Interceptors)     │ │
│  └────────────────┬───────────────────────┘ │
│                   │                          │
│  ┌────────────────▼───────────────────────┐ │
│  │          TypeORM / Database            │ │
│  └────────────────────────────────────────┘ │
│                                             │
└─────────────────────────────────────────────┘
```

### Frontend Architecture

```
┌─────────────────────────────────────────────┐
│         Next.js Application                 │
├─────────────────────────────────────────────┤
│                                             │
│  ┌────────────────────────────────────────┐│
│  │        App Router (Pages)              ││
│  └───────────────┬────────────────────────┘│
│                  │                          │
│  ┌───────────────▼────────────────────────┐│
│  │        React Components                ││
│  └───────────────┬────────────────────────┘│
│                  │                          │
│  ┌───────────────▼────────────────────────┐│
│  │    State Management (Zustand)          ││
│  └───────────────┬────────────────────────┘│
│                  │                          │
│  ┌───────────────▼────────────────────────┐│
│  │    API Client (React Query)            ││
│  └───────────────┬────────────────────────┘│
│                  │                          │
└──────────────────┼──────────────────────────┘
                   │
                   ▼
            Backend API
```

## 🔑 Key Features

### Backend

- ✅ **Modular Architecture**: Clean separation of concerns
- ✅ **JWT Authentication**: Secure token-based auth
- ✅ **TypeORM Integration**: Type-safe database queries
- ✅ **Validation Pipes**: Automatic request validation
- ✅ **CORS Enabled**: Cross-origin resource sharing
- ✅ **Environment Config**: Centralized configuration

### Frontend

- ✅ **App Router**: Next.js 15 App Router
- ✅ **React Query**: Data fetching & caching
- ✅ **Zustand**: Lightweight state management
- ✅ **Tailwind CSS**: Utility-first styling
- ✅ **TypeScript**: Full type safety
- ✅ **Hot Toast**: Beautiful notifications

## 📦 Module Descriptions

### Backend Modules

#### Auth Module

- **Purpose**: Handle user authentication
- **Features**:
  - User registration
  - Login with JWT
  - Password hashing with bcrypt
  - JWT strategy validation
- **Files**:
  - `auth.controller.ts`: Auth endpoints
  - `auth.service.ts`: Auth business logic
  - `auth.module.ts`: Module configuration

#### Users Module

- **Purpose**: Manage user data
- **Features**:
  - CRUD operations for users
  - User profile management
  - Role-based access
- **Files**:
  - `users.controller.ts`: User endpoints
  - `users.service.ts`: User business logic
  - `users.module.ts`: Module configuration

### Frontend Structure

#### App Directory

- `layout.tsx`: Root layout with providers
- `page.tsx`: Home page component
- `providers.tsx`: Global providers (Query, Toast)
- `globals.css`: Global styles & Tailwind

#### Stores

- `authStore.ts`: Authentication state management
  - User data
  - Login/logout actions
  - Token persistence

#### Lib

- `api-client.ts`: HTTP client wrapper
  - GET, POST, PUT, DELETE methods
  - Automatic token injection
  - Error handling

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MySQL/PostgreSQL
- npm or yarn

### Installation

1. **Clone and navigate**

```bash
cd one-billion
```

2. **Backend setup**

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run dev
```

3. **Frontend setup**

```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your API URL
npm run dev
```

4. **Access**

- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- API Docs: http://localhost:3001/api

## 🔐 Environment Variables

### Backend (.env)

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=one_billion
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
PORT=3001
NODE_ENV=development
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 📝 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user
- `DELETE /api/users/:id` - Delete user

### Health Check

- `GET /api/health` - Server health status

## 🧪 Testing

### Backend

```bash
cd backend
npm run test           # Unit tests
npm run test:e2e       # E2E tests
npm run test:cov       # Coverage
```

### Frontend

```bash
cd frontend
npm run test           # Jest tests
npm run test:watch     # Watch mode
```

## 📚 Tech Stack Details

### Backend

| Technology       | Version | Purpose           |
| ---------------- | ------- | ----------------- |
| NestJS           | 10.x    | Backend framework |
| TypeORM          | 0.3.x   | ORM               |
| MySQL/PostgreSQL | Latest  | Database          |
| JWT              | Latest  | Authentication    |
| bcrypt           | 5.x     | Password hashing  |
| class-validator  | 0.14.x  | Validation        |

### Frontend

| Technology      | Version | Purpose          |
| --------------- | ------- | ---------------- |
| Next.js         | 15.x    | React framework  |
| React           | 19.x    | UI library       |
| TypeScript      | 5.x     | Type safety      |
| Tailwind CSS    | 4.x     | Styling          |
| Zustand         | 5.x     | State management |
| React Query     | 5.x     | Data fetching    |
| React Hot Toast | 2.x     | Notifications    |

## 🔄 Development Workflow

1. **Feature Development**

   - Create feature branch
   - Implement backend module
   - Implement frontend components
   - Test locally
   - Submit PR

2. **Code Organization**

   - Backend: Feature modules in `src/modules/`
   - Frontend: Feature pages in `src/app/`
   - Shared code in `src/shared/` or `src/lib/`

3. **Naming Conventions**
   - Files: kebab-case (`user-profile.tsx`)
   - Components: PascalCase (`UserProfile`)
   - Functions: camelCase (`getUserById`)
   - Constants: UPPER_SNAKE_CASE (`API_URL`)

## 🐛 Debugging

### Backend

- Enable logging in `.env`: `NODE_ENV=development`
- Check logs in terminal
- Use NestJS DevTools (if installed)

### Frontend

- React DevTools (browser extension)
- React Query DevTools (optional)
- Zustand DevTools (optional)

## 📖 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeORM Documentation](https://typeorm.io/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [React Query Documentation](https://tanstack.com/query/latest)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 🌩️ AWS Integration

The backend now includes comprehensive AWS cloud integration for enterprise-scale operations:

### AWS Module Structure
```
backend/src/aws/
├── config/
│   └── aws-config.service.ts      # AWS SDK configuration
├── services/
│   ├── sqs.service.ts             # Message queuing
│   ├── s3.service.ts              # Object storage
│   ├── eventbridge.service.ts     # Workflow orchestration
│   ├── lambda.service.ts          # Function invocation
│   ├── workflow.service.ts        # End-to-end workflows
│   ├── redis.service.ts           # Caching & pub/sub
│   ├── secrets-manager.service.ts # Secure configuration
│   └── resilience.service.ts      # Error handling & circuit breakers
├── controllers/
│   ├── aws-workflow.controller.ts # Workflow endpoints
│   └── aws-health.controller.ts   # Health monitoring
├── aws.module.ts                  # AWS module definition
└── index.ts                       # AWS exports
```

### Key Features
- **Workflow Orchestration**: SQS + EventBridge + Lambda for scalable processing
- **Data Storage**: S3 for logs/attachments, Redis for caching, RDS for structured data
- **Resilience**: Circuit breakers, retry logic, health monitoring
- **Security**: Secrets Manager integration, IAM roles, encryption at rest/transit

For detailed AWS architecture information, see [AWS_ARCHITECTURE.md](./AWS_ARCHITECTURE.md)

---

**Last Updated**: November 2025  
**Version**: 2.0.0 (AWS Integration)
