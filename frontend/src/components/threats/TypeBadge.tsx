import React from "react";
import type { ThreatType } from "@/types/threats.types";

interface TypeBadgeProps {
  type: ThreatType;
}

export const TypeBadge: React.FC<TypeBadgeProps> = ({ type }) => {
  const getStyles = () => {
    switch (type) {
      case "ip":
        return "bg-blue-500/20 text-blue-400";
      case "domain":
        return "bg-green-500/20 text-green-400";
      case "url":
        return "bg-cyan-500/20 text-cyan-400";
      case "hash":
        return "bg-purple-500/20 text-purple-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getLabel = () => {
    switch (type) {
      case "ip":
        return "IP Address";
      case "domain":
        return "Domain";
      case "url":
        return "URL";
      case "hash":
        return "File Hash";
      default:
        return type;
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStyles()}`}
    >
      {getLabel()}
    </span>
  );
};
