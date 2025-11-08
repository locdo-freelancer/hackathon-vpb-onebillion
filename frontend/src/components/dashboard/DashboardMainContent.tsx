import React from "react";
import {
  RiskScoreCard,
  SeverityChart,
  TrendsChart,
  ActiveThreatsCard,
  IncidentSummaryCard,
} from "@/components/dashboard";
import type {
  RiskScore,
  RiskMetrics,
  ChartData,
  TimeSeriesData,
  Threat,
  IncidentStats,
  ResolutionStats,
} from "@/types/dashboard.types";

interface DashboardMainContentProps {
  riskScore: RiskScore;
  riskMetrics: RiskMetrics;
  severityChart: ChartData;
  trendsChart: TimeSeriesData[];
  threats: Threat[];
  incidentStats: IncidentStats;
  resolutionStats: ResolutionStats;
}

/**
 * Dashboard Main Content Component
 * 
 * SOLID Principles Applied:
 * - Single Responsibility: Only manages main content layout and composition
 * - Open/Closed: New sections added via new components, not modification
 * - Liskov Substitution: Each card component is interchangeable
 * - Dependency Inversion: Depends on abstract component interfaces
 */
export const DashboardMainContent: React.FC<DashboardMainContentProps> = ({
  riskScore,
  riskMetrics,
  severityChart,
  trendsChart,
  threats,
  incidentStats,
  resolutionStats,
}) => {
  return (
    <main className="flex-1 p-8 overflow-auto">
      {/* Risk Score Section (SRP - Risk overview) */}
      <div className="mb-8">
        <RiskScoreCard riskScore={riskScore} metrics={riskMetrics} />
      </div>

      {/* Charts Grid (SRP - Data visualization) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <SeverityChart data={severityChart} />
        <TrendsChart data={trendsChart} />
      </div>

      {/* Threats & Incidents Grid (SRP - Action items) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ActiveThreatsCard threats={threats} />
        <IncidentSummaryCard
          stats={incidentStats}
          resolution={resolutionStats}
        />
      </div>
    </main>
  );
};
