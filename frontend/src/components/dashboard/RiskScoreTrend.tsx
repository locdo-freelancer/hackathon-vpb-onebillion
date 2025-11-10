import { useTranslations } from "@/hooks/useTranslations";
import React from "react";

interface RiskScoreTrendProps {
  direction: "up" | "down";
  value: number;
}

/**
 * Risk Score Trend Indicator Component
 * Single Responsibility: Displays score trend with arrow and value
 * Interface Segregation: Only needs direction and value
 */
export const RiskScoreTrend: React.FC<RiskScoreTrendProps> = ({
  direction,
  value,
}) => {
  const {t} = useTranslations("dashboard")
  const isImproving = direction === "down";
  const colorClass = isImproving ? "text-green-400" : "text-red-400";

  return (
    <div className="flex items-center gap-2 mt-1">
      <i className={`fas fa-arrow-${direction} ${colorClass}`} />
      <span className={`text-sm font-medium ${colorClass}`}>
        {isImproving ? "-" : "+"}
        {Math.abs(value)} {t("fromYesterday")}
      </span>
    </div>
  );
};
