import React from "react";
import { getLoadingConfig } from "@/config/dashboard-states.config";

/**
 * Shared Loading State Component
 * 
 * Single Responsibility: Only renders loading UI
 * Interface Segregation: No props needed, uses config
 * Reusability: Can be used across all pages
 * 
 * Usage:
 * ```tsx
 * if (isLoading) return <LoadingState />;
 * ```
 */
export const LoadingState: React.FC = () => {
  const config = getLoadingConfig();

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div
          className={`inline-flex items-center justify-center w-16 h-16 ${config.iconBg} rounded-full mb-4 ${config.animation}`}
        >
          <i className={`${config.icon} text-2xl ${config.iconColor}`} />
        </div>
        <p className="text-white font-medium">{config.title}</p>
      </div>
    </div>
  );
};
