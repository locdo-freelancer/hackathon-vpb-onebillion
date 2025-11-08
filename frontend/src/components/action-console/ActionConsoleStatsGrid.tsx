import React from "react";
import { ActionStatsCard } from "./ActionStatsCard";
import type { ActionConsoleStats } from "@/types/action-console.types";

interface ActionConsoleStatsGridProps {
  stats: ActionConsoleStats;
}

/**
 * Presentational component for Action Console stats grid
 * Single Responsibility: Only renders stats cards layout
 */
export const ActionConsoleStatsGrid: React.FC<ActionConsoleStatsGridProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-3 gap-6 mb-8">
      <ActionStatsCard
        icon="fa-check-circle"
        iconColor="text-green-400"
        iconBg="bg-green-500/20"
        value={stats.executed}
        label="Actions Executed"
        sublabel="Last 24h"
      />
      <ActionStatsCard
        icon="fa-clock"
        iconColor="text-cyan-400"
        iconBg="bg-cyan-500/20"
        value={stats.pending}
        label="Pending Actions"
        sublabel="Awaiting approval"
      />
      <ActionStatsCard
        icon="fa-xmark-circle"
        iconColor="text-red-400"
        iconBg="bg-red-500/20"
        value={stats.failed}
        label="Failed Actions"
        sublabel="Requires attention"
      />
    </div>
  );
};
