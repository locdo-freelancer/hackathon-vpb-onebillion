"use client";

import React, { useState } from "react";
import { DashboardSidebar, DashboardHeader } from "@/components/dashboard";
import {
  SitesPageContent,
  SitesStatsFooter,
  SiteModal,
} from "@/components/sites";
import { AgentTokenModal } from "@/components/sites/AgentTokenModal";
import { getNavItems, getDefaultUser } from "@/config/navigation.config";
import { useSitesFlow } from "@/hooks/useSitesFlow";
import { useAuthProtection } from "@/hooks/useAuthProtection";
import type { Site } from "@/types/sites.types";
import { useTranslations } from "@/hooks/useTranslations";

/**
 * Sites Page
 * Single Responsibility: Orchestrate sites management page layout
 * Open/Closed: Open for extension through composition
 * Dependency Inversion: Depends on useSitesFlow abstraction
 */
export default function SitesPage() {
  useAuthProtection();
  const [tokenModalOpen, setTokenModalOpen] = useState(false);
  const [selectedSiteForToken, setSelectedSiteForToken] = useState<Site | null>(null);

  const { t } = useTranslations();
  const {
    data,
    isLoading,
    error,
    filteredSites,
    selectedSites,
    currentFilter,
    isModalOpen,
    editingSite,
    handleAddSite,
    handleEditSite,
    handleViewSite,
    handleDeleteSite,
    handleSaveSite,
    handleEnableSelected,
    handleDisableSelected,
    handleDeleteSelected,
    handleApplyFilter,
    handleExport,
    toggleSiteSelection,
    toggleAllSites,
    setIsModalOpen,
  } = useSitesFlow();

  const handleViewToken = (site: Site) => {
    setSelectedSiteForToken(site);
    setTokenModalOpen(true);
  };

  const user = getDefaultUser();
  const navItems = getNavItems("/sites");

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
            title={t("sites.title")}
            subtitle={t("common.monitorSites")}
          />

          {/* Sites Content */}
          <main className="flex-1 p-8 overflow-auto">
            <SitesPageContent
              sites={filteredSites}
              selectedSites={selectedSites}
              currentFilter={currentFilter}
              onAddSite={handleAddSite}
              onApplyFilter={handleApplyFilter}
              onEnableSelected={handleEnableSelected}
              onDisableSelected={handleDisableSelected}
              onDeleteSelected={handleDeleteSelected}
              onExport={handleExport}
              onToggleSelect={toggleSiteSelection}
              onToggleAll={toggleAllSites}
              onEdit={handleEditSite}
              onView={handleViewSite}
              onDelete={handleDeleteSite}
              onViewToken={handleViewToken}
            />

            {/* Stats Footer */}
            {data && (
              <SitesStatsFooter data={data} filteredCount={filteredSites.length} />
            )}
          </main>
        </div>
      </div>

      {/* Site Modal */}
      <SiteModal
        isOpen={isModalOpen}
        site={editingSite}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSite}
      />

      {/* Agent Token Modal */}
      <AgentTokenModal
        isOpen={tokenModalOpen}
        site={selectedSiteForToken}
        onClose={() => {
          setTokenModalOpen(false);
          setSelectedSiteForToken(null);
        }}
      />
    </div>
  );
}
