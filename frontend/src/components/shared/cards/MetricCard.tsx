import React from "react";

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: string;
  iconBg: string;
  iconColor: string;
  trend?: {
    value: number;
    direction: "up" | "down";
  };
  size?: "sm" | "md" | "lg";
}

/**
 * Shared Metric Card Component
 * 
 * Single Responsibility: Renders a metric display card
 * Interface Segregation: Minimal props for metric display
 * Reusability: Can be used for any metric/stat display
 * 
 * Usage:
 * ```tsx
 * <MetricCard
 *   label="Total Users"
 *   value={1234}
 *   icon="fas fa-users"
 *   iconBg="bg-cyan-500/20"
 *   iconColor="text-cyan-400"
 * />
 * ```
 */
export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  icon,
  iconBg,
  iconColor,
  trend,
  size = "md",
}) => {
  const sizeConfig = {
    sm: {
      container: "p-3",
      icon: "w-8 h-8 text-sm",
      value: "text-lg",
      label: "text-xs",
    },
    md: {
      container: "p-4",
      icon: "w-10 h-10 text-base",
      value: "text-2xl",
      label: "text-xs",
    },
    lg: {
      container: "p-6",
      icon: "w-12 h-12 text-lg",
      value: "text-3xl",
      label: "text-sm",
    },
  };

  const config = sizeConfig[size];

  return (
    <div
      className={`bg-slate-950/50 border border-slate-800 rounded-lg ${config.container} min-w-[180px]`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`${config.icon} ${iconBg} rounded-lg flex items-center justify-center shrink-0`}
        >
          <i className={`${icon} ${iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`${config.value} font-bold text-white truncate`}>
            {value}
          </p>
          <p className={`${config.label} text-gray-400 truncate`}>{label}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-1">
              <i
                className={`fas fa-arrow-${trend.direction} text-xs ${
                  trend.direction === "up" ? "text-green-400" : "text-red-400"
                }`}
              />
              <span
                className={`text-xs ${
                  trend.direction === "up" ? "text-green-400" : "text-red-400"
                }`}
              >
                {trend.value}%
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
