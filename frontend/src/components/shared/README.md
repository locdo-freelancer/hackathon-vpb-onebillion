# Shared Components Library

## 📚 Overview

This folder contains **reusable components** that can be used across multiple modules in the application. All components follow **SOLID principles** and are designed for maximum reusability and flexibility.

## 🗂️ Structure

```
shared/
├── ui/                    # Basic UI components
│   ├── CodeBlock.tsx      # Code display with syntax highlighting
│   ├── InfoRow.tsx        # Key-value pair display
│   ├── ProgressBar.tsx    # Progress indicator
│   └── TabButton.tsx      # Tab button for tabbed interfaces
│
├── badges/                # Badge components
│   ├── Badge.tsx          # Generic badge
│   ├── StatusBadge.tsx    # Status indicator badge
│   └── SeverityBadge.tsx  # Severity level badge
│
├── cards/                 # Card-based layouts
│   └── MetricCard.tsx     # Metric/stat display card
│
├── states/                # State components
│   ├── LoadingState.tsx   # Loading UI state
│   ├── ErrorState.tsx     # Error UI state
│   └── EmptyState.tsx     # Empty data state
│
└── index.ts               # Barrel export
```

## 🎯 Usage Examples

### UI Components

#### CodeBlock
```tsx
import { CodeBlock } from "@/components/shared";

<CodeBlock 
  code="npm install package"
  language="bash"
  onCopy={handleCopy}
  showCopy={true}
/>
```

#### InfoRow
```tsx
import { InfoRow } from "@/components/shared";

<InfoRow 
  label="Status" 
  value="Active" 
  valueColor="text-green-400" 
/>
```

#### ProgressBar
```tsx
import { ProgressBar } from "@/components/shared";

<ProgressBar 
  percentage={75} 
  color="bg-cyan-400" 
  showLabel 
  animated 
/>
```

#### TabButton
```tsx
import { TabButton } from "@/components/shared";

<TabButton 
  label="Overview" 
  isActive={activeTab === 'overview'}
  onClick={() => setActiveTab('overview')}
  icon="fas fa-chart-line"
/>
```

### Badge Components

#### Badge
```tsx
import { Badge } from "@/components/shared";

<Badge label="Active" variant="success" />
<Badge label="Error" variant="error" icon="fas fa-exclamation" />
```

#### StatusBadge
```tsx
import { StatusBadge } from "@/components/shared";

<StatusBadge status="online" showDot />
<StatusBadge status="offline" label="Disconnected" />
```

#### SeverityBadge
```tsx
import { SeverityBadge } from "@/components/shared";

<SeverityBadge severity="CRITICAL" showIcon />
<SeverityBadge severity="LOW" size="md" />
```

### Card Components

#### MetricCard
```tsx
import { MetricCard } from "@/components/shared";

<MetricCard
  label="Total Users"
  value={1234}
  icon="fas fa-users"
  iconBg="bg-cyan-500/20"
  iconColor="text-cyan-400"
  trend={{ value: 12, direction: "up" }}
/>
```

### State Components

#### LoadingState
```tsx
import { LoadingState } from "@/components/shared";

if (isLoading) return <LoadingState />;
```

#### ErrorState
```tsx
import { ErrorState } from "@/components/shared";

if (error) {
  return (
    <ErrorState 
      message={error.message} 
      onRetry={() => refetch()} 
    />
  );
}
```

#### EmptyState
```tsx
import { EmptyState } from "@/components/shared";

<EmptyState
  icon="fas fa-inbox"
  title="No items found"
  message="Try adjusting your filters"
  action={{
    label: "Reset Filters",
    onClick: resetFilters
  }}
/>
```

## ✨ Benefits

### 1. **Reusability**
- Single source of truth for common UI patterns
- Reduce code duplication across modules
- Consistent behavior and styling

### 2. **Maintainability**
- Centralized updates affect all usages
- Easier to fix bugs and add features
- Clear separation of concerns

### 3. **Testability**
- Isolated components are easier to test
- Mock props for different scenarios
- Unit tests cover all use cases

### 4. **Consistency**
- Unified design language
- Predictable component behavior
- Standard props API

### 5. **Developer Experience**
- Clear documentation and examples
- TypeScript support with full type safety
- Easy to discover and use

## 📊 Component Matrix

| Component | Reusability | Modules Using | Props Count |
|-----------|-------------|---------------|-------------|
| LoadingState | ⭐⭐⭐⭐⭐ | All pages | 0 |
| ErrorState | ⭐⭐⭐⭐⭐ | All pages | 2 |
| Badge | ⭐⭐⭐⭐⭐ | All modules | 5 |
| StatusBadge | ⭐⭐⭐⭐ | Agents, Sites | 4 |
| SeverityBadge | ⭐⭐⭐⭐ | Threats, Incidents | 3 |
| MetricCard | ⭐⭐⭐⭐⭐ | Dashboard, Agents | 7 |
| CodeBlock | ⭐⭐⭐ | Agent Install | 6 |
| InfoRow | ⭐⭐⭐⭐⭐ | All detail views | 5 |
| ProgressBar | ⭐⭐⭐⭐ | Agents, Updates | 7 |
| TabButton | ⭐⭐⭐⭐ | All tabbed UIs | 5 |
| EmptyState | ⭐⭐⭐⭐⭐ | All lists/tables | 4 |

## 🔧 Adding New Shared Components

### Criteria for Shared Components:
1. **Used in 2+ modules** - Component is reused across different parts of the app
2. **Generic functionality** - Not tied to specific business logic
3. **Stable API** - Props interface is unlikely to change frequently
4. **SOLID compliant** - Follows Single Responsibility and Interface Segregation

### Steps to Add:
1. Create component in appropriate category folder
2. Add comprehensive JSDoc documentation
3. Include usage examples in docstring
4. Export from category index
5. Export from main `shared/index.ts`
6. Update this README with usage example
7. Add to Component Matrix table

## 🎨 Design Principles

### 1. Interface Segregation
- Minimal, focused props
- No unnecessary dependencies
- Optional props with sensible defaults

### 2. Single Responsibility
- Each component has one job
- Clear, descriptive names
- No mixed concerns

### 3. Dependency Inversion
- Depend on abstractions (types/interfaces)
- Not on concrete implementations
- Use config files where appropriate

### 4. Open/Closed
- Extendable via props
- Not requiring modification
- Composition over inheritance

## 📈 Migration Status

### ✅ Completed
- UI Components (4/4)
- Badge Components (3/3)
- State Components (3/3)
- Card Components (1/1)

### 🔄 In Progress
- None

### ⏳ Planned
- Form components (Input, Select, Checkbox, etc.)
- Modal/Dialog components
- Dropdown menu components
- Notification/Toast components

## 🔗 Related Documentation

- [SOLID Principles Guide](../../docs/SOLID_PRINCIPLES.md)
- [Component Architecture](../../docs/ARCHITECTURE.md)
- [TypeScript Guidelines](../../docs/TYPESCRIPT.md)

---

**Last Updated:** November 8, 2025  
**Total Shared Components:** 11  
**Average Reusability Score:** ⭐⭐⭐⭐ (4.2/5)
