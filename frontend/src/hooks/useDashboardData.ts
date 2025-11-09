import { useState, useEffect, useRef } from "react";
import type { DashboardData } from "@/types/dashboard.types";
import {
  SitesService,
  AgentsService,
  IncidentsService,
  ThreatsService,
  SecurityMetricsService,
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
  const hasFetchedRef = useRef(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch data from real APIs in parallel
      const [
        sitesData,
        agentsStats,
        incidentsStats,
        threatsStats,
        metricsData,
      ] = await Promise.all([
        SitesService.getAllSites().catch(() => ({
          sites: [],
          totalSites: 0,
          activeSites: 0,
          inactiveSites: 0,
          warningSites: 0,
        })),
        AgentsService.getAgentStats().catch(() => ({
          totalAgents: 0,
          onlineAgents: 0,
          offlineAgents: 0,
          updatingAgents: 0,
          byOS: { linux: 0, windows: 0, docker: 0, macos: 0 },
        })),
        IncidentsService.getIncidentStats().catch(() => ({
          total: 0,
          open: 0,
          investigating: 0,
          resolved: 0,
          closed: 0,
          critical: 0,
          high: 0,
          medium: 0,
          low: 0,
        })),
        ThreatsService.getThreatStats().catch(() => ({
          total: 0,
          critical: 0,
          high: 0,
          medium: 0,
          low: 0,
          blocked: 0,
          active: 0,
        })),
        SecurityMetricsService.getStatistics().catch(() => ({
          total: 0,
          active: 0,
          byType: {},
          trends: { improving: 0, degrading: 0, stable: 0 },
        })),
      ]);

      // Transform to DashboardData format
      const dashboardData: DashboardData = {
        stats: {
          totalSites: overview.stats.totalSites,
          activeSites: overview.stats.activeSites,
          totalAgents: overview.stats.totalAgents,
          onlineAgents: overview.stats.onlineAgents,
          totalIncidents: overview.stats.totalIncidents,
          criticalIncidents: overview.stats.criticalIncidents,
          totalThreats: overview.stats.totalThreats,
          blockedThreats: overview.stats.blockedThreats,
        },
        recentIncidents: recentIncidentsData.incidents,
        riskScore,
        riskMetrics: {
          critical: overview.stats.criticalIncidents,
          warnings: overview.stats.highIncidents,
          informational: overview.stats.mediumIncidents + overview.stats.lowIncidents,
        },
        threats: recentThreatsData.indicators.slice(0, 5).map((threat: any) => ({
          id: threat.id,
          type: threat.type,
          title: threat.indicator,
          description: threat.description || "No description",
          severity: threat.severity.toUpperCase() as "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
          target: threat.sources?.[0] || "Unknown",
          icon: "shield-alert",
          timestamp: new Date(threat.firstSeen).toLocaleString(),
        })),
        incidentStats,
        resolutionStats,
        severityChart: {
          labels: ["Critical", "High", "Medium", "Low"],
          values: [severityDist.critical, severityDist.high, severityDist.medium, severityDist.low],
          colors: ["#ef4444", "#f97316", "#eab308", "#22c55e"],
        },
        trendsChart: [
          {
            name: "Incidents",
            data: trendData.map((d: any) => ({ x: new Date(d.timestamp).toLocaleDateString(), y: d.incidents })),
            color: "#8b5cf6",
          },
          {
            name: "Threats",
            data: trendData.map((d: any) => ({ x: new Date(d.timestamp).toLocaleDateString(), y: d.threats })),
            color: "#ef4444",
          },
        ],
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
    // Prevent duplicate calls in React Strict Mode (development)
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

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
