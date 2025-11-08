import { useState, useEffect } from "react";
import type { Agent, AgentsData, AgentStatus } from "@/types/agents.types";
import { fetchAgentsData } from "@/data/mock-agent";

export interface UseAgentsDataReturn {
  data: AgentsData | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  agents: Agent[];
  filteredAgents: Agent[];
  filterByStatus: (status: AgentStatus | "all") => void;
  selectedAgent: Agent | null;
  selectAgent: (agent: Agent | null) => void;
  setSelectedAgent: (agent: Agent | null) => void;
  metrics: {
    total: number;
    online: number;
    offline: number;
    updating: number;
    avgResponseTime: string;
    dataTransferred: string;
    threatsBlocked: number;
    updatesAvailable: number;
  };
  osDistribution: Array<{ os: string; count: number; color: string }>;
}

export const useAgentsData = (): UseAgentsDataReturn => {
  const [data, setData] = useState<AgentsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [statusFilter, setStatusFilter] = useState<AgentStatus | "all">("all");
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const agentsData = await fetchAgentsData();
      setData(agentsData);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch agents data")
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter agents by status
  const filteredAgents =
    data?.agents.filter((agent) => {
      if (statusFilter === "all") return true;
      return agent.status === statusFilter;
    }) || [];

  const filterByStatus = (status: AgentStatus | "all") => {
    setStatusFilter(status);
  };

  const selectAgent = (agent: Agent | null) => {
    setSelectedAgent(agent);
  };

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
    agents: data?.agents || [],
    filteredAgents,
    filterByStatus,
    selectedAgent,
    selectAgent,
    setSelectedAgent,
    metrics: {
      total: data?.stats.total || 0,
      online: data?.stats.online || 0,
      offline: data?.stats.offline || 0,
      updating: data?.stats.updating || 0,
      avgResponseTime: data?.metrics.avgResponseTime || "0ms",
      dataTransferred: data?.metrics.dataTransferred || "0 GB",
      threatsBlocked: data?.metrics.threatsBlocked || 0,
      updatesAvailable: data?.metrics.updatesAvailable || 0,
    },
    osDistribution: data?.osDistribution || [],
  };
};
