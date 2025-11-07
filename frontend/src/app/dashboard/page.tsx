"use client";

import React from "react";
import { useDashboardData } from "@/hooks/useDashboardData";
import {
  DashboardSidebar,
  DashboardHeader,
  RiskScoreCard,
  SeverityChart,
  TrendsChart,
  ActiveThreatsCard,
  IncidentSummaryCard,
} from "@/components/dashboard";

export default function DashboardPage() {
  const { data, isLoading, error } = useDashboardData();

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-cyan-500 to-purple-500 rounded-full mb-4 animate-pulse">
            <i className="fas fa-shield-halved text-2xl text-white" />
          </div>
          <p className="text-white font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mb-4">
            <i className="fas fa-exclamation-triangle text-2xl text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            Failed to Load Dashboard
          </h2>
          <p className="text-gray-400 mb-4">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No data check
  if (!data) {
    return null;
  }

  // User data for sidebar
  const user = {
    name: "John Smith",
    role: "Admin",
    avatar:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg",
  };

  // Navigation items for sidebar
  const navItems = [
    { icon: "fas fa-gauge-high", label: "Dashboard", href: "/dashboard", active: true },
    { icon: "fas fa-shield-virus", label: "Threats", href: "/threats" },
    { icon: "fas fa-server", label: "Sites", href: "/sites" },
    { icon: "fas fa-desktop", label: "Agents", href: "/agents" },
    { icon: "fas fa-exclamation-triangle", label: "Incidents", href: "/incidents" },
    { icon: "fas fa-bell", label: "Alerts", href: "#", badge: 8 },
    { icon: "fas fa-chart-line", label: "Reports", href: "#" },
    { icon: "fas fa-cog", label: "Settings", href: "#" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-linear-to-br from-cyan-500/5 via-transparent to-purple-500/5" />
      <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar */}
        <DashboardSidebar user={user} navItems={navItems} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <DashboardHeader 
            title="Security Dashboard" 
            subtitle="Real-time threat monitoring and analysis"
          />

          {/* Dashboard Content */}
          <main className="flex-1 p-8 overflow-auto">
            {/* Risk Score Section */}
            <div className="mb-8">
              <RiskScoreCard
                riskScore={data.riskScore}
                metrics={data.riskMetrics}
              />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <SeverityChart data={data.severityChart} />
              <TrendsChart data={data.trendsChart} />
            </div>

            {/* Threats & Incidents Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ActiveThreatsCard threats={data.threats} />
              <IncidentSummaryCard
                stats={data.incidentStats}
                resolution={data.resolutionStats}
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
