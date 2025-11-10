import React from "react";
import type { IncidentsFilter } from "@/types/incidents.types";
import { useTranslations } from "@/hooks/useTranslations";

interface IncidentsFiltersProps {
  filter: IncidentsFilter;
  onFilterChange: (filter: Partial<IncidentsFilter>) => void;
  onApply: () => void;
  selectedCount: number;
  onBulkAction: (action: "close" | "assign" | "export") => void;
}

export const IncidentsFilters: React.FC<IncidentsFiltersProps> = ({
  filter,
  onFilterChange,
  onApply,
  selectedCount,
  onBulkAction,
}) => {
  const { t } = useTranslations();
  
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">{t("common.filtersSearch")}</h3>

      {/* Filter Inputs */}
      <div className="grid grid-cols-6 gap-4">
        {/* Severity Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            {t("incidents.severity")}
          </label>
          <select
            value={filter.severity}
            onChange={(e) =>
              onFilterChange({
                severity: e.target.value as IncidentsFilter["severity"],
              })
            }
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="all">{t("common.allSeverities")}</option>
            <option value="critical">{t("dashboard.critical")}</option>
            <option value="high">{t("dashboard.high")}</option>
            <option value="medium">{t("dashboard.medium")}</option>
            <option value="low">{t("dashboard.low")}</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            {t("incidents.status")}
          </label>
          <select
            value={filter.status}
            onChange={(e) =>
              onFilterChange({ status: e.target.value as IncidentsFilter["status"] })
            }
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="all">{t("common.allStatuses")}</option>
            <option value="open">{t("dashboard.open")}</option>
            <option value="investigating">{t("common.investigating")}</option>
            <option value="resolved">{t("dashboard.resolved")}</option>
            <option value="closed">{t("common.closed")}</option>
          </select>
        </div>

        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            {t("common.type")}
          </label>
          <select
            value={filter.type}
            onChange={(e) =>
              onFilterChange({ type: e.target.value as IncidentsFilter["type"] })
            }
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="all">{t("common.allTypes")}</option>
            <option value="malware">{t("common.malware")}</option>
            <option value="phishing">{t("common.phishing")}</option>
            <option value="ddos">{t("common.ddos")}</option>
            <option value="intrusion">{t("common.intrusion")}</option>
            <option value="data-breach">{t("common.dataBreach")}</option>
            <option value="policy-violation">{t("common.policyViolation")}</option>
            <option value="ransomware">{t("common.ransomware")}</option>
            <option value="vulnerability">{t("common.vulnerability")}</option>
          </select>
        </div>

        {/* Date From */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            {t("common.dateFrom")}
          </label>
          <input
            type="date"
            value={filter.dateFrom}
            onChange={(e) => onFilterChange({ dateFrom: e.target.value })}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Date To */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            {t("common.dateTo")}
          </label>
          <input
            type="date"
            value={filter.dateTo}
            onChange={(e) => onFilterChange({ dateTo: e.target.value })}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Apply Button */}
        <div className="flex items-end">
          <button
            onClick={onApply}
            className="w-full px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
          >
            <i className="fas fa-filter mr-2" />
            {t("common.apply")}
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="mt-4 flex items-center gap-4">
        <div className="text-sm text-gray-400">
          {selectedCount > 0 ? `${selectedCount} ${t("common.selected")}` : t("common.noSelection")}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onBulkAction("close")}
            disabled={selectedCount === 0}
            className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fas fa-times mr-1" />
            {t("common.closeSelected")}
          </button>
          <button
            onClick={() => onBulkAction("assign")}
            disabled={selectedCount === 0}
            className="px-3 py-1 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-lg hover:bg-orange-500/30 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fas fa-user mr-1" />
            {t("common.assign")}
          </button>
          <button
            onClick={() => onBulkAction("export")}
            className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-colors text-sm"
          >
            <i className="fas fa-download mr-1" />
            {t("common.export")}
          </button>
        </div>
      </div>
    </div>
  );
};
