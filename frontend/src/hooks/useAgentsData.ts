import { useState, useEffect } from "react";
import type { Agent, AgentsData, AgentStatus } from "@/types/agents.types";

// Mock data service
const fetchAgentsData = async (): Promise<AgentsData> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const agents: Agent[] = [
    {
      id: "1",
      hostname: "web-prod-01",
      ipAddress: "192.168.1.100",
      os: "Ubuntu 22.04",
      osType: "linux",
      osIcon: "fab fa-linux",
      version: "v2.1.5",
      status: "online",
      lastHeartbeat: "2s ago",
      cpuUsage: 15,
      iconGradient: "from-blue-500 to-cyan-500",
      siteName: "Production Web Server",
    },
    {
      id: "2",
      hostname: "db-mysql-01",
      ipAddress: "192.168.1.101",
      os: "RHEL 8.6",
      osType: "linux",
      osIcon: "fab fa-redhat",
      version: "v2.1.5",
      status: "online",
      lastHeartbeat: "5s ago",
      cpuUsage: 32,
      iconGradient: "from-red-500 to-pink-500",
      siteName: "MySQL Database",
    },
    {
      id: "3",
      hostname: "api-gateway-01",
      ipAddress: "192.168.1.102",
      os: "Windows Server 2022",
      osType: "windows",
      osIcon: "fab fa-windows",
      version: "v2.1.3",
      status: "online",
      lastHeartbeat: "1s ago",
      cpuUsage: 8,
      iconGradient: "from-green-500 to-emerald-500",
      siteName: "API Gateway",
    },
    {
      id: "4",
      hostname: "storage-01",
      ipAddress: "192.168.1.103",
      os: "macOS Ventura",
      osType: "macos",
      osIcon: "fab fa-apple",
      version: "v2.1.5",
      status: "online",
      lastHeartbeat: "3s ago",
      cpuUsage: 22,
      iconGradient: "from-purple-500 to-indigo-500",
      siteName: "Cloud Storage",
    },
    {
      id: "5",
      hostname: "mail-01",
      ipAddress: "192.168.1.104",
      os: "Ubuntu 20.04",
      osType: "linux",
      osIcon: "fab fa-linux",
      version: "v2.1.2",
      status: "offline",
      lastHeartbeat: "5m ago",
      iconGradient: "from-gray-500 to-gray-600",
      siteName: "Mail Server",
    },
    {
      id: "6",
      hostname: "backup-01",
      ipAddress: "192.168.1.105",
      os: "Windows Server 2019",
      osType: "windows",
      osIcon: "fab fa-windows",
      version: "Updating...",
      status: "updating",
      lastHeartbeat: "10s ago",
      updateProgress: 65,
      iconGradient: "from-orange-500 to-yellow-500",
      siteName: "Backup Server",
    },
  ];

  const stats = {
    total: agents.length,
    online: agents.filter((a) => a.status === "online").length,
    offline: agents.filter((a) => a.status === "offline").length,
    updating: agents.filter((a) => a.status === "updating").length,
  };

  const metrics = {
    avgResponseTime: "245ms",
    dataTransferred: "2.4 GB",
    threatsBlocked: 156,
    updatesAvailable: 3,
  };

  const osDistribution = [
    { os: "Linux", count: 2, color: "#3b82f6" },
    { os: "Windows", count: 2, color: "#10b981" },
    { os: "macOS", count: 1, color: "#a855f7" },
    { os: "Other", count: 1, color: "#6b7280" },
  ];

  return {
    agents,
    stats,
    metrics,
    osDistribution,
  };
};

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
