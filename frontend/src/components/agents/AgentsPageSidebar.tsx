import React from "react";
import { AgentMetricsCard, OSDistributionChart } from "@/components/agents";
import type { AgentMetrics, OSDistribution } from "@/types/agents.types";

interface AgentsPageSidebarProps {
  metrics: Pick<AgentMetrics, "avgResponseTime" | "dataTransferred" | "threatsBlocked" | "updatesAvailable">;
  osDistribution: OSDistribution[];
}

/**
 * Agents Page Sidebar Component
 * Single Responsibility: Only renders sidebar content (right column)
 * Interface Segregation: Minimal props - only metrics and distribution data
 */
export const AgentsPageSidebar: React.FC<AgentsPageSidebarProps> = ({
  metrics,
  osDistribution,
}) => {
  return (
    <div className="space-y-6">
      {/* Metrics Card */}
      <AgentMetricsCard metrics={metrics} />

      {/* OS Distribution Chart */}
      <OSDistributionChart data={osDistribution} />
    </div>
  );
};
