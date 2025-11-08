import React from "react";

interface ProgressBarProps {
  percentage: number;
  color?: string;
  bgColor?: string;
  height?: "sm" | "md" | "lg";
  animated?: boolean;
  showLabel?: boolean;
  label?: string;
}

/**
 * Shared Progress Bar Component
 * 
 * Single Responsibility: Renders a progress bar with percentage
 * Interface Segregation: Flexible props for different use cases
 * Reusability: Can be used for any progress indication
 * 
 * Usage:
 * ```tsx
 * <ProgressBar percentage={75} color="bg-cyan-400" showLabel />
 * <ProgressBar percentage={updateProgress} color="bg-yellow-400" animated />
 * ```
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  color = "bg-cyan-400",
  bgColor = "bg-slate-950",
  height = "sm",
  animated = false,
  showLabel = false,
  label,
}) => {
  const heightClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  return (
    <div className="w-full space-y-1">
      {showLabel && (
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-400">{label || "Progress"}</span>
          <span className="text-gray-300">{percentage}%</span>
        </div>
      )}
      <div className={`w-full ${bgColor} rounded-full ${heightClasses[height]}`}>
        <div
          className={`${color} ${heightClasses[height]} rounded-full ${
            animated ? "transition-all duration-300" : ""
          }`}
          style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
        />
      </div>
    </div>
  );
};
