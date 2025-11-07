"use client";

import React, { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import {
  ThreatsFilters,
  ThreatsTable,
  ThreatDetailDrawer,
} from "@/components/threats";
import { useThreatsData } from "@/hooks/useThreatsData";

export default function ThreatsPage() {
  const {
    filteredIndicators,
    filter,
    setFilter,
    applyFilters,
    selectedThreat,
    selectThreat,
    selectedIndicators,
    toggleIndicatorSelection,
    toggleAllIndicators,
    stats,
  } = useThreatsData();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleThreatClick = async (id: string) => {
    await selectThreat(id);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setTimeout(() => selectThreat(null), 300);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilter({ searchQuery: query });
    applyFilters();
  };

  const handleExport = () => {
    // Export functionality
    console.log("Exporting threats data...");
  };

  // Navigation items
  const navItems = [
    { icon: "fas fa-gauge-high", label: "Dashboard", href: "/dashboard" },
    {
      icon: "fas fa-shield-virus",
      label: "Threats",
      href: "/threats",
      active: true,
    },
    { icon: "fas fa-server", label: "Sites", href: "/sites" },
    { icon: "fas fa-desktop", label: "Agents", href: "/agents" },
    { icon: "fas fa-exclamation-triangle", label: "Incidents", href: "/incidents" },
    { icon: "fas fa-bell", label: "Alerts", href: "#", badge: 8 },
    { icon: "fas fa-chart-line", label: "Reports", href: "#" },
    { icon: "fas fa-cog", label: "Settings", href: "#" },
  ];

  const user = {
    name: "John Smith",
    email: "admin@example.com",
    avatar:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg",
    role: "Admin",
  };

  return (
    <div className="flex h-screen bg-slate-950">
      <DashboardSidebar navItems={navItems} user={user} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header with Search and Export */}
        <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl">
          <div className="px-8 py-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Threat Intelligence
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Monitor and analyze threat indicators across your network
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Search Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search indicators..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-64 px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
                <i className="fas fa-search absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
              </div>

              {/* Export Button */}
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
              >
                <i className="fas fa-download mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        <main className="flex-1 p-8 overflow-auto">
          {/* Filters Section */}
          <div className="mb-6">
            <ThreatsFilters
              filter={filter}
              onFilterChange={setFilter}
              onApply={applyFilters}
            />
          </div>

          {/* Table Section */}
          <ThreatsTable
            threats={filteredIndicators}
            selectedIds={selectedIndicators}
            onSelectThreat={toggleIndicatorSelection}
            onSelectAll={toggleAllIndicators}
            onThreatClick={handleThreatClick}
            totalCount={stats.total}
          />
        </main>
      </div>

      {/* Threat Detail Drawer */}
      <ThreatDetailDrawer
        threat={selectedThreat}
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
      />
    </div>
  );
}
