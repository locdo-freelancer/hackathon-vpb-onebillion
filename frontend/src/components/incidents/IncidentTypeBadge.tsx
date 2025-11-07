import React from "react";
import type { IncidentType } from "@/types/incidents.types";

interface IncidentTypeBadgeProps {
  type: IncidentType;
}

export const IncidentTypeBadge: React.FC<IncidentTypeBadgeProps> = ({ type }) => {
  const getStyles = () => {
    switch (type) {
      case "malware":
        return "bg-purple-500/20 text-purple-400";
      case "phishing":
        return "bg-blue-500/20 text-blue-400";
      case "ddos":
        return "bg-cyan-500/20 text-cyan-400";
      case "intrusion":
        return "bg-red-500/20 text-red-400";
      case "data-breach":
        return "bg-pink-500/20 text-pink-400";
      case "policy-violation":
        return "bg-green-500/20 text-green-400";
      case "ransomware":
        return "bg-orange-500/20 text-orange-400";
      case "vulnerability":
        return "bg-yellow-500/20 text-yellow-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getLabel = () => {
    return type
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStyles()}`}
    >
      {getLabel()}
    </span>
  );
};
