import React from "react";
import type { MetricCardConfig } from "@/config/risk-score.config";

interface RiskMetricCardProps {
  config: MetricCardConfig;
  value: number;
}

/**
 * Risk Metric Card Component
 * Single Responsibility: Renders a single metric card
 * Interface Segregation: Minimal props - config and value
 */
export const RiskMetricCard: React.FC<RiskMetricCardProps> = ({
  config,
  value,
}) => {
  return (
    <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-4 min-w-[200px]">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 ${config.iconBg} rounded-lg flex items-center justify-center`}
        >
          <i className={`${config.icon} ${config.iconColor}`} />
        </div>
        <div>
          <p className="text-2xl font-bold text-white">{value ?? 0}</p>
          <p className="text-xs text-gray-400">{config.label}</p>
        </div>
      </div>
    </div>
  );
};
