# Hướng dẫn sử dụng chức năng đa ngôn ngữ (i18n)
# Multi-language Support Guide

## 📖 Tổng quan / Overview

Hệ thống hỗ trợ chuyển đổi giữa Tiếng Anh (English) và Tiếng Việt (Vietnamese) với các tính năng sau:

The system supports switching between English and Vietnamese with the following features:

- ✅ Chuyển đổi ngôn ngữ theo thời gian thực / Real-time language switching
- ✅ Lưu trữ lựa chọn ngôn ngữ / Persistent language preference
- ✅ UI component để chuyển đổi / UI switcher component
- ✅ Translations cho toàn bộ ứng dụng / Translations for entire app

## 🏗️ Cấu trúc / Structure

```
frontend/src/
├── app/messages/
│   ├── en.json          # English translations
│   └── vn.json          # Vietnamese translations
├── components/shared/
│   └── LanguageSwitcher.tsx  # Language switcher component
├── hooks/
│   └── useTranslations.ts    # Translation hook
├── stores/
│   └── languageStore.ts      # Zustand store for language state
├── middleware.ts             # i18n middleware
└── i18n.ts                   # i18n configuration
```

## 🚀 Cách sử dụng / Usage

### 1. Sử dụng translations trong components / Using translations in components

```tsx
import { useTranslations } from "@/hooks/useTranslations";

export default function MyComponent() {
  const { t } = useTranslations();
  
  return (
    <div>
      <h1>{t("dashboard.title")}</h1>
      <p>{t("dashboard.welcome")}</p>
    </div>
  );
}
```

### 2. Thêm LanguageSwitcher vào component / Adding LanguageSwitcher to a component

```tsx
import { LanguageSwitcher } from "@/components/shared";

export default function Header() {
  return (
    <header>
      <LanguageSwitcher />
    </header>
  );
}
```

### 3. Thêm translations mới / Adding new translations

Chỉnh sửa cả hai file `en.json` và `vn.json`:

Edit both `en.json` and `vn.json` files:

**en.json:**
```json
{
  "myFeature": {
    "title": "My Feature",
    "description": "This is a description"
  }
}
```

**vn.json:**
```json
{
  "myFeature": {
    "title": "Tính năng của tôi",
    "description": "Đây là mô tả"
  }
}
```

## 📝 Translation Keys

### Navigation (`nav.*`)
- `dashboard` - Dashboard / Bảng điều khiển
- `threats` - Threats / Mối đe dọa
- `incidents` - Incidents / Sự cố
- `agents` - Agents / Đại lý
- `sites` - Sites / Địa điểm
- `actionConsole` - Action Console / Bảng điều khiển hành động

### Dashboard (`dashboard.*`)
- `title` - Security Dashboard / Bảng điều khiển bảo mật
- `welcome` - Welcome back / Chào mừng trở lại
- `overview` - Overview / Tổng quan
- `totalIncidents` - Total Incidents / Tổng số sự cố
- `activeSites` - Active Sites / Địa điểm hoạt động
- `agentsOnline` - Agents Online / Đại lý trực tuyến

### Auth (`auth.*`)
- `login` - Login / Đăng nhập
- `welcomeBack` - Welcome back / Chào mừng trở lại
- `email` - Email / Email
- `password` - Password / Mật khẩu
- `rememberMe` - Remember me / Ghi nhớ đăng nhập
- `forgotPassword` - Forgot password? / Quên mật khẩu?
- `loginButton` - Sign in securely / Đăng nhập an toàn

### Common (`common.*`)
- `search` - Search... / Tìm kiếm...
- `filter` - Filter / Lọc
- `export` - Export / Xuất
- `save` - Save / Lưu
- `cancel` - Cancel / Hủy
- `delete` - Delete / Xóa
- `loading` - Loading... / Đang tải...
- `error` - Error / Lỗi
- `success` - Success / Thành công

## 🎨 LanguageSwitcher Component

Component này đã được tích hợp vào:
This component has been integrated into:

- ✅ Login page (top right corner)
- ✅ Dashboard header (all protected pages)

### Styling

Component sử dụng Tailwind CSS với theme cyber:
The component uses Tailwind CSS with cyber theme:

- Active state: `bg-cyber-accent text-white`
- Inactive state: `text-gray-400 hover:text-white`
- Container: `bg-cyber-card border border-cyber-border`

## 🔄 Workflow

1. User clicks language button (EN or VN)
2. `useLanguageStore` updates the locale state
3. Locale is saved to localStorage for persistence
4. Router refreshes to apply new translations
5. All components using `useTranslations()` re-render with new language

## 💾 Data Persistence

Ngôn ngữ được lưu trong:
Language is stored in:

- **Zustand store**: In-memory state
- **localStorage**: `language-storage` key
- **Cookie**: `NEXT_LOCALE` (for SSR support)

## 🛠️ Maintenance

### Thêm ngôn ngữ mới / Adding a new language

1. Create new JSON file: `src/app/messages/[locale].json`
2. Update `src/i18n.ts`:
```ts
export const locales = ['en', 'vn', 'newLocale'] as const;
```
3. Update `src/middleware.ts` matcher
4. Update `useLanguageStore` type:
```ts
export type Locale = "en" | "vn" | "newLocale";
```

### Tìm missing translations / Finding missing translations

Search for hardcoded strings in components:
```bash
# Find potential hardcoded text
grep -r "className.*>" --include="*.tsx" src/components
```

## 📦 Dependencies

- `next-intl`: Internationalization for Next.js
- `zustand`: State management for language preference

## 🧪 Testing

Test các scenarios sau:
Test the following scenarios:

1. ✅ Switch language on login page
2. ✅ Switch language on dashboard
3. ✅ Refresh page - language persists
4. ✅ Navigate between pages - language persists
5. ✅ Check all translated strings render correctly

## 📱 Responsive Design

LanguageSwitcher is responsive:
- Desktop: Full button with flag + text
- Mobile: Compact flag buttons (can be customized)

## ⚡ Performance

- Translations loaded client-side (no SSR delay)
- Zustand provides fast state updates
- localStorage prevents refetch on page load
- Small bundle size (~17 packages added)

## 🔒 Security

- No sensitive data in translation files
- Language preference stored locally only
- No server-side language tracking

---

## 📞 Support

Nếu có vấn đề với i18n, kiểm tra:
If you have issues with i18n, check:

1. Translation key exists in both `en.json` and `vn.json`
2. `useTranslations()` hook is called in component
3. Component is client component (`"use client"` directive)
4. Browser console for any errors

**Created by**: OneBillion Team
**Last updated**: November 10, 2025
