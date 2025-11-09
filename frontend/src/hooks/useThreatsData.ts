import { useState, useEffect } from "react";
import type {
  ThreatIndicator,
  ThreatsData,
  ThreatsFilter,
  ThreatDetail,
} from "@/types/threats.types";
import { fetchThreatsData } from "@/data/mock-threat";
import { fetchThreatDetail } from "@/data/mock-threat-detail";

export interface UseThreatsDataReturn {
  data: ThreatsData | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  indicators: ThreatIndicator[];
  filteredIndicators: ThreatIndicator[];
  filter: ThreatsFilter;
  setFilter: (filter: Partial<ThreatsFilter>) => void;
  applyFilters: () => void;
  selectedThreat: ThreatDetail | null;
  selectThreat: (id: string | null) => Promise<void>;
  selectedIndicators: string[];
  toggleIndicatorSelection: (id: string) => void;
  toggleAllIndicators: () => void;
  stats: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    blocked: number;
  };
}

export const useThreatsData = (): UseThreatsDataReturn => {
  const [data, setData] = useState<ThreatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedThreat, setSelectedThreat] = useState<ThreatDetail | null>(null);
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([]);

  const [filter, setFilterState] = useState<ThreatsFilter>({
    severity: "all",
    type: "all",
    country: "",
    ipRange: "",
    timeRange: "24h",
    searchQuery: "",
  });

  const [appliedFilter, setAppliedFilter] = useState<ThreatsFilter>(filter);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const threatsData = await fetchThreatsData();
      setData(threatsData);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch threats data")
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter indicators based on applied filters
  const filteredIndicators =
    data?.indicators.filter((indicator) => {
      // Severity filter
      if (appliedFilter.severity !== "all" && indicator.severity !== appliedFilter.severity) {
        return false;
      }

      // Type filter
      if (appliedFilter.type !== "all" && indicator.type !== appliedFilter.type) {
        return false;
      }

      // Country filter
      if (appliedFilter.country && indicator.countryCode !== appliedFilter.country) {
        return false;
      }

      // Search query filter
      if (appliedFilter.searchQuery) {
        const query = appliedFilter.searchQuery.toLowerCase();
        return (
          indicator.indicator.toLowerCase().includes(query) ||
          indicator.description.toLowerCase().includes(query) ||
          indicator.country?.toLowerCase().includes(query)
        );
      }

      return true;
    }) || [];

  const setFilter = (partialFilter: Partial<ThreatsFilter>) => {
    setFilterState((prev) => ({ ...prev, ...partialFilter }));
  };

  const applyFilters = () => {
    setAppliedFilter(filter);
  };

  const selectThreat = async (id: string | null) => {
    if (!id) {
      setSelectedThreat(null);
      return;
    }

    try {
      const detail = await fetchThreatDetail(id);
      setSelectedThreat(detail);
    } catch (err) {
      console.error("Failed to fetch threat detail:", err);
    }
  };

  const toggleIndicatorSelection = (id: string) => {
    setSelectedIndicators((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAllIndicators = () => {
    if (selectedIndicators.length === filteredIndicators.length) {
      setSelectedIndicators([]);
    } else {
      setSelectedIndicators(filteredIndicators.map((i) => i.id));
    }
  };

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
    indicators: data?.indicators || [],
    filteredIndicators,
    filter,
    setFilter,
    applyFilters,
    selectedThreat,
    selectThreat,
    selectedIndicators,
    toggleIndicatorSelection,
    toggleAllIndicators,
    stats: {
      total: data?.stats.total || 0,
      critical: data?.stats.critical || 0,
      high: data?.stats.high || 0,
      medium: data?.stats.medium || 0,
      low: data?.stats.low || 0,
      blocked: data?.stats.blocked || 0,
    },
  };
};
