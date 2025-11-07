import React from "react";
import type { SitesFilter } from "@/types/sites.types";
import { FilterMenu } from "./FilterMenu";
import { BulkActionsMenu } from "./BulkActionsMenu";

interface SitesToolbarProps {
  selectedCount: number;
  currentFilter: SitesFilter;
  onAddSite: () => void;
  onApplyFilter: (filter: SitesFilter) => void;
  onEnableSelected: () => void;
  onDisableSelected: () => void;
  onDeleteSelected: () => void;
  onExport: () => void;
}

export const SitesToolbar: React.FC<SitesToolbarProps> = ({
  selectedCount,
  currentFilter,
  onAddSite,
  onApplyFilter,
  onEnableSelected,
  onDisableSelected,
  onDeleteSelected,
  onExport,
}) => {
  return (
    <div className="mb-6 flex items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <button
          onClick={onAddSite}
          className="px-4 py-2 bg-linear-to-r from-cyan-500 to-cyan-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-cyan-500/20 transition-all"
        >
          <i className="fas fa-plus mr-2" />
          Add New Site
        </button>

        <BulkActionsMenu
          selectedCount={selectedCount}
          onEnableSelected={onEnableSelected}
          onDisableSelected={onDisableSelected}
          onDeleteSelected={onDeleteSelected}
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        <FilterMenu currentFilter={currentFilter} onApply={onApplyFilter} />

        <button
          onClick={onExport}
          className="px-4 py-2 bg-slate-900 border border-slate-800 text-gray-300 rounded-lg hover:border-cyan-500/50 transition-colors"
        >
          <i className="fas fa-download mr-2" />
          Export
        </button>
      </div>
    </div>
  );
};
