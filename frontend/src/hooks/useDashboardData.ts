import { useState, useEffect } from "react";
import type { DashboardData } from "@/types/dashboard.types";
import { 
  SitesService, 
  AgentsService, 
  IncidentsService,
  ThreatsService,
  SecurityMetricsService 
} from "@/lib/services";

interface UseDashboardDataReturn {
  data: DashboardData | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useDashboardData = (): UseDashboardDataReturn => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch data from real APIs in parallel
      const [sitesData, agentsStats, incidentsStats, threatsStats, metricsData] = await Promise.all([
        SitesService.getAllSites().catch(() => ({ sites: [], totalSites: 0, activeSites: 0, inactiveSites: 0, warningSites: 0 })),
        AgentsService.getAgentStats().catch(() => ({ totalAgents: 0, onlineAgents: 0, offlineAgents: 0, updatingAgents: 0, byOS: { linux: 0, windows: 0, docker: 0, macos: 0 } })),
        IncidentsService.getIncidentStats().catch(() => ({ total: 0, open: 0, investigating: 0, resolved: 0, closed: 0, critical: 0, high: 0, medium: 0, low: 0 })),
        ThreatsService.getThreatStats().catch(() => ({ total: 0, critical: 0, high: 0, medium: 0, low: 0, blocked: 0, active: 0 })),
        SecurityMetricsService.getStatistics().catch(() => ({ total: 0, active: 0, byType: {}, trends: { improving: 0, degrading: 0, stable: 0 } }))
      ]);

      // Transform to DashboardData format
      const dashboardData: DashboardData = {
        stats: {
          totalSites: sitesData.totalSites,
          activeSites: sitesData.activeSites,
          totalAgents: agentsStats.totalAgents,
          onlineAgents: agentsStats.onlineAgents,
          totalIncidents: incidentsStats.total,
          criticalIncidents: incidentsStats.critical,
          totalThreats: threatsStats.total,
          blockedThreats: threatsStats.blocked,
        },
        recentIncidents: [], // Will be populated by separate call if needed
      };

      setData(dashboardData);
    } catch (err) {
      console.error("Dashboard data fetch error:", err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Refetch data every 30 seconds
    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  };
};
