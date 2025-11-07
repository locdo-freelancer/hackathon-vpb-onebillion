"use client";

import React, { useState } from "react";
import { useSitesData } from "@/hooks/useSitesData";
import {
  DashboardSidebar,
  DashboardHeader,
} from "@/components/dashboard";
import {
  SitesTable,
  SitesToolbar,
  SiteModal,
} from "@/components/sites";
import type { Site, SiteFormData, SitesFilter } from "@/types/sites.types";

export default function SitesPage() {
  const {
    data,
    isLoading,
    error,
    filteredSites,
    applyFilter,
    selectedSites,
    toggleSiteSelection,
    toggleAllSites,
    clearSelection,
  } = useSitesData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSite, setEditingSite] = useState<Site | null>(null);
  const [currentFilter, setCurrentFilter] = useState<SitesFilter>({
    status: "all",
    agentCount: "any",
    searchQuery: "",
  });

  // Modal handlers
  const handleAddSite = () => {
    setEditingSite(null);
    setIsModalOpen(true);
  };

  const handleEditSite = (site: Site) => {
    setEditingSite(site);
    setIsModalOpen(true);
  };

  const handleViewSite = (site: Site) => {
    alert(`Viewing details for: ${site.name}`);
  };

  const handleDeleteSite = (site: Site) => {
    if (confirm(`Are you sure you want to delete ${site.name}?`)) {
      alert(`Deleted site: ${site.name}`);
    }
  };

  const handleSaveSite = (formData: SiteFormData) => {
    if (editingSite) {
      alert(`Updated site: ${formData.name}`);
    } else {
      alert(`Created new site: ${formData.name}`);
    }
    // In production, call API here
  };

  // Bulk actions
  const handleEnableSelected = () => {
    alert(`Enabling ${selectedSites.length} sites`);
    clearSelection();
  };

  const handleDisableSelected = () => {
    alert(`Disabling ${selectedSites.length} sites`);
    clearSelection();
  };

  const handleDeleteSelected = () => {
    if (
      confirm(`Are you sure you want to delete ${selectedSites.length} sites?`)
    ) {
      alert(`Deleted ${selectedSites.length} sites`);
      clearSelection();
    }
  };

  // Filter handler
  const handleApplyFilter = (filter: SitesFilter) => {
    setCurrentFilter(filter);
    applyFilter(filter);
  };

  // Export handler
  const handleExport = () => {
    alert("Exporting sites data...");
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-cyan-500 to-purple-500 rounded-full mb-4 animate-pulse">
            <i className="fas fa-server text-2xl text-white" />
          </div>
          <p className="text-white font-medium">Loading Sites...</p>
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
            Failed to Load Sites
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

  // User data for sidebar
  const user = {
    name: "John Smith",
    role: "Admin",
    avatar:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg",
  };

  // Navigation items for sidebar
  const navItems = [
    { icon: "fas fa-gauge-high", label: "Dashboard", href: "/dashboard" },
    { icon: "fas fa-shield-virus", label: "Threats", href: "/threats" },
    { icon: "fas fa-server", label: "Sites", href: "/sites", active: true },
    { icon: "fas fa-desktop", label: "Agents", href: "/agents" },
    { icon: "fas fa-exclamation-triangle", label: "Incidents", href: "/incidents" },
    { icon: "fas fa-bell", label: "Alerts", href: "#" },
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
            title="Sites Management"
            subtitle="Monitor and manage your protected sites"
          />

          {/* Sites Content */}
          <main className="flex-1 p-8 overflow-auto">
            {/* Toolbar */}
            <SitesToolbar
              selectedCount={selectedSites.length}
              currentFilter={currentFilter}
              onAddSite={handleAddSite}
              onApplyFilter={handleApplyFilter}
              onEnableSelected={handleEnableSelected}
              onDisableSelected={handleDisableSelected}
              onDeleteSelected={handleDeleteSelected}
              onExport={handleExport}
            />

            {/* Sites Table */}
            <SitesTable
              sites={filteredSites}
              selectedSites={selectedSites}
              onToggleSelect={toggleSiteSelection}
              onToggleAll={toggleAllSites}
              onEdit={handleEditSite}
              onView={handleViewSite}
              onDelete={handleDeleteSite}
            />

            {/* Stats Footer */}
            {data && (
              <div className="mt-6 flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center gap-6">
                  <span>
                    Total Sites: <strong className="text-white">{data.totalSites}</strong>
                  </span>
                  <span>
                    Active: <strong className="text-green-400">{data.activeSites}</strong>
                  </span>
                  <span>
                    Warning: <strong className="text-yellow-400">{data.warningSites}</strong>
                  </span>
                  <span>
                    Inactive: <strong className="text-gray-500">{data.inactiveSites}</strong>
                  </span>
                </div>
                <span>
                  Showing {filteredSites.length} of {data.totalSites} sites
                </span>
              </div>
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
    </div>
  );
}
