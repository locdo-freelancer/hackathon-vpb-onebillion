import React from "react";
import type { Site } from "@/types/sites.types";
import { StatusBadge } from "@/components/shared";
import { SiteActions } from "./SiteActions";
import { SiteCheckbox } from "./SiteCheckbox";
import { SiteIcon } from "./SiteIcon";
import { AgentCountBadge } from "./AgentCountBadge";

interface SiteRowProps {
  site: Site;
  isSelected: boolean;
  onToggleSelect: (siteId: string) => void;
  onEdit: (site: Site) => void;
  onView: (site: Site) => void;
  onDelete: (site: Site) => void;
}

/**
 * Site Row Component
 * Single Responsibility: Renders a single site table row
 * Open/Closed: Open for extension (new columns), uses composition
 * Liskov Substitution: Can be replaced with any compatible row component
 * Interface Segregation: Minimal props - site data and action handlers
 * Dependency Inversion: Depends on abstract Site type and action handlers
 */
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
        <SiteCheckbox
          checked={isSelected}
          onChange={() => onToggleSelect(site.id)}
          ariaLabel={`Select ${site.name}`}
        />
      </td>

      {/* Site Name */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <SiteIcon
            icon={site.icon}
            gradient={site.iconGradient}
            alt={site.name}
          />
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
        <AgentCountBadge count={site.agentCount} />
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <StatusBadge 
          status={
            site.status === "active" ? "online" :
            site.status === "warning" ? "warning" :
            "idle"
          }
          label={
            site.status === "active" ? "Active" :
            site.status === "warning" ? "Warning" :
            "Inactive"
          }
          showDot
        />
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
