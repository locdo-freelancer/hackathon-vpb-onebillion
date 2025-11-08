import { Site, SitesData } from "@/types/sites.types";

// Mock data service - in production this would call API
export const fetchSitesData = async (): Promise<SitesData> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const sites: Site[] = [
    {
      id: "1",
      name: "Production Web Server",
      hostname: "web-prod-01",
      ipAddress: "192.168.1.100",
      domains: ["example.com", "www.example.com"],
      agentCount: 3,
      status: "active",
      icon: "fas fa-globe",
      iconGradient: "from-cyan-500 to-cyan-600",
      lastChecked: "2 minutes ago",
    },
    {
      id: "2",
      name: "MySQL Database",
      hostname: "db-mysql-01",
      ipAddress: "192.168.1.101",
      domains: ["db.internal"],
      agentCount: 2,
      status: "active",
      icon: "fas fa-database",
      iconGradient: "from-purple-500 to-pink-500",
      lastChecked: "5 minutes ago",
    },
    {
      id: "3",
      name: "API Gateway",
      hostname: "api-gateway-01",
      ipAddress: "192.168.1.102",
      domains: ["api.example.com"],
      agentCount: 5,
      status: "warning",
      icon: "fas fa-code",
      iconGradient: "from-yellow-500 to-orange-500",
      lastChecked: "1 minute ago",
    },
    {
      id: "4",
      name: "Cloud Storage",
      hostname: "storage-01",
      ipAddress: "192.168.1.103",
      domains: ["storage.example.com", "cdn.example.com"],
      agentCount: 1,
      status: "active",
      icon: "fas fa-cloud",
      iconGradient: "from-blue-500 to-indigo-500",
      lastChecked: "10 minutes ago",
    },
    {
      id: "5",
      name: "Mail Server",
      hostname: "mail-01",
      ipAddress: "192.168.1.104",
      domains: ["mail.example.com"],
      agentCount: 0,
      status: "inactive",
      icon: "fas fa-server",
      iconGradient: "from-red-500 to-pink-500",
      lastChecked: "1 hour ago",
    },
  ];

  return {
    sites,
    totalSites: sites.length,
    activeSites: sites.filter((s) => s.status === "active").length,
    inactiveSites: sites.filter((s) => s.status === "inactive").length,
    warningSites: sites.filter((s) => s.status === "warning").length,
  };
};