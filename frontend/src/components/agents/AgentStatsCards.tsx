import React from "react";
import type { AgentStats } from "@/types/agents.types";

interface AgentStatsCardsProps {
  stats: AgentStats;
}

export const AgentStatsCards: React.FC<AgentStatsCardsProps> = ({ stats }) => {
  const statCards = [
    {
      label: "Total Agents",
      value: stats.total,
      icon: "fas fa-desktop",
      bgColor: "bg-cyan-500/20",
      iconColor: "text-cyan-400",
      valueColor: "text-white",
    },
    {
      label: "Online",
      value: stats.online,
      icon: "fas fa-circle",
      bgColor: "bg-green-500/20",
      iconColor: "text-green-400",
      valueColor: "text-green-400",
    },
    {
      label: "Offline",
      value: stats.offline,
      icon: "fas fa-circle",
      bgColor: "bg-red-500/20",
      iconColor: "text-red-400",
      valueColor: "text-red-400",
    },
    {
      label: "Updating",
      value: stats.updating,
      icon: "fas fa-sync-alt",
      bgColor: "bg-yellow-500/20",
      iconColor: "text-yellow-400",
      valueColor: "text-yellow-400",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className="bg-slate-900 border border-slate-800 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.valueColor} mt-1`}>
                {stat.value}
              </p>
            </div>
            <div
              className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}
            >
              <i className={`${stat.icon} ${stat.iconColor} text-xl`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
