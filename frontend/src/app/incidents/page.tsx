"use client";

import React from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { IncidentsFilters, IncidentsTable } from "@/components/incidents";
import { getNavItems, getDefaultUser } from "@/config/navigation.config";
import { useIncidentsFlow } from "@/hooks/useIncidentsFlow";
import { useAuthProtection } from "@/hooks/useAuthProtection";

export default function IncidentsPage() {
  useAuthProtection();
  const {
    searchQuery,
    filteredIncidents,
    filter,
    selectedIncidents,
    stats,
    handleSearch,
    handleIncidentClick,
    handleNewIncident,
    handleBulkAction,
    setFilter,
    applyFilters,
    toggleIncidentSelection,
    toggleAllIncidents,
  } = useIncidentsFlow();

  const user = getDefaultUser();
  const navItems = getNavItems("/incidents");

  return (
    <div className="flex h-screen bg-slate-950">
      <DashboardSidebar navItems={navItems} user={user} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl">
          <div className="px-8 py-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Security Incidents
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Monitor and manage security incidents across your infrastructure
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Search Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search incidents..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-64 px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
                <i className="fas fa-search absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
              </div>

              {/* New Incident Button */}
              <button
                onClick={handleNewIncident}
                className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
              >
                <i className="fas fa-plus mr-2" />
                New Incident
              </button>
            </div>
          </div>
        </div>

        <main className="flex-1 p-8 overflow-auto">
          {/* Filters Section */}
          <div className="mb-6">
            <IncidentsFilters
              filter={filter}
              onFilterChange={setFilter}
              onApply={applyFilters}
              selectedCount={selectedIncidents.length}
              onBulkAction={handleBulkAction}
            />
          </div>

          {/* Table Section */}
          <IncidentsTable
            incidents={filteredIncidents}
            selectedIds={selectedIncidents}
            onSelectIncident={toggleIncidentSelection}
            onSelectAll={toggleAllIncidents}
            onIncidentClick={handleIncidentClick}
            totalCount={stats.total}
          />
        </main>
      </div>
    </div>
  );
}
