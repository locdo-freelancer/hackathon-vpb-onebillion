import { useState, useEffect } from "react";
import type {
  ThreatIndicator,
  ThreatsData,
  ThreatsFilter,
  ThreatDetail,
} from "@/types/threats.types";

// Mock data service
const fetchThreatsData = async (): Promise<ThreatsData> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const indicators: ThreatIndicator[] = [
    {
      id: "1",
      indicator: "185.220.102.8",
      description: "Known malware C&C",
      type: "ip",
      severity: "critical",
      confidence: 95,
      country: "Russia",
      countryCode: "RU",
      countryFlag: "🇷🇺",
      firstSeen: "2 hours ago",
      lastSeen: "1 minute ago",
      status: "active",
      icon: "fas fa-exclamation-triangle",
      iconColor: "text-red-400",
    },
    {
      id: "2",
      indicator: "malware-download.com",
      description: "Suspicious domain",
      type: "domain",
      severity: "high",
      confidence: 78,
      country: "China",
      countryCode: "CN",
      countryFlag: "🇨🇳",
      firstSeen: "5 hours ago",
      lastSeen: "30 minutes ago",
      status: "monitoring",
      icon: "fas fa-globe",
      iconColor: "text-yellow-400",
    },
    {
      id: "3",
      indicator: "a1b2c3d4e5f6789012345678901234567890123456789012345678901234",
      description: "Trojan.Win32.Agent",
      type: "hash",
      severity: "medium",
      confidence: 65,
      country: "Iran",
      countryCode: "IR",
      countryFlag: "🇮🇷",
      firstSeen: "1 day ago",
      lastSeen: "12 hours ago",
      status: "flagged",
      icon: "fas fa-file-code",
      iconColor: "text-purple-400",
    },
    {
      id: "4",
      indicator: "http://phishing-site.net/login",
      description: "Phishing attempt",
      type: "url",
      severity: "high",
      confidence: 82,
      country: "United States",
      countryCode: "US",
      countryFlag: "🇺🇸",
      firstSeen: "3 days ago",
      lastSeen: "2 days ago",
      status: "blocked",
      icon: "fas fa-link",
      iconColor: "text-cyan-400",
    },
    {
      id: "5",
      indicator: "203.45.67.89",
      description: "Botnet member",
      type: "ip",
      severity: "low",
      confidence: 45,
      country: "North Korea",
      countryCode: "KP",
      countryFlag: "🇰🇵",
      firstSeen: "1 week ago",
      lastSeen: "5 days ago",
      status: "monitoring",
      icon: "fas fa-server",
      iconColor: "text-blue-400",
    },
    {
      id: "6",
      indicator: "192.168.100.50",
      description: "Port scanning activity",
      type: "ip",
      severity: "medium",
      confidence: 70,
      country: "Brazil",
      countryCode: "BR",
      countryFlag: "🇧🇷",
      firstSeen: "6 hours ago",
      lastSeen: "2 hours ago",
      status: "active",
      icon: "fas fa-exclamation-triangle",
      iconColor: "text-yellow-400",
    },
    {
      id: "7",
      indicator: "evil-ransomware.org",
      description: "Ransomware payload delivery",
      type: "domain",
      severity: "critical",
      confidence: 92,
      country: "Ukraine",
      countryCode: "UA",
      countryFlag: "🇺🇦",
      firstSeen: "4 hours ago",
      lastSeen: "30 seconds ago",
      status: "active",
      icon: "fas fa-globe",
      iconColor: "text-red-400",
    },
    {
      id: "8",
      indicator: "https://fake-bank.com/secure/login.php",
      description: "Banking trojan phishing",
      type: "url",
      severity: "critical",
      confidence: 88,
      country: "Nigeria",
      countryCode: "NG",
      countryFlag: "🇳🇬",
      firstSeen: "8 hours ago",
      lastSeen: "1 hour ago",
      status: "blocked",
      icon: "fas fa-link",
      iconColor: "text-red-400",
    },
  ];

  const stats = {
    total: indicators.length,
    critical: indicators.filter((i) => i.severity === "critical").length,
    high: indicators.filter((i) => i.severity === "high").length,
    medium: indicators.filter((i) => i.severity === "medium").length,
    low: indicators.filter((i) => i.severity === "low").length,
    blocked: indicators.filter((i) => i.status === "blocked").length,
  };

  return {
    indicators,
    stats,
  };
};

// Mock threat detail fetcher
const fetchThreatDetail = async (id: string): Promise<ThreatDetail> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Find the indicator
  const data = await fetchThreatsData();
  const indicator = data.indicators.find((i) => i.id === id);

  if (!indicator) {
    throw new Error("Threat not found");
  }

  return {
    ...indicator,
    enrichment: {
      isp: "Unknown Hosting Provider",
      asn: "AS12345",
      organization: "Malicious Infrastructure Inc.",
      tags: ["malware", "c2", "botnet"],
      malwareFamily: "Emotet",
    },
    intelligence: [
      {
        category: "Malware Distribution",
        description: "Active C&C server for banking trojan",
        icon: "fas fa-shield-virus",
        iconColor: "text-red-400",
      },
      {
        category: "Botnet Activity",
        description: "Part of Emotet botnet infrastructure",
        icon: "fas fa-network-wired",
        iconColor: "text-orange-400",
      },
      {
        category: "Data Exfiltration",
        description: "Used for stealing credentials",
        icon: "fas fa-database",
        iconColor: "text-yellow-400",
      },
    ],
    relatedIndicators: [
      { id: "rel-1", indicator: "185.220.102.9", type: "ip" },
      { id: "rel-2", indicator: "malware-c2.net", type: "domain" },
      { id: "rel-3", indicator: "a1b2c3d4...", type: "hash" },
    ],
  };
};

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
          indicator.country.toLowerCase().includes(query)
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
