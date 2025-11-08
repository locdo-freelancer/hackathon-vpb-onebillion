/**
 * Threat Severity Configuration
 * Single Responsibility: Manages threat severity levels, colors, and display settings
 */

import type { ThreatSeverity } from "@/types/threats.types";

export interface ThreatSeverityConfig {
  level: ThreatSeverity;
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  icon: string;
  priority: number; // 1 = highest
}

export const threatSeverityConfig: Record<ThreatSeverity, ThreatSeverityConfig> = {
  critical: {
    level: "critical",
    label: "Critical",
    color: "red",
    bgColor: "bg-red-500/20",
    textColor: "text-red-400",
    borderColor: "border-red-500/30",
    icon: "fa-exclamation-circle",
    priority: 1,
  },
  high: {
    level: "high",
    label: "High",
    color: "orange",
    bgColor: "bg-orange-500/20",
    textColor: "text-orange-400",
    borderColor: "border-orange-500/30",
    icon: "fa-exclamation-triangle",
    priority: 2,
  },
  medium: {
    level: "medium",
    label: "Medium",
    color: "yellow",
    bgColor: "bg-yellow-500/20",
    textColor: "text-yellow-400",
    borderColor: "border-yellow-500/30",
    icon: "fa-info-circle",
    priority: 3,
  },
  low: {
    level: "low",
    label: "Low",
    color: "gray",
    bgColor: "bg-gray-500/20",
    textColor: "text-gray-400",
    borderColor: "border-gray-500/30",
    icon: "fa-minus-circle",
    priority: 4,
  },
};

/**
 * Get severity configuration
 */
export const getSeverityConfig = (severity: ThreatSeverity): ThreatSeverityConfig => {
  return threatSeverityConfig[severity];
};

/**
 * Get severity color for styling
 */
export const getSeverityColor = (severity: ThreatSeverity): string => {
  return threatSeverityConfig[severity].color;
};

/**
 * Get severity text color class
 */
export const getSeverityTextColor = (severity: ThreatSeverity): string => {
  return threatSeverityConfig[severity].textColor;
};

/**
 * Get severity background color class
 */
export const getSeverityBgColor = (severity: ThreatSeverity): string => {
  return threatSeverityConfig[severity].bgColor;
};

/**
 * Sort threats by severity priority
 */
export const sortBySeverity = <T extends { severity: ThreatSeverity }>(
  items: T[]
): T[] => {
  return [...items].sort((a, b) => {
    return (
      threatSeverityConfig[a.severity].priority -
      threatSeverityConfig[b.severity].priority
    );
  });
};
