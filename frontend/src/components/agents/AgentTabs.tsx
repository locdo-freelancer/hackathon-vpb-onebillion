import React from "react";
import type { AgentStatus } from "@/types/agents.types";
import { getTabsConfig, type TabId } from "@/config/agent-tabs.config";
import { TabButton } from "@/components/shared";

interface AgentTabsProps {
  onlineCount: number;
  offlineCount: number;
  updatingCount: number;
  activeTab: AgentStatus | "all";
  onTabChange: (tab: AgentStatus | "all") => void;
}

/**
 * Agent Tabs Component
 * 
 * SOLID Principles Applied:
 * - Single Responsibility: Only manages tab rendering and interaction
 * - Open/Closed: New tabs added via config without modifying this component
 * - Dependency Inversion: Depends on abstract TabConfig, not concrete data
 * - Liskov Substitution: Can be replaced with any tabs component using same interface
 */
export const AgentTabs: React.FC<AgentTabsProps> = ({
  onlineCount,
  offlineCount,
  updatingCount,
  activeTab,
  onTabChange,
}) => {
  // Get tabs configuration (OCP - configuration-driven)
  const tabsConfig = getTabsConfig();

  // Map count to tab ID
  const countMap: Record<TabId, number> = {
    all: onlineCount + offlineCount + updatingCount,
    online: onlineCount,
    offline: offlineCount,
    updating: updatingCount,
  };

  return (
    <div className="flex items-center gap-1 bg-slate-900/50 p-1 rounded-lg border border-slate-800 w-fit">
      {tabsConfig.map((tab) => (
        <TabButton
          key={tab.id}
          label={`${tab.label} (${countMap[tab.id]})`}
          isActive={activeTab === tab.id}
          onClick={() => onTabChange(tab.id as AgentStatus | "all")}
        />
      ))}
    </div>
  );
};
