import React from "react";
import type { AgentMetrics } from "@/types/agents.types";

interface AgentMetricsCardProps {
  metrics: AgentMetrics;
}

export const AgentMetricsCard: React.FC<AgentMetricsCardProps> = ({
  metrics,
}) => {
  const metricsData = [
    {
      label: "Avg Response Time",
      value: metrics.avgResponseTime,
      color: "text-white",
    },
    {
      label: "Data Transferred",
      value: metrics.dataTransferred,
      color: "text-white",
    },
    {
      label: "Threats Blocked",
      value: metrics.threatsBlocked.toString(),
      color: "text-green-400",
    },
    {
      label: "Updates Available",
      value: metrics.updatesAvailable.toString(),
      color: "text-yellow-400",
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Agent Metrics</h3>

      <div className="space-y-4">
        {metricsData.map((metric, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-sm text-gray-400">{metric.label}</span>
            <span className={`text-sm ${metric.color} font-medium`}>
              {metric.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
