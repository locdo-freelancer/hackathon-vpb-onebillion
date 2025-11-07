# Agent Installation Page

## Mô tả
Trang **Agent Installation** (`/agent-install`) là bước tiếp theo sau khi hoàn thành onboarding. Trang này hướng dẫn người dùng cài đặt SecureVault monitoring agent trên các hệ điều hành khác nhau.

## Tính năng chính

### 1. Multi-Platform Support
- **Linux**: Ubuntu, CentOS, RHEL, Debian
- **Windows**: PowerShell 5.1+
- **macOS**: macOS 10.15+

### 2. Real-time Connection Status
Trang hiển thị 3 trạng thái kết nối:
- 🟡 **Waiting for Connection**: Đang chờ agent kết nối
- 🔵 **Agent Connected**: Agent đã kết nối thành công
- 🟢 **Agent Registered**: Agent đã xác thực và đang hoạt động

### 3. Interactive Installation Commands
- Lệnh cài đặt sẵn có cho từng nền tảng
- Nút copy-to-clipboard tiện lợi
- Hướng dẫn chi tiết từng bước

### 4. Troubleshooting Section
Phần giải quyết các vấn đề phổ biến:
- Agent không kết nối
- Cài đặt thất bại
- Vấn đề xác thực

### 5. Heartbeat Monitoring
Hiển thị thời gian heartbeat gần nhất khi agent đã đăng ký

## Workflow

```
Onboarding (Step 4) 
    ↓
Agent Installation Page
    ↓
Dashboard
```

## Cấu trúc Component

```
src/
├── app/
│   └── agent-install/
│       └── page.tsx                 # Main page (refactored)
├── components/
│   └── agent-install/
│       ├── AgentInstallHeader.tsx   # Header với status indicator
│       ├── InstallationTabs.tsx     # Platform selection tabs
│       ├── CommandDisplay.tsx       # Command với copy functionality
│       ├── ConnectionStatus.tsx     # Real-time connection status
│       ├── TroubleshootingSection.tsx # Accordion troubleshooting
│       └── index.ts                 # Barrel export
└── hooks/
    ├── useAgentInstall.ts           # Agent connection logic
    └── useCopyToClipboard.ts        # Clipboard utility
```

### Component Hierarchy

```tsx
AgentInstallPage
├── AgentInstallHeader
│   └── Connection Status Badge
├── Main Content
│   ├── InstallationTabs
│   │   └── Tab Buttons (Linux/Windows/macOS)
│   ├── CommandDisplay
│   │   ├── Platform Info
│   │   ├── Command Code Block
│   │   └── Installation Steps
│   ├── ConnectionStatus
│   │   ├── Status Card (Waiting/Connected/Registered)
│   │   └── Heartbeat Monitor
│   ├── TroubleshootingSection
│   │   └── Accordion Items
│   └── Navigation Buttons
```

## Simulation Logic

Trang có simulation logic để demo flow:
1. **5 giây đầu**: Trạng thái "Waiting for Connection"
2. **3 giây tiếp**: Chuyển sang "Agent Connected"
3. **Sau đó**: "Agent Registered" và enable nút Continue

## Styling

- **Dark Theme**: Cyberpunk-inspired với gradient backgrounds
- **Colors**: 
  - Primary: Cyan (#00d9ff)
  - Secondary: Purple (#a855f7)
  - Background: Slate dark tones
- **Effects**: 
  - Backdrop blur
  - Glow effects
  - Smooth transitions

## Cách sử dụng

1. Người dùng hoàn thành 4 bước onboarding
2. Tự động chuyển đến `/agent-install`
3. Chọn platform phù hợp (Linux/Windows/macOS)
4. Copy và chạy lệnh cài đặt
5. Đợi agent kết nối (hoặc xem simulation)
6. Click "Continue to Dashboard" khi agent registered

## Integration với Onboarding

File được cập nhật: `src/app/(auth)/onboarding/page.tsx`

```tsx
// Complete onboarding and redirect to agent installation
const success = await completeOnboarding();
if (success) {
  markStepComplete(4);
  markOnboardingComplete();
  router.push("/agent-install"); // ← Changed from "/dashboard"
}
```

## Dependencies

- **React**: UI components
- **Next.js**: Routing và navigation
- **Font Awesome**: Icons (loaded via CDN in layout.tsx)
- **Tailwind CSS**: Styling
- **Zustand**: State management (optional, for onboarding store)

## Components Chi Tiết

### 1. **AgentInstallHeader**
```tsx
Props: { connectionPhase: ConnectionPhase }
```
- Hiển thị logo và tên app
- Status badge thay đổi màu theo phase
- Help button

### 2. **InstallationTabs**
```tsx
Props: { currentTab: TabType; onTabChange: (tab: TabType) => void }
```
- 3 tabs: Linux, Windows, macOS
- Icons từ Font Awesome
- Active state với cyan background

### 3. **CommandDisplay**
```tsx
Props: { currentTab: TabType; onCopy: (text: string, id: string) => void }
```
- Platform-specific commands
- Copy-to-clipboard button với success feedback
- Installation steps (numbered list)

### 4. **ConnectionStatus**
```tsx
Props: { phase: ConnectionPhase; heartbeatTime?: string }
```
- 3 trạng thái với colors khác nhau
- Animated pulse dot cho "waiting"
- Heartbeat display khi registered

### 5. **TroubleshootingSection**
```tsx
Props: none
```
- Details/summary accordion
- 3 common issues với solutions
- Link to full documentation

## Custom Hooks

### 1. **useAgentInstall**
```tsx
Returns: {
  connectionPhase: ConnectionPhase;
  heartbeatTime: string;
  isConnected: boolean;
  isRegistered: boolean;
  simulateConnection: () => void;
}
```
- Quản lý connection simulation logic
- Auto-update heartbeat every 30s
- Clean up intervals on unmount

### 2. **useCopyToClipboard**
```tsx
Returns: {
  copyToClipboard: (text: string, buttonId: string) => Promise<void>;
}
```
- Copy text to clipboard
- Visual feedback (icon + color change)
- Auto-reset after 2s
- Error handling

## Future Enhancements

- [ ] Real WebSocket connection cho real-time status
- [ ] Download script files thay vì copy commands
- [ ] Docker/Kubernetes deployment options
- [ ] Agent health check dashboard
- [ ] Multi-agent management
- [ ] Custom token generation

## Files liên quan

### Main Files
- `/src/app/agent-install/page.tsx` - Main page component (refactored)
- `/src/app/(auth)/onboarding/page.tsx` - Onboarding flow integration
- `/template/guide.html` - Original HTML template

### Components
- `/src/components/agent-install/AgentInstallHeader.tsx`
- `/src/components/agent-install/InstallationTabs.tsx`
- `/src/components/agent-install/CommandDisplay.tsx`
- `/src/components/agent-install/ConnectionStatus.tsx`
- `/src/components/agent-install/TroubleshootingSection.tsx`
- `/src/components/agent-install/index.ts`

### Hooks
- `/src/hooks/useAgentInstall.ts`
- `/src/hooks/useCopyToClipboard.ts`

## Code Quality

### ✅ Best Practices Applied

1. **Component Separation**: Mỗi component có responsibility riêng
2. **Custom Hooks**: Logic tách ra khỏi UI
3. **Type Safety**: Full TypeScript với proper types
4. **Reusability**: Components có thể tái sử dụng
5. **Clean Code**: Clear naming, proper structure
6. **Performance**: useCallback để tránh re-renders
7. **Accessibility**: Semantic HTML, proper ARIA labels
8. **Error Handling**: Try-catch blocks, fallbacks

### 📁 Code Organization

```
Feature-based structure:
- Components grouped by feature (agent-install)
- Hooks grouped by functionality
- Types exported from component files
- Barrel exports (index.ts) for clean imports
```
