import React from "react";
import {
  getConfidenceLevel,
  formatConfidence,
} from "@/config/threat-confidence.config";

interface ConfidenceBadgeProps {
  confidence: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

/**
 * Confidence Badge Component
 * Single Responsibility: Display confidence level with color coding
 * Open/Closed: Configurable via threat-confidence.config
 * Dependency Inversion: Depends on configuration abstraction
 */
export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({
  confidence,
  showLabel = false,
  size = "md",
}) => {
  const level = getConfidenceLevel(confidence);

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  };

  return (
    <div className="flex items-center gap-2">
      {showLabel && (
        <span className="text-xs text-gray-400">{level.label}</span>
      )}
      <span
        className={`${level.textColor} ${sizeClasses[size]} font-semibold rounded`}
      >
        {formatConfidence(confidence)}
      </span>
    </div>
  );
};
