import React from "react";
import type { ThreatsStats } from "@/types/threats.types";
import { getSeverityConfig } from "@/config/threat-severity.config";
import { useTranslations } from "@/hooks/useTranslations";

interface ThreatsStatsBarProps {
  stats: ThreatsStats;
}

interface StatItemProps {
  label: string;
  value: number;
  color: string;
  icon?: string;
}

const StatItem: React.FC<StatItemProps> = ({ label, value, color, icon }) => (
  <div className="flex items-center gap-2">
    {icon && <i className={`fas ${icon} ${color}`} />}
    <span className="text-sm text-gray-400">{label}:</span>
    <strong className={`text-sm ${color}`}>{value}</strong>
  </div>
);

/**
 * Threats Stats Bar Component
 * Single Responsibility: Display threat statistics summary
 * Open/Closed: Uses configuration for severity colors
 * Dependency Inversion: Depends on ThreatsStats abstraction
 */
export const ThreatsStatsBar: React.FC<ThreatsStatsBarProps> = ({ stats }) => {
  const {t} = useTranslations("threats")
  const criticalConfig = getSeverityConfig("critical");
  const highConfig = getSeverityConfig("high");
  const mediumConfig = getSeverityConfig("medium");
  const lowConfig = getSeverityConfig("low");

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-lg px-6 py-3 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <StatItem label={t("total")} value={stats.total} color="text-white" icon="fa-shield-alt" />
          <div className="w-px h-4 bg-slate-700" />
          <StatItem
            label={t("critical")}
            value={stats.critical}
            color={criticalConfig.textColor}
            icon={criticalConfig.icon}
          />
          <StatItem
            label={t("high")}
            value={stats.high}
            color={highConfig.textColor}
            icon={highConfig.icon}
          />
          <StatItem
            label={t("medium")}
            value={stats.medium}
            color={mediumConfig.textColor}
            icon={mediumConfig.icon}
          />
          <StatItem
            label={t("low")}
            value={stats.low}
            color={lowConfig.textColor}
            icon={lowConfig.icon}
          />
        </div>
        <div className="flex items-center gap-2">
          <i className="fas fa-ban text-red-400" />
          <span className="text-sm text-gray-400">{t("blocked")}</span>
          <strong className="text-sm text-red-400">{stats.blocked}</strong>
        </div>
      </div>
    </div>
  );
};
