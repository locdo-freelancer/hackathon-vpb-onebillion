import React from "react";
import type { Site } from "@/types/sites.types";
import { SiteRow } from "./SiteRow";
import { SiteCheckbox } from "./SiteCheckbox";
import { SitesEmptyState } from "./SitesEmptyState";

interface SitesTableProps {
  sites: Site[];
  selectedSites: string[];
  onToggleSelect: (siteId: string) => void;
  onToggleAll: () => void;
  onEdit: (site: Site) => void;
  onView: (site: Site) => void;
  onDelete: (site: Site) => void;
  onViewToken: (site: Site) => void;
}

/**
 * Sites Table Component
 * Single Responsibility: Render table structure and iterate over sites
 * Open/Closed: Open for extension (new columns), uses composition pattern
 * Liskov Substitution: Can be replaced with any compatible table component
 * Interface Segregation: Clean props interface - sites data and handlers
 * Dependency Inversion: Depends on Site abstraction, not concrete implementation
 */
export const SitesTable: React.FC<SitesTableProps> = ({
  sites,
  selectedSites,
  onToggleSelect,
  onToggleAll,
  onEdit,
  onView,
  onDelete,
  onViewToken,
}) => {
  const allSelected =
    sites.length > 0 && selectedSites.length === sites.length;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-950/50 border-b border-slate-800">
            <tr>
              <th className="px-6 py-4 text-left">
                <SiteCheckbox
                  checked={allSelected}
                  onChange={onToggleAll}
                  ariaLabel="Select all sites"
                />
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Site Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                IP Address
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Domain
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Agents
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {sites.length === 0 ? (
              <SitesEmptyState />
            ) : (
              sites.map((site) => (
                <SiteRow
                  key={site.id}
                  site={site}
                  isSelected={selectedSites.includes(site.id)}
                  onToggleSelect={onToggleSelect}
                  onEdit={onEdit}
                  onView={onView}
                  onDelete={onDelete}
                  onViewToken={onViewToken}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
