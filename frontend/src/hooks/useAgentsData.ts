import { useState, useEffect, useRef } from "react";
import type { Agent, AgentsData, AgentStatus } from "@/types/agents.types";
import { AgentsService } from "@/lib/services";

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
  const hasFetchedRef = useRef(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch data from real APIs in parallel
      const [agents, stats, osDistribution] = await Promise.all([
        AgentsService.getAllAgents().catch(() => []),
        AgentsService.getAgentStats().catch(() => ({
          total: 0,
          online: 0,
          offline: 0,
          updating: 0,
          avgResponseTime: "0ms",
          dataTransferred: "0 GB",
          threatsBlocked: 0,
          updatesAvailable: 0,
        })),
        AgentsService.getOSDistribution().catch(() => []),
      ]);

      // Backend returns: { totalAgents, onlineAgents, ... } or { total, online, ... }
      const statsData = stats as any;

      // Transform to AgentsData format
      const agentsData: AgentsData = {
        agents: agents as Agent[],
        stats: {
          total: statsData.totalAgents || statsData.total || 0,
          online: statsData.onlineAgents || statsData.online || 0,
          offline: statsData.offlineAgents || statsData.offline || 0,
          updating: statsData.updatingAgents || statsData.updating || 0,
        },
        metrics: {
          avgResponseTime: statsData.avgResponseTime || "0ms",
          dataTransferred: statsData.dataTransferred || "0 GB",
          threatsBlocked: statsData.threatsBlocked || 0,
          updatesAvailable: statsData.updatesAvailable || 0,
        },
        osDistribution: osDistribution.map((item: any) => ({
          os: item.os,
          count: item.count,
          color: item.color || "#6b7280",
        })),
      };

      setData(agentsData);
    } catch (err) {
      console.error("Failed to fetch agents:", err);
      setError(
        err instanceof Error ? err : new Error("Failed to fetch agents data")
      );
      // Set empty data on error
      setData({
        agents: [],
        stats: { total: 0, online: 0, offline: 0, updating: 0 },
        metrics: {
          avgResponseTime: "0ms",
          dataTransferred: "0 GB",
          threatsBlocked: 0,
          updatesAvailable: 0,
        },
        osDistribution: [],
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Prevent duplicate calls in React Strict Mode (development)
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

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
