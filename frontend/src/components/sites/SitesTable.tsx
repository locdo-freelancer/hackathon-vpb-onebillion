import React from "react";
import type { Site } from "@/types/sites.types";
import { SiteRow } from "./SiteRow";

interface SitesTableProps {
  sites: Site[];
  selectedSites: string[];
  onToggleSelect: (siteId: string) => void;
  onToggleAll: () => void;
  onEdit: (site: Site) => void;
  onView: (site: Site) => void;
  onDelete: (site: Site) => void;
}

export const SitesTable: React.FC<SitesTableProps> = ({
  sites,
  selectedSites,
  onToggleSelect,
  onToggleAll,
  onEdit,
  onView,
  onDelete,
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
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onToggleAll}
                  className="w-4 h-4 bg-slate-950 border border-slate-800 rounded accent-cyan-500"
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
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <div className="text-gray-400">
                    <i className="fas fa-server text-4xl mb-4 opacity-50" />
                    <p className="text-sm">No sites found</p>
                  </div>
                </td>
              </tr>
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
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
