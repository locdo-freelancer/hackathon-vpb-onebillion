import React from "react";

interface EmptyStateProps {
  icon?: string;
  title?: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Shared Empty State Component
 * 
 * Single Responsibility: Renders empty state UI
 * Interface Segregation: Flexible props for different contexts
 * Reusability: Can be used when any list/data is empty
 * 
 * Usage:
 * ```tsx
 * <EmptyState
 *   icon="fas fa-inbox"
 *   title="No items found"
 *   message="Try adjusting your filters"
 * />
 * ```
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = "fas fa-inbox",
  title = "No data available",
  message = "There is no data to display at the moment.",
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
        <i className={`${icon} text-2xl text-gray-400`} />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm mb-6 max-w-md">{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
