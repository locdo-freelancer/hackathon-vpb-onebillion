import React from "react";
import type { Site, SitesFilter } from "@/types/sites.types";
import { SitesToolbar } from "./SitesToolbar";
import { SitesTable } from "./SitesTable";

interface SitesPageContentProps {
  sites: Site[];
  selectedSites: string[];
  currentFilter: SitesFilter;
  onAddSite: () => void;
  onApplyFilter: (filter: SitesFilter) => void;
  onEnableSelected: () => void;
  onDisableSelected: () => void;
  onDeleteSelected: () => void;
  onExport: () => void;
  onToggleSelect: (siteId: string) => void;
  onToggleAll: () => void;
  onEdit: (site: Site) => void;
  onView: (site: Site) => void;
  onDelete: (site: Site) => void;
}

/**
 * Sites Page Content Component
 * Single Responsibility: Compose toolbar and table sections
 * Open/Closed: Open for extension (new sections), Closed for modification
 * Liskov Substitution: Can be replaced with any compatible content component
 */
export const SitesPageContent: React.FC<SitesPageContentProps> = ({
  sites,
  selectedSites,
  currentFilter,
  onAddSite,
  onApplyFilter,
  onEnableSelected,
  onDisableSelected,
  onDeleteSelected,
  onExport,
  onToggleSelect,
  onToggleAll,
  onEdit,
  onView,
  onDelete,
}) => {
  return (
    <>
      {/* Toolbar Section */}
      <SitesToolbar
        selectedCount={selectedSites.length}
        currentFilter={currentFilter}
        onAddSite={onAddSite}
        onApplyFilter={onApplyFilter}
        onEnableSelected={onEnableSelected}
        onDisableSelected={onDisableSelected}
        onDeleteSelected={onDeleteSelected}
        onExport={onExport}
      />

      {/* Table Section */}
      <SitesTable
        sites={sites}
        selectedSites={selectedSites}
        onToggleSelect={onToggleSelect}
        onToggleAll={onToggleAll}
        onEdit={onEdit}
        onView={onView}
        onDelete={onDelete}
      />
    </>
  );
};
