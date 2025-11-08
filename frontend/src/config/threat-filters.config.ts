/**
 * Threat Filters Configuration
 * Single Responsibility: Manages filter options and default values
 */

import type { ThreatSeverity, ThreatType } from "@/types/threats.types";

export interface FilterOption {
  value: string;
  label: string;
  icon?: string;
  count?: number;
}

/**
 * Severity filter options
 */
export const severityFilterOptions: FilterOption[] = [
  { value: "all", label: "All Severities", icon: "fa-layer-group" },
  { value: "critical", label: "Critical", icon: "fa-exclamation-circle" },
  { value: "high", label: "High", icon: "fa-exclamation-triangle" },
  { value: "medium", label: "Medium", icon: "fa-info-circle" },
  { value: "low", label: "Low", icon: "fa-minus-circle" },
];

/**
 * Type filter options
 */
export const typeFilterOptions: FilterOption[] = [
  { value: "all", label: "All Types", icon: "fa-list" },
  { value: "ip", label: "IP Address", icon: "fa-network-wired" },
  { value: "domain", label: "Domain", icon: "fa-globe" },
  { value: "url", label: "URL", icon: "fa-link" },
  { value: "hash", label: "File Hash", icon: "fa-fingerprint" },
];

/**
 * Time range filter options
 */
export const timeRangeFilterOptions: FilterOption[] = [
  { value: "24h", label: "Last 24 Hours" },
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "90d", label: "Last 90 Days" },
];

/**
 * Get filter label by value
 */
export const getFilterLabel = (
  filterType: "severity" | "type" | "timeRange",
  value: string
): string => {
  let options: FilterOption[];
  
  switch (filterType) {
    case "severity":
      options = severityFilterOptions;
      break;
    case "type":
      options = typeFilterOptions;
      break;
    case "timeRange":
      options = timeRangeFilterOptions;
      break;
    default:
      return value;
  }
  
  return options.find((opt) => opt.value === value)?.label || value;
};

/**
 * Get active filter count
 */
export const getActiveFilterCount = (filter: {
  severity?: string;
  type?: string;
  country?: string;
  ipRange?: string;
  searchQuery?: string;
}): number => {
  let count = 0;
  
  if (filter.severity && filter.severity !== "all") count++;
  if (filter.type && filter.type !== "all") count++;
  if (filter.country) count++;
  if (filter.ipRange) count++;
  if (filter.searchQuery) count++;
  
  return count;
};
