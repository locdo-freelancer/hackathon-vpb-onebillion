/**
 * Threats Module - Organized Exports (SOLID Principles)
 * 
 * Structure:
 * 1. Page-level Components (Composition)
 * 2. Section-level Components (Layout)
 * 3. Row-level Components
 * 4. Atomic Components (Reusable)
 */

// ============================================
// PAGE-LEVEL COMPONENTS (Composition)
// ============================================
export { ThreatsPageHeader } from "./ThreatsPageHeader";
export { ThreatsPageContent } from "./ThreatsPageContent";

// ============================================
// SECTION-LEVEL COMPONENTS (Layout)
// ============================================
export { ThreatsFilters } from "./ThreatsFilters";
export { ThreatsStatsBar } from "./ThreatsStatsBar";
export { ThreatsTable } from "./ThreatsTable";
export { ThreatDetailDrawer } from "./ThreatDetailDrawer";

// ============================================
// ROW-LEVEL COMPONENTS
// ============================================
export { ThreatRow } from "./ThreatRow";

// ============================================
// ATOMIC COMPONENTS (Reusable)
// ============================================
export { ThreatCheckbox } from "./ThreatCheckbox";
export { ConfidenceBar } from "./ConfidenceBar";
export { ConfidenceBadge } from "./ConfidenceBadge";
export { CountryFlag } from "./CountryFlag";
export { ThreatsEmptyState } from "./ThreatsEmptyState";
// Note: SeverityBadge & TypeBadge moved to @/components/shared
