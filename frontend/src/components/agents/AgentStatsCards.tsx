import React from "react";
import { AgentStatCard } from "./AgentStatCard";
import { getStatCardsConfig } from "@/config/agent-stats.config";
import type { AgentStats } from "@/types/agents.types";

interface AgentStatsCardsProps {
  stats: AgentStats;
}

/**
 * Agent Stats Cards Component - SOLID Principles Applied
 * 
 * Single Responsibility: Only handles stats cards grid layout
 * Open/Closed: New stat types can be added via config without modifying this
 * Dependency Inversion: Depends on abstract config, not concrete implementation
 * Interface Segregation: Minimal props needed
 */
export const AgentStatsCards: React.FC<AgentStatsCardsProps> = ({ stats }) => {
  // Dependency Injection: Stat cards configuration injected via function
  const statCards = getStatCardsConfig();

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
