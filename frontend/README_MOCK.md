# 🎭 Mock Mode - Frontend Testing Guide

## 📋 Overview
Ứng dụng đang chạy ở **MOCK MODE** - tất cả API calls đều được giả lập trên frontend, không cần backend.

## 🔧 Configuration

### Bật/Tắt Mock Mode
Trong các file service, tìm biến `USE_MOCK`:

**`/lib/services/auth.service.ts`**
```typescript
const USE_MOCK = true; // Set to false when backend is ready
```

**`/lib/services/onboarding.service.ts`**
```typescript
const USE_MOCK = true; // Set to false when backend is ready
```

## 🧪 Test Credentials

### Login
- **Demo Account:**
  - Email: `demo@onebillion.vn`
  - Password: `Demo123!@#`

### Signup
- Bất kỳ email/password nào cũng được
- Email sẽ được lưu tạm trong memory (reload page sẽ mất)

### MFA Code
- Code hợp lệ: `123456`
- Code khác sẽ báo lỗi

### Onboarding OTP
- OTP hợp lệ: `123456`
- Thử code khác để test validation

## 🎯 User Flows

### Flow 1: Signup → Onboarding → Dashboard
1. Vào `/signup`
2. Nhập email/password bất kỳ (ví dụ: `test@gmail.com` / `Test123!@#`)
3. Click "Create account"
4. Click "Email Verified - Continue to Setup"
5. Complete onboarding:
   - Step 1: Nhập thông tin cá nhân
   - Step 2: Chọn loại tài khoản (Personal/Business/Premium)
   - Step 3: Click "Send Code", nhập OTP `123456`
   - Step 4: Chọn security question và answer
6. Redirect to `/dashboard` ✅

### Flow 2: Login → Dashboard
1. Vào `/login`
2. Nhập: `demo@onebillion.vn` / `Demo123!@#`
3. Click "Sign in"
4. Redirect to `/dashboard` ✅

### Flow 3: Test MFA (nếu bật)
Trong `auth.service.mock.ts`, đổi:
```typescript
requiresMFA: true, // Enable MFA flow
userId: user.email,
```
- Login sẽ hiện MFA modal
- Nhập code: `123456`

## 📱 Mock Console Logs

Khi chạy các actions, check Console để thấy mock logs:

```
✅ Mock: Progress saved for step 1
📧 Mock: SMS verification code sent to 0901234567
💡 Use code: 123456 to verify
🎉 Mock: Onboarding completed!
```

## 🗄️ Mock Data Storage

### In-Memory Storage
- User data: `mockUsers` array trong `auth.service.mock.ts`
- Onboarding data: `mockOnboardingData` object trong `onboarding.service.mock.ts`
- **Lưu ý:** Reload page sẽ mất data!

### Persistent Storage
- Onboarding progress: Zustand persist trong localStorage
- Key: `onboarding-storage`

## 🔄 Reset Mock Data

### Cách 1: Reload Page
```bash
# Reload browser để reset in-memory data
```

### Cách 2: Clear localStorage
```javascript
// Browser Console
localStorage.clear()
```

### Cách 3: Code Reset
Trong `auth.service.mock.ts`, reset `mockUsers`:
```typescript
const mockUsers: Array<{ email: string; password: string; verified: boolean }> = [];
```

## 🎨 Test Scenarios

### ✅ Happy Path
1. Signup → Verify Email → Onboarding → Dashboard
2. Login → Dashboard
3. Resend verification email
4. OAuth login (mock success)

### ❌ Error Scenarios
1. Login với wrong password
2. Login với unverified email
3. Signup với existing email
4. Wrong OTP code
5. Empty form fields

## 🚀 Switch to Real Backend

Khi backend ready:

1. **Update service files:**
```typescript
const USE_MOCK = false; // Disable mock
```

2. **Update API base URL** in `/lib/api-client.ts`:
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
```

3. **Remove mock imports** (optional cleanup):
```typescript
// Remove these lines
import { MockAuthService } from './auth.service.mock';
```

## 📝 Notes

- Mock services simulate network delay (500-1500ms)
- Password strength validation vẫn hoạt động real-time
- Form validation hoạt động đầy đủ
- UI/UX giống hệt production
- Console logs giúp debug flow

## 🐛 Debugging

Nếu gặp lỗi:

1. Check Console logs
2. Check Network tab (không có API calls)
3. Check localStorage (`onboarding-storage`)
4. Verify `USE_MOCK = true` trong service files

---

**Happy Testing! 🎉**
