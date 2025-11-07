import { useState, useEffect } from "react";
import type { DashboardData } from "@/types/dashboard.types";

// Mock data service - in production this would call API
const fetchDashboardData = async (): Promise<DashboardData> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    riskScore: {
      score: 68,
      maxScore: 100,
      level: "MODERATE",
      trend: { value: 5, direction: "down" },
      lastUpdated: "2 minutes ago",
    },
    riskMetrics: {
      critical: 12,
      warnings: 38,
      informational: 124,
    },
    threats: [
      {
        id: "1",
        type: "malware",
        title: "Malware Detected",
        description: "Trojan.Generic detected in /var/www/uploads",
        severity: "CRITICAL",
        target: "Server: web-prod-01",
        icon: "fas fa-virus",
        timestamp: "2 minutes ago",
      },
      {
        id: "2",
        type: "unauthorized",
        title: "Unauthorized Access",
        description: "Multiple failed login attempts from 185.220.101.x",
        severity: "CRITICAL",
        target: "Database: prod-mysql-01",
        icon: "fas fa-user-secret",
        timestamp: "15 minutes ago",
      },
      {
        id: "3",
        type: "ddos",
        title: "DDoS Attack",
        description: "Unusual traffic spike: 45K req/min",
        severity: "HIGH",
        target: "Target: api.example.com",
        icon: "fas fa-network-wired",
        timestamp: "32 minutes ago",
      },
      {
        id: "4",
        type: "vulnerability",
        title: "Vulnerability Scan",
        description: "CVE-2024-1234 detected in Apache 2.4.51",
        severity: "HIGH",
        target: "Asset: web-app-02",
        icon: "fas fa-shield-virus",
        timestamp: "1 hour ago",
      },
    ],
    incidentStats: {
      total: 247,
      critical: 12,
      high: 38,
      medium: 73,
      low: 124,
      trend: { value: 12, direction: "up" },
    },
    resolutionStats: {
      resolved: { count: 156, percentage: 63 },
      inProgress: { count: 58, percentage: 23 },
      open: { count: 33, percentage: 14 },
      meanTimeToResolve: "2.4 hours",
    },
    severityChart: {
      labels: ["Critical", "High", "Medium", "Low"],
      values: [12, 38, 73, 124],
      colors: ["#ef4444", "#eab308", "#3b82f6", "#22c55e"],
    },
    trendsChart: [
      {
        name: "Critical",
        color: "#ef4444",
        data: [
          { x: "Mon", y: 8 },
          { x: "Tue", y: 12 },
          { x: "Wed", y: 10 },
          { x: "Thu", y: 15 },
          { x: "Fri", y: 11 },
          { x: "Sat", y: 9 },
          { x: "Sun", y: 12 },
        ],
      },
      {
        name: "High",
        color: "#eab308",
        data: [
          { x: "Mon", y: 28 },
          { x: "Tue", y: 35 },
          { x: "Wed", y: 32 },
          { x: "Thu", y: 40 },
          { x: "Fri", y: 38 },
          { x: "Sat", y: 34 },
          { x: "Sun", y: 38 },
        ],
      },
      {
        name: "Medium",
        color: "#3b82f6",
        data: [
          { x: "Mon", y: 52 },
          { x: "Tue", y: 68 },
          { x: "Wed", y: 65 },
          { x: "Thu", y: 78 },
          { x: "Fri", y: 73 },
          { x: "Sat", y: 69 },
          { x: "Sun", y: 73 },
        ],
      },
      {
        name: "Low",
        color: "#22c55e",
        data: [
          { x: "Mon", y: 98 },
          { x: "Tue", y: 115 },
          { x: "Wed", y: 108 },
          { x: "Thu", y: 132 },
          { x: "Fri", y: 124 },
          { x: "Sat", y: 118 },
          { x: "Sun", y: 124 },
        ],
      },
    ],
  };
};

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
      const dashboardData = await fetchDashboardData();
      setData(dashboardData);
    } catch (err) {
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
