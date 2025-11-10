import React from "react";
import type { ThreatsFilter } from "@/types/threats.types";
import { useTranslations } from "@/hooks/useTranslations";

interface ThreatsFiltersProps {
  filter: ThreatsFilter;
  onFilterChange: (filter: Partial<ThreatsFilter>) => void;
  onApply: () => void;
}

export const ThreatsFilters: React.FC<ThreatsFiltersProps> = ({
  filter,
  onFilterChange,
  onApply,
}) => {
  const { t } = useTranslations();
  
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">{t("common.filter")}</h3>

      <div className="grid grid-cols-6 gap-4">
        {/* Severity Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            {t("threats.severity")}
          </label>
          <select
            value={filter.severity}
            onChange={(e) =>
              onFilterChange({
                severity: e.target.value as ThreatsFilter["severity"],
              })
            }
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="all">{t("common.all")}</option>
            <option value="critical">{t("dashboard.critical")}</option>
            <option value="high">{t("dashboard.high")}</option>
            <option value="medium">{t("dashboard.medium")}</option>
            <option value="low">{t("dashboard.low")}</option>
          </select>
        </div>

        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            {t("threats.type")}
          </label>
          <select
            value={filter.type}
            onChange={(e) =>
              onFilterChange({ type: e.target.value as ThreatsFilter["type"] })
            }
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="all">{t("common.all")}</option>
            <option value="ip">{t("common.ipAddress")}</option>
            <option value="domain">{t("common.domain")}</option>
            <option value="url">{t("common.url")}</option>
            <option value="hash">{t("common.fileHash")}</option>
          </select>
        </div>

        {/* Country Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            {t("common.country")}
          </label>
          <select
            value={filter.country}
            onChange={(e) => onFilterChange({ country: e.target.value })}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="">{t("common.all")}</option>
            <option value="US">{t("common.unitedStates")}</option>
            <option value="CN">{t("common.china")}</option>
            <option value="RU">{t("common.russia")}</option>
            <option value="IR">{t("common.iran")}</option>
            <option value="KP">{t("common.northKorea")}</option>
            <option value="BR">{t("common.brazil")}</option>
            <option value="UA">{t("common.ukraine")}</option>
            <option value="NG">{t("common.nigeria")}</option>
          </select>
        </div>

        {/* IP Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            {t("common.ipRange")}
          </label>
          <input
            type="text"
            placeholder={t("common.ipRangePlaceholder")}
            value={filter.ipRange}
            onChange={(e) => onFilterChange({ ipRange: e.target.value })}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Time Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            {t("common.timeRange")}
          </label>
          <select
            value={filter.timeRange}
            onChange={(e) =>
              onFilterChange({
                timeRange: e.target.value as ThreatsFilter["timeRange"],
              })
            }
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="24h">{t("common.last24Hours")}</option>
            <option value="7d">{t("common.last7Days")}</option>
            <option value="30d">{t("common.last30Days")}</option>
            <option value="90d">{t("common.last90Days")}</option>
          </select>
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
    </div>
  );
};
