import React from "react";
import type { AgentStatus } from "@/types/agents.types";

interface AgentTabsProps {
  onlineCount: number;
  offlineCount: number;
  updatingCount: number;
  activeTab: AgentStatus | "all";
  onTabChange: (tab: AgentStatus | "all") => void;
}

export const AgentTabs: React.FC<AgentTabsProps> = ({
  onlineCount,
  offlineCount,
  updatingCount,
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    { id: "online" as const, label: `Online (${onlineCount})` },
    { id: "offline" as const, label: `Offline (${offlineCount})` },
    { id: "updating" as const, label: `Updating (${updatingCount})` },
  ];

  return (
    <div className="flex items-center gap-1 bg-slate-900/50 p-1 rounded-lg border border-slate-800 w-fit">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === tab.id
              ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
              : "text-gray-400 hover:text-white"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
