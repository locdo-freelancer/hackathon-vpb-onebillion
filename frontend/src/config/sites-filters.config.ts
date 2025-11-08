/**
 * Sites Filters Configuration
 * Single Responsibility: Manages filter options and default values
 */

import type { SitesFilter, SiteStatus } from "@/types/sites.types";

export interface FilterOption {
  value: string;
  label: string;
  icon?: string;
}

/**
 * Status filter options
 */
export const statusFilterOptions: FilterOption[] = [
  { value: "all", label: "All Sites", icon: "fa-globe" },
  { value: "active", label: "Active", icon: "fa-check-circle" },
  { value: "warning", label: "Warning", icon: "fa-exclamation-triangle" },
  { value: "inactive", label: "Inactive", icon: "fa-times-circle" },
];

/**
 * Agent count filter options
 */
export const agentCountFilterOptions: FilterOption[] = [
  { value: "any", label: "Any Count" },
  { value: "0", label: "No Agents (0)" },
  { value: "1-5", label: "Few Agents (1-5)" },
  { value: "5+", label: "Many Agents (5+)" },
];

/**
 * Default filter configuration
 */
export const defaultSitesFilter: SitesFilter = {
  status: "all",
  agentCount: "any",
  searchQuery: "",
};

/**
 * Get filter label by value
 */
export const getFilterLabel = (
  filterType: "status" | "agentCount",
  value: string
): string => {
  const options =
    filterType === "status" ? statusFilterOptions : agentCountFilterOptions;
  return options.find((opt) => opt.value === value)?.label || value;
};

/**
 * Check if agent count matches filter
 */
export const matchesAgentCountFilter = (
  agentCount: number,
  filter: string
): boolean => {
  switch (filter) {
    case "any":
      return true;
    case "0":
      return agentCount === 0;
    case "1-5":
      return agentCount >= 1 && agentCount <= 5;
    case "5+":
      return agentCount > 5;
    default:
      return true;
  }
};
