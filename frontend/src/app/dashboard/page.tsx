"use client";

import React from "react";
import { useDashboardData } from "@/hooks/useDashboardData";
import {
  DashboardSidebar,
  DashboardHeader,
  DashboardMainContent,
  DashboardBackground,
} from "@/components/dashboard";
import { LoadingState, ErrorState } from "@/components/shared";
import { getNavItems, getDefaultUser } from "@/config/navigation.config";

/**
 * Dashboard Page Component
 * 
 * SOLID Principles Applied:
 * - Single Responsibility: Only handles page state management and composition
 * - Open/Closed: New sections added via DashboardMainContent, not page modification
 * - Liskov Substitution: State components (Loading, Error) are interchangeable
 * - Dependency Inversion: Depends on abstract component interfaces
 * 
 * Reduced from 120 lines to ~60 lines by extracting state and layout components
 */
export default function DashboardPage() {
  const { data, isLoading, error } = useDashboardData();

  // Loading State (ISP - atomic component)
  if (isLoading) {
    return <LoadingState />;
  }

  // Error State (ISP - atomic component with minimal props)
  if (error) {
    return (
      <ErrorState
        message={error.message}
        onRetry={() => window.location.reload()}
      />
    );
  }

  // No data check
  if (!data) {
    return null;
  }

  const user = getDefaultUser();
  const navItems = getNavItems("/dashboard");

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950">
      {/* Background Effects (OCP - extracted to component) */}
      <DashboardBackground />

      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar Navigation (SRP - navigation only) */}
        <DashboardSidebar user={user} navItems={navItems} />

        {/* Main Content Area (SRP - content composition) */}
        <div className="flex-1 flex flex-col">
          {/* Page Header (ISP - minimal props) */}
          <DashboardHeader
            title="Security Dashboard"
            subtitle="Real-time threat monitoring and analysis"
          />

          {/* Dashboard Content (DIP - depends on abstract data interface) */}
          <DashboardMainContent
            riskScore={data.riskScore}
            riskMetrics={data.riskMetrics}
            severityChart={data.severityChart}
            trendsChart={data.trendsChart}
            threats={data.threats}
            incidentStats={data.incidentStats}
            resolutionStats={data.resolutionStats}
          />
        </div>
      </div>
    </div>
  );
}
