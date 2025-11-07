import React from "react";
import type { IncidentSeverity } from "@/types/incidents.types";

interface IncidentSeverityBadgeProps {
  severity: IncidentSeverity;
}

export const IncidentSeverityBadge: React.FC<IncidentSeverityBadgeProps> = ({
  severity,
}) => {
  const getStyles = () => {
    switch (severity) {
      case "critical":
        return {
          className: "bg-red-500/20 text-red-400",
          icon: "fas fa-exclamation-triangle",
        };
      case "high":
        return {
          className: "bg-orange-500/20 text-orange-400",
          icon: "fas fa-exclamation-circle",
        };
      case "medium":
        return {
          className: "bg-yellow-500/20 text-yellow-400",
          icon: "fas fa-info-circle",
        };
      case "low":
        return {
          className: "bg-gray-500/20 text-gray-400",
          icon: "fas fa-minus-circle",
        };
      default:
        return {
          className: "bg-gray-500/20 text-gray-400",
          icon: "fas fa-circle",
        };
    }
  };

  const { className, icon } = getStyles();

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
    >
      <i className={`${icon} mr-1`} />
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </span>
  );
};
