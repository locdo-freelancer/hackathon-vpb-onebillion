import React from "react";
import type { RiskLevel } from "@/config/risk-score.config";
import { getRiskLevelConfig } from "@/config/risk-score.config";

interface RiskLevelBarProps {
  level: RiskLevel;
  scorePercentage: number;
}

/**
 * Risk Level Progress Bar Component
 * Single Responsibility: Renders risk level indicator bar
 * Interface Segregation: Only needs level and percentage
 */
export const RiskLevelBar: React.FC<RiskLevelBarProps> = ({
  level,
  scorePercentage,
}) => {
  const levelConfig = getRiskLevelConfig(level);

  return (
    <div className="mt-6 space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">Risk Level</span>
        <span className={`${levelConfig.color} font-semibold`}>{level}</span>
      </div>
      <div className="w-full bg-slate-950 rounded-full h-2">
        <div
          className={`bg-linear-to-r ${levelConfig.bgColor} via-yellow-500 to-red-500 h-2 rounded-full transition-all duration-500`}
          style={{ width: `${scorePercentage}%` }}
        />
      </div>
    </div>
  );
};
