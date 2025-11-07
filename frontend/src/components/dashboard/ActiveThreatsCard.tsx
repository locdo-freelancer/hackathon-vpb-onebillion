import React from "react";
import type { Threat } from "@/types/dashboard.types";

interface ActiveThreatsCardProps {
  threats: Threat[];
  onInvestigate?: (threatId: string) => void;
  onViewAll?: () => void;
}

const SEVERITY_CONFIG = {
  CRITICAL: {
    bgColor: "bg-red-500/20",
    borderColor: "border-red-500/30",
    hoverBorder: "hover:border-red-500/50",
    textColor: "text-red-400",
    iconBg: "bg-red-500/20",
  },
  HIGH: {
    bgColor: "bg-yellow-500/20",
    borderColor: "border-yellow-500/30",
    hoverBorder: "hover:border-yellow-500/50",
    textColor: "text-yellow-400",
    iconBg: "bg-yellow-500/20",
  },
  MEDIUM: {
    bgColor: "bg-blue-500/20",
    borderColor: "border-blue-500/30",
    hoverBorder: "hover:border-blue-500/50",
    textColor: "text-blue-400",
    iconBg: "bg-blue-500/20",
  },
  LOW: {
    bgColor: "bg-green-500/20",
    borderColor: "border-green-500/30",
    hoverBorder: "hover:border-green-500/50",
    textColor: "text-green-400",
    iconBg: "bg-green-500/20",
  },
};

export const ActiveThreatsCard: React.FC<ActiveThreatsCardProps> = ({
  threats,
  onInvestigate,
  onViewAll,
}) => {
  const activeCount = threats.filter(
    (t) => t.severity === "CRITICAL" || t.severity === "HIGH"
  ).length;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Active Threats</h3>
          <p className="text-sm text-gray-400">
            Requires immediate attention
          </p>
        </div>
        <span className="px-3 py-1 bg-red-500/20 text-red-400 text-sm font-medium rounded-full">
          {activeCount} Active
        </span>
      </div>

      {/* Threats List */}
      <div className="space-y-3">
        {threats.map((threat) => {
          const config = SEVERITY_CONFIG[threat.severity];

          return (
            <div
              key={threat.id}
              className={`bg-slate-950/50 border ${config.borderColor} rounded-lg p-4 ${config.hoverBorder} transition-colors cursor-pointer`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 ${config.iconBg} rounded-lg flex items-center justify-center`}
                  >
                    <i className={`${threat.icon} ${config.textColor}`} />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{threat.title}</h4>
                    <p className="text-xs text-gray-400">{threat.target}</p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 ${config.bgColor} ${config.textColor} text-xs font-semibold rounded`}
                >
                  {threat.severity}
                </span>
              </div>

              <p className="text-sm text-gray-300 mb-2">
                {threat.description}
              </p>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{threat.timestamp}</span>
                <button
                  onClick={() => onInvestigate?.(threat.id)}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Investigate →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* View All Button */}
      <button
        onClick={onViewAll}
        className="w-full mt-4 py-2 text-sm text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
      >
        View All Threats →
      </button>
    </div>
  );
};
