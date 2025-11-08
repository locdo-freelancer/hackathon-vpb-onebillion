/**
 * Agents Module - Organized Exports
 * 
 * Structure:
 * 1. Page-level Components (Composition)
 * 2. Section-level Components (Layout)
 * 3. Atomic Components (Reusable)
 */

// ============================================
// PAGE-LEVEL COMPONENTS (Composition)
// ============================================
export { AgentsPageContent } from "./AgentsPageContent";
export { AgentsPageSidebar } from "./AgentsPageSidebar";

// ============================================
// SECTION-LEVEL COMPONENTS (Layout)
// ============================================
export { AgentStatsCards } from "./AgentStatsCards";
export { AgentTabs } from "./AgentTabs";
export { AgentGrid } from "./AgentGrid";
export { AgentMetricsCard } from "./AgentMetricsCard";
export { OSDistributionChart } from "./OSDistributionChart";
export { AgentDetailDrawer } from "./AgentDetailDrawer";

// ============================================
// ATOMIC COMPONENTS (Reusable)
// ============================================
export { AgentCard } from "./AgentCard";
export { AgentStatCard } from "./AgentStatCard";
// Note: AgentTabButton moved to @/components/shared (use TabButton)
export { StatusIndicator } from "./StatusIndicator";
export { AgentInfoRow } from "./AgentInfoRow";
export { CPUUsageBar } from "./CPUUsageBar";
export { UpdateProgressBar } from "./UpdateProgressBar";
