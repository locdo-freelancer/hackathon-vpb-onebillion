"use client";

import React from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import {
  ThreatsPageHeader,
  ThreatsPageContent,
  ThreatDetailDrawer,
} from "@/components/threats";
import { useThreatsPage } from "@/hooks/useThreatsPage";
import { useAuthProtection } from "@/hooks/useAuthProtection";
import { getNavItems, getDefaultUser } from "@/config/navigation.config";

export default function ThreatsPage() {
  useAuthProtection();
  const {
    threats,
    selectedThreat,
    selectedIndicators,
    stats,
    filter,
    isDrawerOpen,
    searchQuery,
    handleThreatClick,
    handleDrawerClose,
    handleSearch,
    handleExport,
    setFilter,
    applyFilters,
    toggleIndicatorSelection,
    toggleAllIndicators,
  } = useThreatsPage();

  const user = getDefaultUser();
  const navItems = getNavItems("/threats");

  return (
    <div className="flex h-screen bg-slate-950">
      <DashboardSidebar navItems={navItems} user={user} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <ThreatsPageHeader
          searchQuery={searchQuery}
          onSearch={handleSearch}
          onExport={handleExport}
        />

        <ThreatsPageContent
          threats={threats}
          filter={filter}
          selectedIndicators={selectedIndicators}
          stats={stats}
          onFilterChange={setFilter}
          onApplyFilters={applyFilters}
          onSelectThreat={toggleIndicatorSelection}
          onSelectAll={toggleAllIndicators}
          onThreatClick={handleThreatClick}
        />
      </div>

      <ThreatDetailDrawer
        threat={selectedThreat}
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
      />
    </div>
  );
}
