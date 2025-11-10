import React from "react";
import type { IncidentStats, ResolutionStats } from "@/types/dashboard.types";
import { useTranslations } from "@/hooks/useTranslations";

interface IncidentSummaryCardProps {
  stats: IncidentStats;
  resolution: ResolutionStats;
  onExport?: () => void;
}

export const IncidentSummaryCard: React.FC<IncidentSummaryCardProps> = ({
  stats,
  resolution,
  onExport,
}) => {
  const { t } = useTranslations("dashboard");

  const severityBreakdown = [
    { label: t("critical"), count: stats.critical, color: "bg-red-500" },
    { label: t("high"), count: stats.high, color: "bg-yellow-500" },
    { label: t("medium"), count: stats.medium, color: "bg-blue-500" },
    { label: t("low"), count: stats.low, color: "bg-green-500" },
  ];

  const resolutionData = [
    {
      label: t("resolved"),
      ...resolution.resolved,
      color: "bg-green-500",
      textColor: "text-green-400",
    },
    {
      label: t("inProgress"),
      ...resolution.inProgress,
      color: "bg-blue-500",
      textColor: "text-blue-400",
    },
    {
      label: t("open"),
      ...resolution.open,
      color: "bg-yellow-500",
      textColor: "text-yellow-400",
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">
            {t("incidentSummary")}
          </h3>
          <p className="text-sm text-gray-400">Last 24 hours overview</p>
        </div>
        <button
          onClick={onExport}
          className="px-4 py-2 bg-cyan-500/20 text-cyan-400 text-sm font-medium rounded-lg hover:bg-cyan-500/30 transition-colors"
        >
          <i className="fas fa-download mr-2" />
          {t("export")}
        </button>
      </div>

      {/* Total Incidents */}
      <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-400">{t("totalIncidents")}</span>
          <span className="text-2xl font-bold text-white">{stats.total}</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <i
            className={`fas fa-arrow-${stats.trend.direction} ${
              stats.trend.direction === "up" ? "text-red-400" : "text-green-400"
            }`}
          />
          <span
            className={
              stats.trend.direction === "up" ? "text-red-400" : "text-green-400"
            }
          >
            {stats.trend.direction === "up" ? "+" : "-"}
            {stats.trend.value}% {t("fromYesterday")}
          </span>
        </div>
      </div>

      {/* Severity Breakdown */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {severityBreakdown.map((item, index) => (
          <div
            key={index}
            className="bg-slate-950/50 border border-slate-800 rounded-lg p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-3 h-3 ${item.color} rounded-full`} />
              <span className="text-xs text-gray-400">{item.label}</span>
            </div>
            <p className="text-2xl font-bold text-white">{item.count ?? 0}</p>
          </div>
        ))}
      </div>

      {/* Resolution Status */}
      <div className="border-t border-slate-800 pt-4">
        <h4 className="text-sm font-semibold text-white mb-3">
          {t("resolutionStatus")}
        </h4>

        <div className="space-y-3">
          {resolutionData.map((item, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400">{item.label}</span>
                <span className={`text-xs ${item.textColor} font-medium`}>
                  {item.count} ({item.percentage}%)
                </span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2">
                <div
                  className={`${item.color} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mean Time to Resolve */}
      <div className="mt-6 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">{t("meanTimeToResolve")}</span>
          <span className="text-white font-semibold">
            {resolution.meanTimeToResolve}
          </span>
        </div>
      </div>
    </div>
  );
};
