"use client";

import React from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import {
  AgentsPageContent,
  AgentsPageSidebar,
  AgentDetailDrawer,
} from "@/components/agents";
import { getNavItems, getDefaultUser } from "@/config/navigation.config";
import { useAgentsFlow } from "@/hooks/useAgentsFlow";

/**
 * Agents Page Component
 * 
 * SOLID Principles Applied:
 * - Single Responsibility: Only handles page composition and layout
 * - Open/Closed: New sections added via new components, not page modification
 * - Liskov Substitution: Page-level components (Content, Sidebar) are interchangeable
 * - Dependency Inversion: Depends on abstract hook interface, not concrete implementation
 * 
 * Reduced from 105 lines to ~55 lines by extracting layout logic to composition components
 */
export default function AgentsPage() {
  const {
    activeTab,
    filteredAgents,
    selectedAgent,
    metrics,
    osDistribution,
    handleTabChange,
    handleAgentClick,
    handleDrawerClose,
    isDrawerOpen,
  } = useAgentsFlow();

  const user = getDefaultUser();
  const navItems = getNavItems("/agents");

  return (
    <div className="flex h-screen bg-slate-950">
      <DashboardSidebar navItems={navItems} user={user} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          title="Agent Management"
          subtitle="Monitor and manage all security agents deployed across your infrastructure"
        />

        <main className="flex-1 overflow-y-auto p-8">
          {/* Two Column Layout (OCP - Composition over implementation) */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column - Main Content (SRP - All agent interaction) */}
            <div className="xl:col-span-2">
              <AgentsPageContent
                stats={{
                  total: metrics.total,
                  online: metrics.online,
                  offline: metrics.offline,
                  updating: metrics.updating,
                }}
                activeTab={activeTab}
                onTabChange={handleTabChange}
                filteredAgents={filteredAgents}
                onAgentClick={handleAgentClick}
              />
            </div>

            {/* Right Column - Sidebar (SRP - Metrics and analytics) */}
            <AgentsPageSidebar
              metrics={{
                avgResponseTime: metrics.avgResponseTime,
                dataTransferred: metrics.dataTransferred,
                threatsBlocked: metrics.threatsBlocked,
                updatesAvailable: metrics.updatesAvailable,
              }}
              osDistribution={osDistribution}
            />
          </div>
        </main>
      </div>

      {/* Agent Detail Drawer (ISP - Drawer has own isolated props) */}
      <AgentDetailDrawer
        agent={selectedAgent}
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
      />
    </div>
  );
}
