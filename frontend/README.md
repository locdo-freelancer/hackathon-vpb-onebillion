# 🚀 One Billion - Smart Banking Solutions

**VPBank Hackathon Project** | Next.js 15 + NestJS + SOLID Architecture

---

## 📋 Project Overview

One Billion là một nền tảng banking hiện đại được xây dựng cho VPBank Hackathon, cung cấp giải pháp ngân hàng thông minh cho mọi người.

### ✨ Features

- 🌐 **Multi-Language Support** ⭐ NEW!
  - English ↔ Vietnamese switching
  - Real-time language updates
  - Persistent language preference
  - 127+ translation keys
  - [Quick Start Guide](I18N_QUICK_START.md) | [Full Documentation](I18N_GUIDE.md)

- 🔐 **Authentication System**
  - Login/Signup với validation
  - Email verification
  - MFA (Multi-Factor Authentication)
  - OAuth (Google, GitHub, Microsoft)
  - Password strength indicator
  - Auth routing protection

- 🎯 **Onboarding Wizard** (4 Steps)
  - Step 1: Site Details (Server Name, IP, Port, Domain)
  - Step 2: Server Type Selection (Linux/Windows/Docker)
  - Step 3: Agent Installation (Install Command)
  - Step 4: Connectivity Validation (Network, Auth, Sync)

- 💼 **Dashboard**
  - Welcome screen
  - Quick actions
  - Financial overview (Coming soon)
  - Multi-language support

---

## 🏗️ Architecture

### SOLID Principles Applied

#### 1. **Single Responsibility Principle (SRP)**
- Mỗi component chỉ có 1 nhiệm vụ duy nhất
- `LoginForm.tsx` - Chỉ lo form login
- `SignupForm.tsx` - Chỉ lo form signup
- `Step1PersonalInfo.tsx` - Chỉ lo bước 1 của onboarding (Site Details)
- `Step2AccountType.tsx` - Chỉ lo bước 2 (Server Type)
- `Step3Verification.tsx` - Chỉ lo bước 3 (Agent Installation)
- `Step4Security.tsx` - Chỉ lo bước 4 (Validation)

#### 2. **Open/Closed Principle (OCP)**
- Components có thể extend mà không cần modify
- Service layer dễ dàng thêm methods mới

#### 3. **Liskov Substitution Principle (LSP)**
- Components có thể thay thế nhau mà không breaking
- Interface contracts được đảm bảo

#### 4. **Interface Segregation Principle (ISP)**
- Custom hooks tách biệt concerns: `usePasswordStrength`, `useMFAInput`, `useOnboarding`
- Props interfaces được chia nhỏ, không bắt component phải implement những gì không cần

#### 5. **Dependency Inversion Principle (DIP)**
- Components depend on abstractions (Services, Hooks)
- Service layer abstraction: `AuthService`, `OnboardingService`
- Dễ dàng swap giữa Mock và Real API

---

## 🗂️ Project Structure

```
frontend/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── (auth)/                 # Auth route group
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   └── onboarding/
│   │   ├── dashboard/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/                 # React Components
│   │   ├── auth/                   # Auth components
│   │   │   ├── AuthLayout.tsx
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignupForm.tsx
│   │   │   ├── MFAModal.tsx
│   │   │   └── ...
│   │   ├── onboarding/             # Onboarding wizard
│   │   │   ├── OnboardingLayout.tsx
│   │   │   ├── ProgressIndicator.tsx
│   │   │   ├── Step1PersonalInfo.tsx
│   │   │   └── ...
│   │   └── DevTools.tsx            # Dev tools (mock mode)
│   │
│   ├── lib/                        # Services & utilities
│   │   ├── services/
│   │   │   ├── auth.service.ts           # Real API
│   │   │   ├── auth.service.mock.ts      # Mock API
│   │   │   ├── onboarding.service.ts     # Real API
│   │   │   ├── onboarding.service.mock.ts # Mock API
│   │   │   └── password.service.ts
│   │   └── api-client.ts
│   │
│   ├── hooks/                      # Custom React Hooks
│   │   ├── usePasswordStrength.ts
│   │   ├── useMFAInput.ts
│   │   └── useOnboarding.ts
│   │
│   ├── stores/                     # Zustand State Management
│   │   ├── authStore.ts
│   │   └── onboardingStore.ts
│   │
│   └── types/                      # TypeScript Types
│       ├── auth.types.ts
│       └── onboarding.types.ts
│
├── template/                       # Original HTML templates
│   ├── sign-up-login.html
│   └── onboarding.html
│
├── README_MOCK.md                  # Mock mode guide
└── package.json
```

---

## 🎨 Tech Stack

### Frontend
- **Framework:** Next.js 15.4.6 (App Router)
- **React:** 19.1.0
- **TypeScript:** 5.x
- **Styling:** Tailwind CSS v4
- **State Management:** Zustand 5.x
- **Data Fetching:** React Query 5.x (TanStack Query)
- **Icons:** Font Awesome 6.4.0
- **Typography:** Inter (Google Fonts)

### Backend (Coming Soon)
- **Framework:** NestJS 10.x
- **Database:** PostgreSQL + TypeORM
- **Authentication:** JWT + Passport.js

---

## 🚀 Getting Started

### Prerequisites
```bash
node >= 18.x
npm >= 9.x
```

### Installation

1. **Clone repository**
```bash
git clone https://github.com/locdo-freelancer/hackathon-vpb-onebillion.git
cd hackathon-vpb-onebillion
```

2. **Install dependencies**
```bash
cd frontend
npm install
```

3. **Run development server**
```bash
npm run dev
```

4. **Open browser**
```
http://localhost:3000
```

---

## 🎭 Mock Mode (Current)

Hiện tại app đang chạy ở **MOCK MODE** - tất cả API calls được giả lập trên frontend.

### 🔑 Test Credentials

**Login:**
- Email: `demo@onebillion.vn`
- Password: `Demo123!@#`

**Signup:**
- Bất kỳ email/password nào

**OTP/MFA:**
- Code: `123456`

### 🛠️ Dev Tools

Khi chạy ở development mode, sẽ có button Dev Tools ở góc phải dưới màn hình:

- 🧪 Create Test Account
- ✅ Verify All Emails
- 📋 Console Logs
- 🔑 Test Credentials Reference

### 📖 Chi tiết Mock Mode

Xem file `README_MOCK.md` để biết thêm chi tiết về:
- Cách bật/tắt mock mode
- Test scenarios
- Mock data storage
- Debugging tips

---

## 🎯 User Flow

```
1. Home (/) → Redirect to Login

2. Signup Flow:
   ├─ /signup
   ├─ Email Verification
   ├─ /onboarding (4 steps)
   └─ /dashboard ✅

3. Login Flow:
   ├─ /login
   ├─ MFA (optional)
   └─ /dashboard ✅
```

---

## 📦 Key Files

### Services
- `auth.service.ts` - Authentication logic
- `auth.service.mock.ts` - Mock implementation
- `onboarding.service.ts` - Onboarding logic
- `onboarding.service.mock.ts` - Mock implementation

### Components
- `LoginForm.tsx` - Login form with validation
- `SignupForm.tsx` - Signup form with password strength
- `Step1PersonalInfo.tsx` - Site details form
- `Step2AccountType.tsx` - Server type selection
- `Step3Verification.tsx` - Agent installation
- `Step4Security.tsx` - Connectivity validation

### Hooks
- `useOnboarding.ts` - Wizard state management
- `usePasswordStrength.ts` - Password validation
- `useMFAInput.ts` - MFA code input

### Types
- `auth.types.ts` - Auth interfaces & types
- `onboarding.types.ts` - Site configuration interfaces (SiteConfigData)

---

## 🎨 Design System

### Colors (Cyber Theme)
```css
--cyber-darker: #060911
--cyber-dark: #0a0e1a
--cyber-card: rgba(10, 14, 26, 0.8)
--cyber-accent: #00d9ff (cyan)
--cyber-purple: #a855f7
--cyber-border: rgba(255, 255, 255, 0.1)
```

### Typography
- **Font Family:** Inter
- **Weights:** 300, 400, 500, 600, 700, 800

### Components
- Gradient buttons with glow effects
- Glassmorphism cards
- Animated progress indicators
- Contextual help panels

---

## 📝 Development Notes

### Toggle Mock/Real API

Trong service files (`auth.service.ts`, `onboarding.service.ts`):

```typescript
const USE_MOCK = true; // Set to false khi backend ready
```

### Add New Mock Data

Edit `auth.service.mock.ts`:
```typescript
const mockUsers = [
  { email: 'demo@onebillion.vn', password: 'Demo123!@#', verified: true },
  // Add more users here
];
```

### Create New Component

Follow SOLID principles:
1. Single purpose
2. Clear props interface
3. Depend on abstractions (services/hooks)
4. Reusable & testable

---

## 🔧 Scripts

```bash
# Development
npm run dev

# Build
npm run build

# Start production
npm start

# Lint
npm run lint

# Type check
npm run type-check
```

---

## 🐛 Known Issues

- [ ] Backend API chưa ready → Đang dùng mock
- [ ] Dashboard chưa có UI đầy đủ
- [ ] OAuth providers chưa config thực tế

---

## 🚀 Next Steps

### Phase 1: Backend Integration
- [ ] Connect NestJS backend
- [ ] Implement real JWT authentication
- [ ] Database schema & migrations
- [ ] API endpoints matching mock

### Phase 2: Features
- [ ] Dashboard UI/UX
- [ ] Transaction management
- [ ] Account settings
- [ ] Notifications system

### Phase 3: Polish
- [ ] E2E testing
- [ ] Performance optimization
- [ ] Security audit
- [ ] Deployment (Vercel/AWS)

---

## 👥 Team

**VPBank Hackathon Team**

---

## 📄 License

MIT License - VPBank Hackathon 2025

---

## 🙏 Acknowledgments

- VPBank for hosting the hackathon
- Next.js team for the amazing framework
- Tailwind CSS for the styling system
- Open source community

---

**Happy Coding! 🚀**
