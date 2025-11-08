import React from "react";

interface ThreatsEmptyStateProps {
  message?: string;
  icon?: string;
  actionText?: string;
  onAction?: () => void;
}

/**
 * Threats Empty State Component
 * Single Responsibility: Display empty state when no threats are found
 * Open/Closed: Customizable via props
 */
export const ThreatsEmptyState: React.FC<ThreatsEmptyStateProps> = ({
  message = "No threat indicators found",
  icon = "fa-shield-alt",
  actionText,
  onAction,
}) => {
  return (
    <tr>
      <td colSpan={8} className="px-6 py-16 text-center">
        <div className="flex flex-col items-center gap-4 text-gray-400">
          <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center">
            <i className={`fas ${icon} text-3xl opacity-50`} />
          </div>
          <p className="text-sm">{message}</p>
          {actionText && onAction && (
            <button
              onClick={onAction}
              className="mt-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors"
            >
              {actionText}
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};
