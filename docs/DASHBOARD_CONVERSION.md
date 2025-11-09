# Dashboard Conversion Guide

## 📊 Current Status

### ✅ Completed (Agent Install - guide.html)
- ✅ Agent Install page fully converted from `guide.html` → React
- ✅ All components created and working
- ✅ Located at: `/agent-install`
- ✅ Integrated into onboarding flow

### ⚠️ In Progress (Dashboard - dashboard.html)
- ⚠️ **Dashboard page is currently a PLACEHOLDER**
- ✅ All dashboard components created but **NOT INTEGRATED**
- ✅ Mock data and hooks ready
- ❌ Main dashboard page needs to be built

---

## 🎯 Next Step: Convert Dashboard Page

### What We Have

#### 1. **Components** (Already Created ✅)
Located in: `frontend/src/components/dashboard/`
```
✅ DashboardSidebar.tsx     - Left navigation sidebar
✅ DashboardHeader.tsx      - Top header with search & notifications
✅ RiskScoreCard.tsx        - Risk score display card
✅ ActiveThreatsCard.tsx    - Active threats list
✅ IncidentSummaryCard.tsx  - Incident statistics
✅ SeverityChart.tsx        - Pie chart for severity distribution
✅ TrendsChart.tsx          - Line chart for attack trends
✅ index.ts                 - Barrel export file
```

#### 2. **Data Layer** (Already Created ✅)
```
✅ types/dashboard.types.ts          - All TypeScript interfaces
✅ hooks/useDashboardData.ts         - Custom hook with mock data
```

#### 3. **Template Reference** (HTML)
```
📄 frontend/template/dashboard.html   - Original design to match
```

#### 4. **Current Page** (Needs Replacement ❌)
```
❌ src/app/dashboard/page.tsx        - PLACEHOLDER (success message only)
```

---

## 🔧 What Needs to be Done

### Step 1: Replace Dashboard Page
Replace the placeholder in `src/app/dashboard/page.tsx` with full dashboard implementation.

**Required Structure:**
```tsx
<div className="dashboard-container">
  <DashboardSidebar user={...} navItems={...} />
  
  <div className="main-content">
    <DashboardHeader />
    
    <main className="dashboard-content">
      {/* Risk Score Section */}
      <RiskScoreCard data={...} />
      
      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-8">
        <SeverityChart data={...} />
        <TrendsChart data={...} />
      </div>
      
      {/* Threats & Incidents Grid */}
      <div className="grid grid-cols-2 gap-8">
        <ActiveThreatsCard threats={...} />
        <IncidentSummaryCard stats={...} resolutionStats={...} />
      </div>
    </main>
  </div>
</div>
```

### Step 2: Data Integration
```tsx
"use client";

import { useDashboardData } from "@/hooks/useDashboardData";
import {
  DashboardSidebar,
  DashboardHeader,
  RiskScoreCard,
  SeverityChart,
  TrendsChart,
  ActiveThreatsCard,
  IncidentSummaryCard,
} from "@/components/dashboard";

export default function DashboardPage() {
  const { data, loading, error } = useDashboardData();
  
  if (loading) return <LoadingState />;
  if (error) return <ErrorState />;
  
  return (
    <div className="dashboard">
      {/* Use all components with real data */}
    </div>
  );
}
```

---

## 📋 Comparison: HTML Template vs React Components

### HTML Template Structure (dashboard.html)
```html
<div id="dashboard-container">
  <!-- Sidebar -->
  <aside id="sidebar">
    <nav>...</nav>
    <div class="user-profile">...</div>
  </aside>
  
  <!-- Main Content -->
  <div class="flex-1">
    <!-- Header -->
    <header id="header">...</header>
    
    <!-- Dashboard Content -->
    <main id="dashboard-main">
      <!-- Risk Score Section -->
      <div id="risk-score-section">...</div>
      
      <!-- Charts Grid -->
      <div id="charts-grid" class="grid grid-cols-2">
        <div id="severity-chart-card">...</div>
        <div id="trends-chart-card">...</div>
      </div>
      
      <!-- Threats & Incidents -->
      <div id="threats-incidents-grid" class="grid grid-cols-2">
        <div id="active-threats-card">...</div>
        <div id="incident-summary-card">...</div>
      </div>
    </main>
  </div>
</div>
```

### React Component Structure (Target)
```tsx
<DashboardContainer>
  <DashboardSidebar user={user} navItems={navItems} />
  
  <MainContent>
    <DashboardHeader />
    
    <DashboardMain>
      <RiskScoreCard data={data.riskScore} metrics={data.riskMetrics} />
      
      <ChartsGrid>
        <SeverityChart data={data.severityChart} />
        <TrendsChart data={data.trendsChart} />
      </ChartsGrid>
      
      <ThreatsIncidentsGrid>
        <ActiveThreatsCard threats={data.threats} />
        <IncidentSummaryCard 
          stats={data.incidentStats}
          resolutionStats={data.resolutionStats}
        />
      </ThreatsIncidentsGrid>
    </DashboardMain>
  </MainContent>
</DashboardContainer>
```

---

## 🔍 Key Differences from HTML

### 1. **Static HTML** → **Dynamic React**
```html
<!-- HTML: Static data -->
<div class="text-6xl">68</div>
```

```tsx
// React: Dynamic from API/Mock
<div className="text-6xl">{data.riskScore.score}</div>
```

### 2. **Inline JavaScript** → **React Hooks**
```html
<!-- HTML: Inline script -->
<script>
  Plotly.newPlot('severity-pie-chart', chartData);
</script>
```

```tsx
// React: Component with useEffect
export const SeverityChart = ({ data }) => {
  useEffect(() => {
    import("plotly.js-dist-min").then((Plotly) => {
      Plotly.newPlot(chartRef.current, data);
    });
  }, [data]);
};
```

### 3. **Hard-coded Values** → **Type-safe Props**
```tsx
interface DashboardProps {
  data: DashboardData;  // Fully typed
}
```

---

## 🎨 Styling Match

All components already use Tailwind classes matching the HTML template:
- ✅ `bg-cyber-darker` - Dark background
- ✅ `border-cyber-border` - Consistent borders
- ✅ `text-cyber-accent` - Accent colors
- ✅ `shadow-glow-cyan` - Glow effects
- ✅ Same spacing, sizing, and layout

---

## 🚀 Implementation Priority

### Phase 1: Basic Layout (30 min)
1. Replace placeholder page with layout structure
2. Integrate Sidebar + Header
3. Test navigation and responsive design

### Phase 2: Data Visualization (30 min)
1. Add RiskScoreCard with live data
2. Integrate SeverityChart (Plotly)
3. Integrate TrendsChart (Plotly)

### Phase 3: Content Cards (20 min)
1. Add ActiveThreatsCard with threats list
2. Add IncidentSummaryCard with statistics
3. Test all interactions

### Phase 4: Polish (10 min)
1. Add loading states
2. Add error handling
3. Test all features
4. Verify against HTML template

**Total Time Estimate: ~1.5 hours**

---

## 📦 Files to Modify

### Main File to Edit:
```
📝 src/app/dashboard/page.tsx  - REPLACE ENTIRE FILE
```

### Files Already Ready (No Changes Needed):
```
✅ src/components/dashboard/*  - All components ready
✅ src/hooks/useDashboardData.ts - Data hook ready
✅ src/types/dashboard.types.ts - Types defined
```

---

## ✅ Success Criteria

Dashboard is complete when:
- [ ] Full layout matches `dashboard.html` design
- [ ] All 7 dashboard components are integrated
- [ ] Data flows from `useDashboardData` hook
- [ ] Charts render correctly (Plotly)
- [ ] Responsive design works
- [ ] Navigation between pages works
- [ ] Loading and error states implemented

---

## 🔗 Related Documentation

- `AGENT_INSTALL_SUMMARY.md` - Example of completed conversion
- `HTML_VS_REACT_COMPARISON.md` - Conversion patterns
- `template/dashboard.html` - Original template reference

---

## 🎯 Ready to Start?

All components are built and tested. You just need to:
1. Open `src/app/dashboard/page.tsx`
2. Replace placeholder with full dashboard layout
3. Import and use all dashboard components
4. Connect to `useDashboardData` hook
5. Test and verify

**The hard work is done - just assembly required! 🚀**
