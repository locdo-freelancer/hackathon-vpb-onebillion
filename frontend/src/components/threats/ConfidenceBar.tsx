import React from "react";
import { getConfidenceColor, formatConfidence } from "@/config/threat-confidence.config";

interface ConfidenceBarProps {
  confidence: number; // 0-100
}

/**
 * Confidence Bar Component
 * Single Responsibility: Display confidence as a progress bar
 * Open/Closed: Uses configuration for colors (closed for modification)
 * Dependency Inversion: Depends on configuration abstraction
 */
export const ConfidenceBar: React.FC<ConfidenceBarProps> = ({ confidence }) => {
  const color = getConfidenceColor(confidence);

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-slate-900 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${color}`}
          style={{ width: `${confidence}%` }}
        />
      </div>
      <span className="text-xs text-white w-10 text-right">
        {formatConfidence(confidence)}
      </span>
    </div>
  );
};
