import React from "react";
import type { Site } from "@/types/sites.types";
import { SiteStatusBadge } from "./SiteStatusBadge";
import { SiteActions } from "./SiteActions";

interface SiteRowProps {
  site: Site;
  isSelected: boolean;
  onToggleSelect: (siteId: string) => void;
  onEdit: (site: Site) => void;
  onView: (site: Site) => void;
  onDelete: (site: Site) => void;
}

export const SiteRow: React.FC<SiteRowProps> = ({
  site,
  isSelected,
  onToggleSelect,
  onEdit,
  onView,
  onDelete,
}) => {
  return (
    <tr className="hover:bg-slate-800/30 transition-colors">
      {/* Checkbox */}
      <td className="px-6 py-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(site.id)}
          className="w-4 h-4 bg-slate-950 border border-slate-800 rounded accent-cyan-500"
        />
      </td>

      {/* Site Name */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 bg-linear-to-br ${site.iconGradient} rounded-lg flex items-center justify-center`}
          >
            <i className={`${site.icon} text-white`} />
          </div>
          <div>
            <p className="text-sm font-medium text-white">{site.name}</p>
            <p className="text-xs text-gray-400">{site.hostname}</p>
          </div>
        </div>
      </td>

      {/* IP Address */}
      <td className="px-6 py-4">
        <span className="text-sm text-gray-300 font-mono">
          {site.ipAddress}
        </span>
      </td>

      {/* Domains */}
      <td className="px-6 py-4">
        <div className="flex flex-wrap gap-1">
          {site.domains.map((domain, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-cyan-500/10 text-cyan-400 text-xs rounded"
            >
              {domain}
            </span>
          ))}
        </div>
      </td>

      {/* Agents */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white">
            {site.agentCount}
          </span>
          <span className="text-xs text-gray-400">active</span>
        </div>
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <SiteStatusBadge status={site.status} />
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <SiteActions
          site={site}
          onEdit={onEdit}
          onView={onView}
          onDelete={onDelete}
        />
      </td>
    </tr>
  );
};
