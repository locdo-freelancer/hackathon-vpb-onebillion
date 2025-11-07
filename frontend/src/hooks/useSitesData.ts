import { useState, useEffect } from "react";
import type { Site, SitesData, SitesFilter } from "@/types/sites.types";

// Mock data service - in production this would call API
const fetchSitesData = async (): Promise<SitesData> => {
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

export interface UseSitesDataReturn {
  data: SitesData | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  filteredSites: Site[];
  applyFilter: (filter: SitesFilter) => void;
  selectedSites: string[];
  toggleSiteSelection: (siteId: string) => void;
  toggleAllSites: () => void;
  clearSelection: () => void;
}

export const useSitesData = (): UseSitesDataReturn => {
  const [data, setData] = useState<SitesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filter, setFilter] = useState<SitesFilter>({
    status: "all",
    agentCount: "any",
    searchQuery: "",
  });
  const [selectedSites, setSelectedSites] = useState<string[]>([]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const sitesData = await fetchSitesData();
      setData(sitesData);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch sites data")
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter sites based on current filter
  const filteredSites = data?.sites.filter((site) => {
    // Status filter
    if (filter.status !== "all" && site.status !== filter.status) {
      return false;
    }

    // Agent count filter
    if (filter.agentCount !== "any") {
      if (filter.agentCount === "0" && site.agentCount !== 0) return false;
      if (filter.agentCount === "1-5" && (site.agentCount < 1 || site.agentCount > 5))
        return false;
      if (filter.agentCount === "5+" && site.agentCount <= 5) return false;
    }

    // Search query filter
    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      return (
        site.name.toLowerCase().includes(query) ||
        site.hostname.toLowerCase().includes(query) ||
        site.ipAddress.includes(query) ||
        site.domains.some((d) => d.toLowerCase().includes(query))
      );
    }

    return true;
  }) || [];

  const applyFilter = (newFilter: SitesFilter) => {
    setFilter(newFilter);
  };

  const toggleSiteSelection = (siteId: string) => {
    setSelectedSites((prev) =>
      prev.includes(siteId)
        ? prev.filter((id) => id !== siteId)
        : [...prev, siteId]
    );
  };

  const toggleAllSites = () => {
    if (selectedSites.length === filteredSites.length) {
      setSelectedSites([]);
    } else {
      setSelectedSites(filteredSites.map((s) => s.id));
    }
  };

  const clearSelection = () => {
    setSelectedSites([]);
  };

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
    filteredSites,
    applyFilter,
    selectedSites,
    toggleSiteSelection,
    toggleAllSites,
    clearSelection,
  };
};
