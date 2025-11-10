/**
 * Risk Score Configuration
 * 
 * Single Responsibility Principle (SRP):
 * - Only defines risk score and metrics UI configurations
 * 
 * Open/Closed Principle (OCP):
 * - New risk levels or metric types can be added via configuration
 */

import { useTranslations } from "@/hooks/useTranslations";

export type RiskLevel = "LOW" | "MODERATE" | "HIGH" | "CRITICAL";

export interface RiskLevelConfig {
  color: string;
  bgColor: string;
}

export interface MetricCardConfig {
  key: "critical" | "warnings" | "informational";
  label: string;
  icon: string;
  iconBg: string;
  iconColor: string;
}

/**
 * Risk level color configuration
 */
export const RISK_LEVEL_CONFIG: Record<RiskLevel, RiskLevelConfig> = {
  LOW: {
    color: "text-green-400",
    bgColor: "from-green-500",
  },
  MODERATE: {
    color: "text-yellow-400",
    bgColor: "from-yellow-500",
  },
  HIGH: {
    color: "text-orange-400",
    bgColor: "from-orange-500",
  },
  CRITICAL: {
    color: "text-red-400",
    bgColor: "from-red-500",
  },
};

/**
 * Metrics cards configuration
 */
export const useRiskMetricsConfig = (): MetricCardConfig[] => {
  const { t } = useTranslations("dashboard");

  return [
    {
      key: "critical",
      label: t("critical"), 
      icon: "fas fa-exclamation-triangle",
      iconBg: "bg-red-500/20",
      iconColor: "text-red-400",
    },
    {
      key: "warnings",
      label: t("warnings"),
      icon: "fas fa-exclamation-circle",
      iconBg: "bg-yellow-500/20",
      iconColor: "text-yellow-400",
    },
    {
      key: "informational",
      label: t("informational"),
      icon: "fas fa-info-circle",
      iconBg: "bg-blue-500/20",
      iconColor: "text-blue-400",
    },
  ];
};

/**
 * Risk score card main icon configuration
 */
export const RISK_SCORE_ICON_CONFIG = {
  icon: "fas fa-shield-halved",
  bg: "bg-gradient-to-br from-cyan-500 to-cyan-600",
  shadow: "shadow-lg shadow-cyan-500/20",
  size: "w-12 h-12",
  iconSize: "text-xl",
};

/**
 * Get risk level configuration
 * @param level - Risk level
 * @returns Risk level config object
 */
export const getRiskLevelConfig = (level: RiskLevel): RiskLevelConfig => {
  return RISK_LEVEL_CONFIG[level] || RISK_LEVEL_CONFIG.LOW;
};

/**
 * Get all metrics configurations
 * @returns Array of metric card configurations
 * @deprecated Use useRiskMetricsConfig hook instead
 */
export const getMetricsConfig = (): MetricCardConfig[] => {
  // This function is deprecated. Use useRiskMetricsConfig hook in components instead.
  // Returning empty array as this should not be used outside React components.
  return [];
};

/**
 * Get risk score icon configuration
 * @returns Icon configuration object
 */
export const getRiskScoreIconConfig = () => {
  return RISK_SCORE_ICON_CONFIG;
};
