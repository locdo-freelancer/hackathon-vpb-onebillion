# 🚀 Quick Start - Sử dụng đa ngôn ngữ

## Cho người dùng / For Users

### Cách chuyển đổi ngôn ngữ / How to switch language

1. Tìm nút chuyển đổi ngôn ngữ ở góc trên bên phải:
   Find the language switcher button in the top right corner:
   ```
   🇬🇧 EN | 🇻🇳 VN
   ```

2. Click vào ngôn ngữ bạn muốn / Click on your preferred language:
   - **EN** = English (Tiếng Anh)
   - **VN** = Vietnamese (Tiếng Việt)

3. Trang web sẽ tự động cập nhật / Page will update automatically

4. Lựa chọn của bạn sẽ được lưu / Your choice will be saved

---

## Cho lập trình viên / For Developers

### 1️⃣ Sử dụng translations trong component

```tsx
import { useTranslations } from "@/hooks/useTranslations";

export default function MyComponent() {
  const { t } = useTranslations();
  
  return (
    <div>
      <h1>{t("dashboard.title")}</h1>
      <button>{t("common.save")}</button>
    </div>
  );
}
```

### 2️⃣ Thêm LanguageSwitcher

```tsx
import { LanguageSwitcher } from "@/components/shared";

export default function Header() {
  return (
    <header>
      {/* Your header content */}
      <LanguageSwitcher />
    </header>
  );
}
```

### 3️⃣ Thêm key translation mới

Edit **both** files:

**`frontend/src/app/messages/en.json`**
```json
{
  "mySection": {
    "title": "My Title",
    "button": "Click Me"
  }
}
```

**`frontend/src/app/messages/vn.json`**
```json
{
  "mySection": {
    "title": "Tiêu đề của tôi",
    "button": "Nhấn vào đây"
  }
}
```

### 4️⃣ Sử dụng key mới

```tsx
const { t } = useTranslations();

<h1>{t("mySection.title")}</h1>
<button>{t("mySection.button")}</button>
```

---

## 📖 Available Translation Keys

### Common / Chung
```tsx
t("common.search")      // "Search..." / "Tìm kiếm..."
t("common.save")        // "Save" / "Lưu"
t("common.cancel")      // "Cancel" / "Hủy"
t("common.delete")      // "Delete" / "Xóa"
t("common.loading")     // "Loading..." / "Đang tải..."
t("common.error")       // "Error" / "Lỗi"
t("common.success")     // "Success" / "Thành công"
```

### Navigation / Điều hướng
```tsx
t("nav.dashboard")      // "Dashboard" / "Bảng điều khiển"
t("nav.threats")        // "Threats" / "Mối đe dọa"
t("nav.incidents")      // "Incidents" / "Sự cố"
t("nav.agents")         // "Agents" / "Đại lý"
t("nav.sites")          // "Sites" / "Địa điểm"
```

### Auth / Xác thực
```tsx
t("auth.login")         // "Login" / "Đăng nhập"
t("auth.welcomeBack")   // "Welcome back" / "Chào mừng trở lại"
t("auth.email")         // "Email" / "Email"
t("auth.password")      // "Password" / "Mật khẩu"
t("auth.rememberMe")    // "Remember me" / "Ghi nhớ đăng nhập"
```

### Dashboard / Bảng điều khiển
```tsx
t("dashboard.title")           // "Security Dashboard" / "Bảng điều khiển bảo mật"
t("dashboard.totalIncidents")  // "Total Incidents" / "Tổng số sự cố"
t("dashboard.activeSites")     // "Active Sites" / "Địa điểm hoạt động"
t("dashboard.agentsOnline")    // "Agents Online" / "Đại lý trực tuyến"
```

---

## 🎯 Examples / Ví dụ

### Example 1: Button with translation
```tsx
function SaveButton() {
  const { t } = useTranslations();
  return (
    <button className="btn-primary">
      {t("common.save")}
    </button>
  );
}
```

### Example 2: Form with translations
```tsx
function LoginForm() {
  const { t } = useTranslations();
  return (
    <form>
      <label>{t("auth.email")}</label>
      <input type="email" />
      
      <label>{t("auth.password")}</label>
      <input type="password" />
      
      <button>{t("auth.login")}</button>
    </form>
  );
}
```

### Example 3: Status message
```tsx
function StatusMessage({ type }) {
  const { t } = useTranslations();
  
  if (type === "loading") return <p>{t("common.loading")}</p>;
  if (type === "error") return <p>{t("common.error")}</p>;
  if (type === "success") return <p>{t("common.success")}</p>;
}
```

---

## 🧪 Test Your Implementation

### Test checklist:
- [ ] Import `useTranslations` hook
- [ ] Call `const { t } = useTranslations()`
- [ ] Use `t("key.subkey")` for all text
- [ ] Check key exists in both en.json and vn.json
- [ ] Test switching between EN and VN
- [ ] Verify text updates immediately

---

## 🆘 Common Issues

### ❌ Text not translating?
**Check:**
1. Is component using `useTranslations()` hook?
2. Does key exist in both translation files?
3. Is key path correct? (e.g., `"nav.dashboard"` not `"dashboard"`)

### ❌ "Key not found" warning?
**Solution:** Add the missing key to both `en.json` and `vn.json`

### ❌ Language not switching?
**Check:**
1. Is LanguageSwitcher component rendered?
2. Check browser console for errors
3. Verify localStorage is enabled

---

## 📱 Demo Page

Visit the demo page to see all translations in action:
```
http://localhost:3000/i18n-example
```

Or view the code:
```
frontend/src/app/i18n-example/page.tsx
```

---

## 📚 More Information

- **Full Guide**: `I18N_GUIDE.md`
- **Implementation Summary**: `I18N_IMPLEMENTATION_SUMMARY.md`
- **Translation Files**: `src/app/messages/`

---

**Happy coding! / Chúc bạn code vui vẻ! 🎉**
