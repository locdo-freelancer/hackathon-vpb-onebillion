# Agent Install - Component Architecture

## 📊 Component Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    AgentInstallPage                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  State Management (useState)                          │  │
│  │  - currentTab: TabType                                │  │
│  │                                                       │  │
│  │  Custom Hooks                                        │  │
│  │  - useAgentInstall() → connectionPhase, heartbeat   │  │
│  │  - useCopyToClipboard() → copyToClipboard fn       │  │
│  │                                                       │  │
│  │  Event Handlers                                      │  │
│  │  - setCurrentTab()                                   │  │
│  │  - handleContinue()                                  │  │
│  └───────────────────────────────────────────────────────┘  │
│                            ↓                                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Visual Components                        │  │
│  │                                                       │  │
│  │  AgentInstallHeader                                  │  │
│  │  ├─ Logo & Title                                     │  │
│  │  └─ Status Badge (connectionPhase)                  │  │
│  │                                                       │  │
│  │  InstallationTabs                                    │  │
│  │  ├─ Linux Tab                                        │  │
│  │  ├─ Windows Tab                                      │  │
│  │  └─ macOS Tab                                        │  │
│  │        ↓ (currentTab)                               │  │
│  │                                                       │  │
│  │  CommandDisplay                                      │  │
│  │  ├─ Platform Info                                    │  │
│  │  ├─ Command Block                                    │  │
│  │  ├─ Copy Button → copyToClipboard()                │  │
│  │  └─ Installation Steps                              │  │
│  │                                                       │  │
│  │  ConnectionStatus                                    │  │
│  │  ├─ Status Card (connectionPhase)                   │  │
│  │  │   • Waiting → Yellow                             │  │
│  │  │   • Connected → Blue                             │  │
│  │  │   • Registered → Green                           │  │
│  │  └─ Heartbeat Display (if registered)               │  │
│  │                                                       │  │
│  │  TroubleshootingSection                             │  │
│  │  └─ Accordion Items (3 common issues)               │  │
│  │                                                       │  │
│  │  Navigation Buttons                                  │  │
│  │  ├─ Back Button → router.back()                     │  │
│  │  └─ Continue Button → handleContinue()              │  │
│  │      (enabled when isRegistered)                    │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow

```
┌──────────────────┐
│  useAgentInstall │
│     (Hook)       │
└────────┬─────────┘
         │
         │ Provides:
         │ - connectionPhase
         │ - heartbeatTime
         │ - isRegistered
         │
         ↓
┌────────────────────────────┐
│   AgentInstallPage         │
│   (Parent Component)       │
└─────────┬──────────────────┘
          │
          │ Props Down
          ↓
┌─────────────────────────────────────┐
│  Child Components                   │
│  ├─ AgentInstallHeader              │
│  │   └─ receives: connectionPhase   │
│  ├─ InstallationTabs                │
│  │   └─ receives: currentTab        │
│  │   └─ calls: setCurrentTab()      │
│  ├─ CommandDisplay                  │
│  │   └─ receives: currentTab        │
│  │   └─ calls: copyToClipboard()    │
│  ├─ ConnectionStatus                │
│  │   └─ receives: connectionPhase   │
│  │   └─ receives: heartbeatTime     │
│  └─ TroubleshootingSection          │
│      └─ receives: none (static)     │
└─────────────────────────────────────┘
```

## 🎯 Hook Responsibilities

### useAgentInstall
```typescript
┌─────────────────────────┐
│   useAgentInstall()     │
├─────────────────────────┤
│ Manages:                │
│ • Connection simulation │
│ • Phase transitions     │
│ • Heartbeat updates     │
│                         │
│ Timeline:               │
│ 0s   → waiting          │
│ 5s   → connected        │
│ 8s   → registered       │
│ 8s+  → heartbeat/30s    │
│                         │
│ Cleanup:                │
│ • Clear timeouts        │
│ • Clear intervals       │
└─────────────────────────┘
```

### useCopyToClipboard
```typescript
┌──────────────────────────┐
│  useCopyToClipboard()    │
├──────────────────────────┤
│ Manages:                 │
│ • Clipboard API          │
│ • Button state changes   │
│ • Success feedback       │
│ • Auto-reset timer       │
│                          │
│ Flow:                    │
│ 1. Copy text             │
│ 2. Find button by ID     │
│ 3. Show success (green)  │
│ 4. Wait 2 seconds        │
│ 5. Reset to original     │
└──────────────────────────┘
```

## 📦 File Structure

```
src/
├── app/
│   └── agent-install/
│       └── page.tsx                    (60 lines, refactored)
│
├── components/
│   └── agent-install/
│       ├── index.ts                    (7 lines - barrel export)
│       ├── AgentInstallHeader.tsx      (60 lines)
│       ├── InstallationTabs.tsx        (40 lines)
│       ├── CommandDisplay.tsx          (110 lines)
│       ├── ConnectionStatus.tsx        (90 lines)
│       └── TroubleshootingSection.tsx  (70 lines)
│
└── hooks/
    ├── useAgentInstall.ts              (60 lines)
    └── useCopyToClipboard.ts           (40 lines)
```

## 🎨 Component Props Interface

```typescript
// AgentInstallHeader
interface AgentInstallHeaderProps {
  connectionPhase: ConnectionPhase;
}

// InstallationTabs
interface InstallationTabsProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
}

// CommandDisplay
interface CommandDisplayProps {
  currentTab: TabType;
  onCopy: (text: string, buttonId: string) => void;
}

// ConnectionStatus
interface ConnectionStatusProps {
  phase: ConnectionPhase;
  heartbeatTime?: string;
}

// TroubleshootingSection
interface TroubleshootingSectionProps {
  // No props - all data is static
}
```

## 🔧 Type Definitions

```typescript
type TabType = "linux" | "windows" | "mac";

type ConnectionPhase = "waiting" | "connected" | "registered";

// Platform Info Structure
interface PlatformInfo {
  title: string;
  subtitle: string;
  steps: Array<{
    title: string;
    desc: string;
  }>;
}

// Troubleshooting Item Structure
interface TroubleshootingItem {
  title: string;
  solutions: string[];
}
```

## 🚀 Benefits of Refactored Architecture

### ✅ Separation of Concerns
- UI components don't contain business logic
- Hooks handle complex state management
- Each component has a single responsibility

### ✅ Reusability
- Components can be used in other pages
- Hooks can be used across features
- Type definitions are shared

### ✅ Testability
- Each component can be tested in isolation
- Hooks can be tested independently
- Mock props easily for unit tests

### ✅ Maintainability
- Easy to find and fix bugs
- Clear file structure
- Self-documenting code

### ✅ Scalability
- Easy to add new features
- Components can be extended
- No code duplication

## 📝 Usage Example

```tsx
// Simple usage in page
import { useAgentInstall } from "@/hooks/useAgentInstall";
import { AgentInstallHeader } from "@/components/agent-install";

export default function Page() {
  const { connectionPhase, heartbeatTime } = useAgentInstall();
  
  return (
    <div>
      <AgentInstallHeader connectionPhase={connectionPhase} />
      {/* Other components */}
    </div>
  );
}
```
