import React from "react";
import type { Site } from "@/types/sites.types";

interface SiteActionsProps {
  site: Site;
  onEdit: (site: Site) => void;
  onView: (site: Site) => void;
  onDelete: (site: Site) => void;
}

export const SiteActions: React.FC<SiteActionsProps> = ({
  site,
  onEdit,
  onView,
  onDelete,
}) => {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onEdit(site)}
        className="p-2 text-gray-400 hover:text-cyan-400 transition-colors"
        title="Edit site"
      >
        <i className="fas fa-edit" />
      </button>
      <button
        onClick={() => onView(site)}
        className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
        title="View details"
      >
        <i className="fas fa-eye" />
      </button>
      <button
        onClick={() => onDelete(site)}
        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
        title="Delete site"
      >
        <i className="fas fa-trash" />
      </button>
    </div>
  );
};
