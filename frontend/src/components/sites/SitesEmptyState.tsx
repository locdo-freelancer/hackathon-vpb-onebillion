import React from "react";

interface SitesEmptyStateProps {
  message?: string;
  icon?: string;
}

/**
 * Sites Empty State Component
 * Single Responsibility: Display empty state when no sites are available
 * Open/Closed: Open for extension (custom messages/icons)
 */
export const SitesEmptyState: React.FC<SitesEmptyStateProps> = ({
  message = "No sites found",
  icon = "fa-server",
}) => {
  return (
    <tr>
      <td colSpan={7} className="px-6 py-12 text-center">
        <div className="text-gray-400">
          <i className={`fas ${icon} text-4xl mb-4 opacity-50`} />
          <p className="text-sm">{message}</p>
        </div>
      </td>
    </tr>
  );
};
