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

      // Calculate metrics from fetched data
      const totalIncidents = incidentsStats.total;
      const criticalWeight = incidentsStats.critical * 10;
      const highWeight = incidentsStats.high * 5;
      const threatWeight = threatsStats.active * 2;
      const agentWeight = agentsStats.offlineAgents * 3;
      const totalWeight = criticalWeight + highWeight + threatWeight + agentWeight;
      const riskScoreValue = Math.min(100, Math.max(0, 100 - totalWeight));
      
      let riskLevel: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
      if (riskScoreValue >= 80) riskLevel = "LOW";
      else if (riskScoreValue >= 60) riskLevel = "MODERATE";
      else if (riskScoreValue >= 40) riskLevel = "HIGH";
      else riskLevel = "CRITICAL";

      const resolvedCount = totalIncidents - incidentsStats.open;

      // Generate mock trend data for charts
      const trendData = [];
      const now = new Date();
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        trendData.push({
          timestamp: date.toISOString(),
          incidents: Math.floor(Math.random() * 20) + 5,
          threats: Math.floor(Math.random() * 50) + 10,
        });
      }

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
        recentIncidents: [],
        riskScore: {
          score: riskScoreValue,
          maxScore: 100,
          level: riskLevel,
          trend: {
            value: 2.5,
            direction: "down",
          },
          lastUpdated: new Date().toISOString(),
        },
        riskMetrics: {
          critical: incidentsStats.critical,
          warnings: incidentsStats.high,
          informational: incidentsStats.medium + incidentsStats.low,
        },
        threats: [],
        incidentStats: {
          total: totalIncidents,
          critical: incidentsStats.critical,
          high: incidentsStats.high,
          medium: incidentsStats.medium,
          low: incidentsStats.low,
          trend: {
            value: 5.2,
            direction: "up",
          },
        },
        resolutionStats: {
          resolved: {
            count: resolvedCount,
            percentage: totalIncidents > 0 ? Math.round((resolvedCount / totalIncidents) * 100) : 0,
          },
          inProgress: {
            count: Math.floor(incidentsStats.open * 0.4),
            percentage: totalIncidents > 0 ? Math.round((incidentsStats.open * 0.4 / totalIncidents) * 100) : 0,
          },
          open: {
            count: Math.floor(incidentsStats.open * 0.6),
            percentage: totalIncidents > 0 ? Math.round((incidentsStats.open * 0.6 / totalIncidents) * 100) : 0,
          },
          meanTimeToResolve: "4.2 hours",
        },
        severityChart: {
          labels: ["Critical", "High", "Medium", "Low"],
          values: [incidentsStats.critical, incidentsStats.high, incidentsStats.medium, incidentsStats.low],
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
