/**
 * Dashboard Module - Organized Exports
 * 
 * Structure:
 * 1. Page-level Components (Composition)
 * 2. Section-level Components (Layout & Cards)
 * 3. State Components (Loading, Error, Background)
 * 4. Atomic Components (Reusable UI elements)
 */

// ============================================
// PAGE-LEVEL COMPONENTS (Composition)
// ============================================
export { DashboardMainContent } from "./DashboardMainContent";

// ============================================
// SECTION-LEVEL COMPONENTS (Layout & Cards)
// ============================================
export { DashboardSidebar } from "./DashboardSidebar";
export { DashboardHeader } from "./DashboardHeader";
export { RiskScoreCard } from "./RiskScoreCard";
export { ActiveThreatsCard } from "./ActiveThreatsCard";
export { IncidentSummaryCard } from "./IncidentSummaryCard";
export { SeverityChart } from "./SeverityChart";
export { TrendsChart } from "./TrendsChart";

// ============================================
// STATE COMPONENTS (Background Effects)
// ============================================
// Note: LoadingState & ErrorState moved to @/components/shared
export { DashboardBackground } from "./DashboardBackground";

// ============================================
// ATOMIC COMPONENTS (Reusable)
// ============================================
export { RiskMetricCard } from "./RiskMetricCard";
export { RiskScoreTrend } from "./RiskScoreTrend";
export { RiskLevelBar } from "./RiskLevelBar";
