/**
 * Site Status Configuration
 * Single Responsibility: Manages site status colors, icons, and display settings
 */

import type { SiteStatus } from "@/types/sites.types";

export interface SiteStatusConfig {
  color: string;
  bgColor: string;
  textColor: string;
  dotColor: string;
  icon: string;
  label: string;
}

export const siteStatusConfig: Record<SiteStatus, SiteStatusConfig> = {
  active: {
    color: "green",
    bgColor: "bg-green-500/20",
    textColor: "text-green-400",
    dotColor: "text-green-500",
    icon: "fa-check-circle",
    label: "Active",
  },
  warning: {
    color: "yellow",
    bgColor: "bg-yellow-500/20",
    textColor: "text-yellow-400",
    dotColor: "text-yellow-500",
    icon: "fa-exclamation-triangle",
    label: "Warning",
  },
  inactive: {
    color: "gray",
    bgColor: "bg-gray-500/20",
    textColor: "text-gray-400",
    dotColor: "text-gray-500",
    icon: "fa-times-circle",
    label: "Inactive",
  },
};

/**
 * Get status configuration by status type
 */
export const getStatusConfig = (status: SiteStatus): SiteStatusConfig => {
  return siteStatusConfig[status];
};

/**
 * Get status color class for styling
 */
export const getStatusColor = (status: SiteStatus): string => {
  return siteStatusConfig[status].color;
};

/**
 * Get status text color class
 */
export const getStatusTextColor = (status: SiteStatus): string => {
  return siteStatusConfig[status].textColor;
};

/**
 * Get status background color class
 */
export const getStatusBgColor = (status: SiteStatus): string => {
  return siteStatusConfig[status].bgColor;
};
