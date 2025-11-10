import React from "react";
import type { Site } from "@/types/sites.types";
import { SiteRow } from "./SiteRow";
import { SiteCheckbox } from "./SiteCheckbox";
import { SitesEmptyState } from "./SitesEmptyState";
import { useTranslations } from "@/hooks/useTranslations";

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
  const { t } = useTranslations();
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
                {t("sites.name")}
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {t("common.ipAddress")}
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {t("common.domain")}
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {t("sites.agents")}
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {t("sites.status")}
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {t("common.actions")}
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
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
