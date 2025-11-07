// Dashboard Types - Single Responsibility Principle
// All type definitions in one place for consistency

export interface User {
  name: string;
  role: string;
  avatar: string;
}

export interface NavItem {
  icon: string;
  label: string;
  href: string;
  badge?: number;
  active?: boolean;
}

export interface RiskScore {
  score: number;
  maxScore: number;
  level: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  trend: {
    value: number;
    direction: "up" | "down";
  };
  lastUpdated: string;
}

export interface RiskMetrics {
  critical: number;
  warnings: number;
  informational: number;
}

export interface Threat {
  id: string;
  type: string;
  title: string;
  description: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  target: string;
  icon: string;
  timestamp: string;
}

export interface IncidentStats {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  trend: {
    value: number;
    direction: "up" | "down";
  };
}

export interface ResolutionStats {
  resolved: { count: number; percentage: number };
  inProgress: { count: number; percentage: number };
  open: { count: number; percentage: number };
  meanTimeToResolve: string;
}

export interface ChartData {
  labels: string[];
  values: number[];
  colors?: string[];
}

export interface TimeSeriesData {
  name: string;
  data: { x: string; y: number }[];
  color: string;
}

export interface DashboardData {
  riskScore: RiskScore;
  riskMetrics: RiskMetrics;
  threats: Threat[];
  incidentStats: IncidentStats;
  resolutionStats: ResolutionStats;
  severityChart: ChartData;
  trendsChart: TimeSeriesData[];
}
