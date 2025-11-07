import React from "react";
import type { RiskScore, RiskMetrics } from "@/types/dashboard.types";

interface RiskScoreCardProps {
  riskScore: RiskScore;
  metrics: RiskMetrics;
}

const RISK_LEVEL_CONFIG = {
  LOW: { color: "text-green-400", bgColor: "from-green-500" },
  MODERATE: { color: "text-yellow-400", bgColor: "from-yellow-500" },
  HIGH: { color: "text-orange-400", bgColor: "from-orange-500" },
  CRITICAL: { color: "text-red-400", bgColor: "from-red-500" },
};

export const RiskScoreCard: React.FC<RiskScoreCardProps> = ({
  riskScore,
  metrics,
}) => {
  const { score, maxScore, level, trend, lastUpdated } = riskScore;
  const levelConfig = RISK_LEVEL_CONFIG[level];
  const scorePercentage = (score / maxScore) * 100;

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-xl p-8 relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 flex items-center justify-between">
        {/* Left Section - Score */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <i className="fas fa-shield-halved text-xl text-white" />
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

          <div className="flex items-end gap-4 mt-6">
            <div className="text-6xl font-bold text-white">{score}</div>
            <div className="mb-2">
              <span className="text-2xl text-gray-400">/{maxScore}</span>
              <div className="flex items-center gap-2 mt-1">
                <i
                  className={`fas fa-arrow-${trend.direction} ${
                    trend.direction === "down"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    trend.direction === "down"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {trend.direction === "down" ? "-" : "+"}
                  {Math.abs(trend.value)} from yesterday
                </span>
              </div>
            </div>
          </div>

          {/* Risk Level Indicator */}
          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Risk Level</span>
              <span className={`${levelConfig.color} font-semibold`}>
                {level}
              </span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2">
              <div
                className={`bg-gradient-to-r ${levelConfig.bgColor} via-yellow-500 to-red-500 h-2 rounded-full transition-all duration-500`}
                style={{ width: `${scorePercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Section - Metrics */}
        <div className="flex flex-col gap-4 ml-12">
          {/* Critical Issues */}
          <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-4 min-w-[200px]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                <i className="fas fa-exclamation-triangle text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {metrics.critical}
                </p>
                <p className="text-xs text-gray-400">Critical Issues</p>
              </div>
            </div>
          </div>

          {/* Warnings */}
          <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-4 min-w-[200px]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <i className="fas fa-exclamation-circle text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {metrics.warnings}
                </p>
                <p className="text-xs text-gray-400">Warnings</p>
              </div>
            </div>
          </div>

          {/* Informational */}
          <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-4 min-w-[200px]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <i className="fas fa-info-circle text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {metrics.informational}
                </p>
                <p className="text-xs text-gray-400">Informational</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
