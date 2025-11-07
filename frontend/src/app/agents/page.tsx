"use client";

import React, { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import {
  AgentStatsCards,
  AgentTabs,
  AgentGrid,
  AgentMetricsCard,
  OSDistributionChart,
  AgentDetailDrawer,
} from "@/components/agents";
import { useAgentsData } from "@/hooks/useAgentsData";
import type { AgentStatus, Agent } from "@/types/agents.types";

export default function AgentsPage() {
  const { filteredAgents, filterByStatus, selectedAgent, setSelectedAgent, metrics, osDistribution } = useAgentsData();
  const [activeTab, setActiveTab] = useState<AgentStatus | "all">("all");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleTabChange = (tab: AgentStatus | "all") => {
    setActiveTab(tab);
    filterByStatus(tab);
  };

  const handleAgentClick = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    // Keep the selected agent for a moment before clearing
    setTimeout(() => setSelectedAgent(null), 300);
  };

  // Mock data for navigation
  const navItems = [
    { icon: "fas fa-home", label: "Dashboard", href: "/dashboard" },
    { icon: "fas fa-shield-virus", label: "Threats", href: "/threats" },
    { icon: "fas fa-map-marker-alt", label: "Sites", href: "/sites" },
    { icon: "fas fa-desktop", label: "Agents", href: "/agents", active: true },
    { icon: "fas fa-exclamation-triangle", label: "Incidents", href: "/incidents" },
    { icon: "fas fa-shield-alt", label: "Alerts", href: "#" },
    { icon: "fas fa-chart-line", label: "Analytics", href: "#" },
    { icon: "fas fa-cog", label: "Settings", href: "#" },
  ];

  const user = {
    name: "Admin User",
    email: "admin@example.com",
    avatar: "",
    role: "Administrator",
  };

  return (
    <div className="flex h-screen bg-slate-950">
      <DashboardSidebar navItems={navItems} user={user} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          title="Agent Management"
          subtitle="Monitor and manage all security agents deployed across your infrastructure"
        />

        <main className="flex-1 overflow-y-auto p-8">
          {/* Stats Cards */}
          <div className="mb-8">
            <AgentStatsCards
              stats={{
                total: metrics.total,
                online: metrics.online,
                offline: metrics.offline,
                updating: metrics.updating,
              }}
            />
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <AgentTabs
              activeTab={activeTab}
              onTabChange={handleTabChange}
              onlineCount={metrics.online}
              offlineCount={metrics.offline}
              updatingCount={metrics.updating}
            />
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column - Agent Grid (takes 2 columns) */}
            <div className="xl:col-span-2">
              <AgentGrid agents={filteredAgents} onAgentClick={handleAgentClick} />
            </div>

            {/* Right Column - Metrics and Chart */}
            <div className="space-y-6">
              {/* Metrics Card */}
              <AgentMetricsCard
                metrics={{
                  avgResponseTime: metrics.avgResponseTime,
                  dataTransferred: metrics.dataTransferred,
                  threatsBlocked: metrics.threatsBlocked,
                  updatesAvailable: metrics.updatesAvailable,
                }}
              />

              {/* OS Distribution Chart */}
              <OSDistributionChart data={osDistribution} />
            </div>
          </div>
        </main>
      </div>

      {/* Agent Detail Drawer */}
      <AgentDetailDrawer
        agent={selectedAgent}
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
      />
    </div>
  );
}
