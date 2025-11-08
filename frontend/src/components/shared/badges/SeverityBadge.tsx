import React from "react";

export type SeverityLevel = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

interface SeverityBadgeProps {
  severity: SeverityLevel;
  size?: "sm" | "md";
  showIcon?: boolean;
}

/**
 * Shared Severity Badge Component
 * 
 * Single Responsibility: Renders severity level badge
 * Interface Segregation: Minimal props for severity display
 * Reusability: Can be used across threats, incidents, alerts
 * 
 * Usage:
 * ```tsx
 * <SeverityBadge severity="CRITICAL" showIcon />
 * <SeverityBadge severity="LOW" size="md" />
 * ```
 */
export const SeverityBadge: React.FC<SeverityBadgeProps> = ({
  severity,
  size = "sm",
  showIcon = false,
}) => {
  const severityConfig: Record<
    SeverityLevel,
    { bgColor: string; icon: string }
  > = {
    CRITICAL: {
      bgColor: "bg-red-500/20 text-red-400 border-red-500/30",
      icon: "fas fa-exclamation-circle",
    },
    HIGH: {
      bgColor: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      icon: "fas fa-exclamation-triangle",
    },
    MEDIUM: {
      bgColor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      icon: "fas fa-exclamation",
    },
    LOW: {
      bgColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      icon: "fas fa-info-circle",
    },
  };

  const config = severityConfig[severity];
  const sizeClasses = size === "sm" ? "px-3 py-1 text-sm" : "px-4 py-1.5 text-base";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${config.bgColor} ${sizeClasses}`}
    >
      {showIcon && <i className={config.icon} />}
      {severity}
    </span>
  );
};
