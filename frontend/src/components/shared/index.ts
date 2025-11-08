/**
 * Shared Components Index
 * 
 * This file exports all reusable components that can be used across multiple modules.
 * Components are organized by category for easy discovery and maintenance.
 * 
 * Categories:
 * - UI: Basic UI components (buttons, inputs, progress bars, etc.)
 * - Badges: Status and label badges
 * - Cards: Card-based layouts
 * - States: Loading, error, empty states
 */

// ============================================
// UI COMPONENTS
// ============================================
export { CodeBlock } from "./ui/CodeBlock";
export { InfoRow } from "./ui/InfoRow";
export { ProgressBar } from "./ui/ProgressBar";
export { TabButton } from "./ui/TabButton";

// ============================================
// BADGE COMPONENTS
// ============================================
export { Badge } from "./badges/Badge";
export type { BadgeVariant, BadgeSize } from "./badges/Badge";

export { StatusBadge } from "./badges/StatusBadge";
export type { StatusVariant } from "./badges/StatusBadge";

export { SeverityBadge } from "./badges/SeverityBadge";
export type { SeverityLevel } from "./badges/SeverityBadge";

// ============================================
// CARD COMPONENTS
// ============================================
export { MetricCard } from "./cards/MetricCard";

// ============================================
// STATE COMPONENTS
// ============================================
export { LoadingState } from "./states/LoadingState";
export { ErrorState } from "./states/ErrorState";
export { EmptyState } from "./states/EmptyState";
