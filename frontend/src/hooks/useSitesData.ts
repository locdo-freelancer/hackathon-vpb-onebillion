import { useState, useEffect } from "react";
import type { Site, SitesData, SitesFilter } from "@/types/sites.types";
import { fetchSitesData } from "@/data/mock-site";

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
