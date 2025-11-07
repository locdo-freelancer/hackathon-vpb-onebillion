import React from "react";
import type { IncidentStatus } from "@/types/incidents.types";

interface IncidentStatusBadgeProps {
  status: IncidentStatus;
}

export const IncidentStatusBadge: React.FC<IncidentStatusBadgeProps> = ({
  status,
}) => {
  const getStyles = () => {
    switch (status) {
      case "open":
        return "bg-red-500/20 text-red-400";
      case "investigating":
        return "bg-orange-500/20 text-orange-400";
      case "resolved":
        return "bg-green-500/20 text-green-400";
      case "closed":
        return "bg-gray-500/20 text-gray-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getLabel = () => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStyles()}`}
    >
      {getLabel()}
    </span>
  );
};
