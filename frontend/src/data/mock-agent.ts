import { Agent, AgentsData } from "@/types/agents.types";

// Mock data service
export const fetchAgentsData = async (): Promise<AgentsData> => {
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
      siteId: "site-1",
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
      siteId: "site-2",
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
      siteId: "site-3",
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
      siteId: "site-4",
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
      siteId: "site-5",
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
      siteId: "site-6",
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