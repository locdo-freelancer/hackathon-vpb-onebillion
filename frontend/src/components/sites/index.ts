/**
 * Sites Module - Organized Exports (SOLID Principles)
 * 
 * Structure:
 * 1. Page-level Components (Composition)
 * 2. Section-level Components (Layout)
 * 3. Atomic Components (Reusable)
 */

// ============================================
// PAGE-LEVEL COMPONENTS (Composition)
// ============================================
export { SitesPageContent } from "./SitesPageContent";
export { SitesStatsFooter } from "./SitesStatsFooter";

// ============================================
// SECTION-LEVEL COMPONENTS (Layout)
// ============================================
export { SitesTable } from "./SitesTable";
export { SitesToolbar } from "./SitesToolbar";
export { FilterMenu } from "./FilterMenu";
export { BulkActionsMenu } from "./BulkActionsMenu";
export { SiteModal } from "./SiteModal";

// ============================================
// ROW-LEVEL COMPONENTS
// ============================================
export { SiteRow } from "./SiteRow";
export { SiteActions } from "./SiteActions";

// ============================================
// ATOMIC COMPONENTS (Reusable)
// ============================================
export { SiteCheckbox } from "./SiteCheckbox";
export { SiteIcon } from "./SiteIcon";
export { AgentCountBadge } from "./AgentCountBadge";
export { SitesEmptyState } from "./SitesEmptyState";
// Note: SiteStatusBadge moved to @/components/shared (use StatusBadge)
