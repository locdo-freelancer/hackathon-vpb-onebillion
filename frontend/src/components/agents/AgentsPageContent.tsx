import React from "react";
import {
  AgentStatsCards,
  AgentTabs,
  AgentGrid,
} from "@/components/agents";
import type { Agent, AgentStatus, AgentStats } from "@/types/agents.types";

interface AgentsPageContentProps {
  stats: AgentStats;
  activeTab: AgentStatus | "all";
  onTabChange: (tab: AgentStatus | "all") => void;
  filteredAgents: Agent[];
  onAgentClick: (agent: Agent) => void;
}

/**
 * Agents Page Content Component
 * Single Responsibility: Only renders main content layout (left column)
 * Open/Closed: Can extend with new sections without modifying
 */
export const AgentsPageContent: React.FC<AgentsPageContentProps> = ({
  stats,
  activeTab,
  onTabChange,
  filteredAgents,
  onAgentClick,
}) => {
  return (
    <>
      {/* Stats Cards Section */}
      <div className="mb-8">
        <AgentStatsCards stats={stats} />
      </div>

      {/* Tabs Section */}
      <div className="mb-6">
        <AgentTabs
          activeTab={activeTab}
          onTabChange={onTabChange}
          onlineCount={stats.online}
          offlineCount={stats.offline}
          updatingCount={stats.updating}
        />
      </div>

      {/* Agent Grid Section */}
      <AgentGrid agents={filteredAgents} onAgentClick={onAgentClick} />
    </>
  );
};
