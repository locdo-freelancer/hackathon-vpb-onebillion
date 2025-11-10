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
import { useAuthProtection } from "@/hooks/useAuthProtection";
import { useTranslations } from "@/hooks/useTranslations";

export default function AgentsPage() {
  useAuthProtection();
  const { t } = useTranslations();
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
          title={t("agents.title")}
          subtitle={t("common.monitorAgents")}
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
