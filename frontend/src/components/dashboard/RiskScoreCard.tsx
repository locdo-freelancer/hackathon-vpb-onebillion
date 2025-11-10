import React from "react";
import type { RiskScore, RiskMetrics } from "@/types/dashboard.types";
import {
  getRiskScoreIconConfig,
  getMetricsConfig,
} from "@/config/risk-score.config";
import { RiskMetricCard } from "./RiskMetricCard";
import { RiskScoreTrend } from "./RiskScoreTrend";
import { RiskLevelBar } from "./RiskLevelBar";

interface RiskScoreCardProps {
  riskScore: RiskScore;
  metrics: RiskMetrics;
}

/**
 * Risk Score Card Component
 *
 * SOLID Principles Applied:
 * - Single Responsibility: Only manages risk score card layout
 * - Open/Closed: New metrics added via config, not code modification
 * - Dependency Inversion: Depends on config abstraction, not concrete data
 * - Liskov Substitution: Atomic components are interchangeable
 */
export const RiskScoreCard: React.FC<RiskScoreCardProps> = ({
  riskScore,
  metrics,
}) => {
  const { score, maxScore, level, trend, lastUpdated } = riskScore;
  const scorePercentage = (score / maxScore) * 100;
  const iconConfig = getRiskScoreIconConfig();
  const metricsConfig = getMetricsConfig();

  return (
    <div className="bg-linear-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-xl p-8 relative overflow-hidden">
      {/* Background Effect (OCP - visual enhancement) */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 flex items-center justify-between">
        {/* Left Section - Score Display (SRP - score presentation) */}
        <div className="flex-1">
          {/* Header with Icon (DIP - uses config) */}
          <div className="flex items-center gap-3 mb-2">
            <div
              className={`${iconConfig.size} ${iconConfig.bg} rounded-lg flex items-center justify-center ${iconConfig.shadow}`}
            >
              <i
                className={`${iconConfig.icon} ${iconConfig.iconSize} text-white`}
              />
            </div>
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wide">
                Global Risk Score
              </p>
              <p className="text-xs text-gray-500">
                Last updated: {lastUpdated}
              </p>
            </div>
          </div>

          {/* Score Display with Trend (LSP - composed components) */}
          <div className="flex items-end gap-4 mt-6">
            <div className="text-6xl font-bold text-white">
              {isNaN(score) || score === null || score === undefined
                ? 0
                : score}
            </div>

            <div className="mb-2">
              <span className="text-2xl text-gray-400">/{maxScore}</span>
              <RiskScoreTrend direction={trend.direction} value={trend.value} />
            </div>
          </div>

          {/* Risk Level Progress Bar (ISP - atomic component) */}
          <RiskLevelBar level={level} scorePercentage={scorePercentage} />
        </div>

        {/* Right Section - Metrics Grid (OCP - config-driven rendering) */}
        <div className="flex flex-col gap-4 ml-12">
          {metricsConfig.map((config) => (
            <RiskMetricCard
              key={config.key}
              config={config}
              value={metrics[config.key]}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
