import React from "react";
import type { StatCardConfig } from "@/config/agent-stats.config";

interface AgentStatCardProps {
  config: StatCardConfig;
  value: number;
}

/**
 * Agent Stat Card Component
 * Single Responsibility: Only renders a single stat card
 * Interface Segregation: Minimal props - config and value
 */
export const AgentStatCard: React.FC<AgentStatCardProps> = ({
  config,
  value,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">{config.label}</p>
          <p className={`text-2xl font-bold ${config.valueColor} mt-1`}>
            {value}
          </p>
        </div>
        <div
          className={`w-12 h-12 ${config.bgColor} rounded-lg flex items-center justify-center`}
        >
          <i className={`${config.icon} ${config.iconColor} text-xl`} />
        </div>
      </div>
    </div>
  );
};
