# One Billion

A modern full-stack application built with Next.js and NestJS.

## 🏗️ Project Structure

```
one-billion/
├── backend/           # NestJS Backend API
├── frontend/          # Next.js Frontend
├── docs/             # Documentation
└── README.md
```

## 🚀 Quick Start

### Backend (NestJS)

```bash
cd backend
npm install
npm run dev
```

### Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

## 📚 Tech Stack

### Backend

- **Framework**: NestJS 10.x
- **Database**: PostgreSQL/MySQL with TypeORM
- **Authentication**: JWT + Passport
- **API**: REST + tRPC
- **Validation**: class-validator

### Frontend

- **Framework**: Next.js 15 (App Router)
- **React**: 19.x
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand / React Query
- **Forms**: React Hook Form + Zod
- **UI Components**: Custom components

## 🛠️ Development

### Environment Variables

Create `.env` files in both `backend/` and `frontend/` directories:

**Backend `.env`:**

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_NAME=one_billion

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# API
PORT=3001
NODE_ENV=development
```

**Frontend `.env.local`:**

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 📦 Scripts

### Backend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔒 Security

- JWT authentication
- CORS enabled
- Input validation
- Rate limiting
- Helmet security headers

## 📄 License

MIT

## 👥 Contributors

Your team members here

---

**Created**: November 2025  
**Version**: 1.0.0
