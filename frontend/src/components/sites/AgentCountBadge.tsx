import { useTranslations } from "@/hooks/useTranslations";
import React from "react";

interface AgentCountBadgeProps {
  count: number;
}

export const AgentCountBadge: React.FC<AgentCountBadgeProps> = ({ count }) => {
  const { t } = useTranslations("sites");
  const getCountColor = () => {
    if (count === 0) return "text-gray-500";
    if (count < 5) return "text-cyan-400";
    return "text-green-400";
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`text-2xl font-bold ${getCountColor()}`}>{count}</span>
      <span className="text-xs text-gray-400">{t("active")}</span>
    </div>
  );
};
