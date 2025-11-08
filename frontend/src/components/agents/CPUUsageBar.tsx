import React from "react";
import { getCPUColor } from "@/config/agent-status.config";

interface CPUUsageBarProps {
  cpuUsage?: number;
}

/**
 * CPU Usage Bar Component
 * Single Responsibility: Renders CPU usage progress bar with color-coded levels
 * Interface Segregation: Only needs CPU usage percentage
 */
export const CPUUsageBar: React.FC<CPUUsageBarProps> = ({ cpuUsage = 0 }) => {
  return (
    <>
      <div className="flex justify-between items-center text-xs">
        <span className="text-gray-400">CPU</span>
        <span className="text-gray-300">{cpuUsage}%</span>
      </div>
      <div className="w-full bg-slate-950 rounded-full h-1 mt-1">
        <div
          className={`${getCPUColor(cpuUsage)} h-1 rounded-full`}
          style={{ width: `${cpuUsage}%` }}
        />
      </div>
    </>
  );
};
