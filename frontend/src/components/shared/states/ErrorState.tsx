import React from "react";
import { getErrorConfig } from "@/config/dashboard-states.config";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

/**
 * Shared Error State Component
 * 
 * Single Responsibility: Only renders error UI
 * Interface Segregation: Minimal props - message and retry handler
 * Reusability: Can be used across all pages
 * 
 * Usage:
 * ```tsx
 * if (error) return <ErrorState message={error.message} onRetry={() => refetch()} />;
 * ```
 */
export const ErrorState: React.FC<ErrorStateProps> = ({
  message,
  onRetry,
}) => {
  const config = getErrorConfig();

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center max-w-md">
        <div
          className={`inline-flex items-center justify-center w-16 h-16 ${config.iconBg} rounded-full mb-4`}
        >
          <i className={`${config.icon} text-2xl ${config.iconColor}`} />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">{config.title}</h2>
        <p className="text-gray-400 mb-4">{message || config.message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
};
