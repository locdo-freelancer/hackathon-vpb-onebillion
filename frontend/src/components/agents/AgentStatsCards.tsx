import React from "react";
import { AgentStatCard } from "./AgentStatCard";
import { useStatCardsConfig } from "@/config/agent-stats.config";
import type { AgentStats } from "@/types/agents.types";

interface AgentStatsCardsProps {
  stats: AgentStats;
}

export const AgentStatsCards: React.FC<AgentStatsCardsProps> = ({ stats }) => {
  // Dependency Injection: Stat cards configuration injected via function
  const statCards = useStatCardsConfig();

  return (
    <div className="grid grid-cols-4 gap-6">
      {statCards.map((config) => (
        // Liskov Substitution: AgentStatCard can be replaced with compatible implementation
        <AgentStatCard
          key={config.key}
          config={config}
          value={stats[config.key]}
        />
      ))}
    </div>
  );
};
