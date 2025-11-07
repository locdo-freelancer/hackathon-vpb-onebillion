# Agent Install - Quick Reference Guide

## 📝 Quick Start

### Access the Page
```
Direct: http://localhost:3000/agent-install
After Onboarding: Automatic redirect from step 4
```

### File Locations
```
Page:       src/app/agent-install/page.tsx
Components: src/components/agent-install/
Hooks:      src/hooks/useAgentInstall.ts
            src/hooks/useCopyToClipboard.ts
```

## 🎯 Import Examples

### Using Components
```tsx
import {
  AgentInstallHeader,
  InstallationTabs,
  CommandDisplay,
  ConnectionStatus,
  TroubleshootingSection,
} from "@/components/agent-install";
```

### Using Hooks
```tsx
import { useAgentInstall } from "@/hooks/useAgentInstall";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

// In component
const { connectionPhase, heartbeatTime, isRegistered } = useAgentInstall();
const { copyToClipboard } = useCopyToClipboard();
```

### Using Types
```tsx
import type { TabType, ConnectionPhase } from "@/components/agent-install";
```

## 🔧 Component Props

### AgentInstallHeader
```tsx
<AgentInstallHeader connectionPhase={connectionPhase} />
```

### InstallationTabs
```tsx
<InstallationTabs
  currentTab={currentTab}
  onTabChange={setCurrentTab}
/>
```

### CommandDisplay
```tsx
<CommandDisplay
  currentTab={currentTab}
  onCopy={copyToClipboard}
/>
```

### ConnectionStatus
```tsx
<ConnectionStatus
  phase={connectionPhase}
  heartbeatTime={heartbeatTime}
/>
```

### TroubleshootingSection
```tsx
<TroubleshootingSection />
```

## 🎨 Styling Classes

### Colors
```css
Primary:   text-cyan-400, bg-cyan-500
Secondary: text-purple-400, bg-purple-500
Success:   text-green-400, bg-green-500
Warning:   text-yellow-400, bg-yellow-500
Info:      text-blue-400, bg-blue-500
```

### Backgrounds
```css
Card:      bg-slate-900/50
Dark:      bg-slate-950
Border:    border-slate-800
```

### Effects
```css
Blur:      backdrop-blur-xl, blur-3xl
Shadow:    shadow-lg shadow-cyan-500/20
Gradient:  bg-gradient-to-br from-cyan-500 to-purple-600
```

## 🔄 State Flow

### Connection Phases
```
"waiting"    → Yellow, Animated pulse
"connected"  → Blue, Static
"registered" → Green, Shows heartbeat
```

### Tab Types
```
"linux"   → Linux installation
"windows" → Windows installation
"mac"     → macOS installation
```

## 📊 Data Structures

### Install Commands
```typescript
const INSTALL_COMMANDS: Record<TabType, string> = {
  linux: "curl -sSL ...",
  windows: "Invoke-WebRequest ...",
  mac: "curl -sSL ...",
};
```

### Platform Info
```typescript
interface PlatformInfo {
  title: string;      // "Linux Installation"
  subtitle: string;   // "Ubuntu, CentOS, RHEL, Debian"
  steps: Array<{
    title: string;    // "Run with sudo privileges"
    desc: string;     // "The script will detect..."
  }>;
}
```

## 🎯 Common Tasks

### Add New Platform
```typescript
// 1. Update TabType
type TabType = "linux" | "windows" | "mac" | "docker";

// 2. Add to INSTALL_COMMANDS
const INSTALL_COMMANDS = {
  // ... existing
  docker: "docker run ...",
};

// 3. Add to PLATFORM_INFO
const PLATFORM_INFO = {
  // ... existing
  docker: { title: "...", subtitle: "...", steps: [...] },
};

// 4. Add tab button in InstallationTabs
```

### Customize Connection Timing
```typescript
// In useAgentInstall.ts
const simulateConnection = () => {
  setTimeout(() => {
    setConnectionPhase("connected");
    
    setTimeout(() => {
      setConnectionPhase("registered");
      // ... rest
    }, 3000); // ← Change this
  }, 5000); // ← Change this
};
```

### Modify Troubleshooting Items
```typescript
// In TroubleshootingSection.tsx
const TROUBLESHOOTING_ITEMS = [
  {
    title: "Your new issue",
    solutions: [
      "Solution 1",
      "Solution 2",
    ],
  },
  // ... more items
];
```

## 🧪 Testing Examples

### Component Test
```tsx
import { render, screen } from '@testing-library/react';
import { InstallationTabs } from '@/components/agent-install';

test('renders all tabs', () => {
  render(<InstallationTabs currentTab="linux" onTabChange={() => {}} />);
  expect(screen.getByText('Linux')).toBeInTheDocument();
  expect(screen.getByText('Windows')).toBeInTheDocument();
  expect(screen.getByText('macOS')).toBeInTheDocument();
});
```

### Hook Test
```tsx
import { renderHook, waitFor } from '@testing-library/react';
import { useAgentInstall } from '@/hooks/useAgentInstall';

test('transitions from waiting to connected', async () => {
  const { result } = renderHook(() => useAgentInstall());
  
  expect(result.current.connectionPhase).toBe('waiting');
  
  await waitFor(() => {
    expect(result.current.connectionPhase).toBe('connected');
  }, { timeout: 6000 });
});
```

## 🐛 Common Issues

### Font Awesome Icons Not Showing
```tsx
// Check layout.tsx has Font Awesome CDN
<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
/>
```

### Copy Button Not Working
```tsx
// Ensure button has correct ID
<button id={`copy-btn-${currentTab}`} />

// Pass correct ID to function
copyToClipboard(command, `copy-btn-${currentTab}`);
```

### Types Not Found
```tsx
// Import from correct location
import type { TabType, ConnectionPhase } from "@/components/agent-install";
```

## 📚 Related Files

### Onboarding Integration
```
src/app/(auth)/onboarding/page.tsx
Line 84: router.push("/agent-install");
```

### Layout Configuration
```
src/app/layout.tsx
Lines 28-32: Font Awesome CDN
```

### Global Styles
```
src/app/globals.css
Tailwind configuration
```

## 🚀 Performance Tips

### Memoization
```tsx
// For expensive calculations
const expensiveValue = useMemo(() => {
  return calculateSomething(data);
}, [data]);

// For callbacks
const handleClick = useCallback(() => {
  doSomething();
}, [dependency]);
```

### Code Splitting
```tsx
// Lazy load heavy components
const HeavyComponent = lazy(() => import('./HeavyComponent'));

<Suspense fallback={<Loading />}>
  <HeavyComponent />
</Suspense>
```

## 📖 Best Practices

### ✅ Do
- Use TypeScript for type safety
- Separate components by responsibility
- Use custom hooks for complex logic
- Document complex functions
- Test components in isolation

### ❌ Don't
- Mix business logic with UI
- Use `any` type
- Duplicate code
- Put all code in one file
- Forget to clean up effects

## 🎓 Learning Resources

### Official Docs
- [Next.js App Router](https://nextjs.org/docs/app)
- [React Hooks](https://react.dev/reference/react)
- [TypeScript](https://www.typescriptlang.org/)

### Related Patterns
- Component Composition
- Custom Hooks
- Controlled Components
- Compound Components

---

**Last Updated**: November 7, 2025  
**Version**: 1.0.0  
**Maintainer**: Development Team
