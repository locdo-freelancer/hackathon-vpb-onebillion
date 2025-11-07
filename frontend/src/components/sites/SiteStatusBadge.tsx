import React from "react";
import type { SiteStatus } from "@/types/sites.types";

interface SiteStatusBadgeProps {
  status: SiteStatus;
}

export const SiteStatusBadge: React.FC<SiteStatusBadgeProps> = ({ status }) => {
  const statusConfig = {
    active: {
      bgColor: "bg-green-500/20",
      textColor: "text-green-400",
      label: "Active",
    },
    warning: {
      bgColor: "bg-yellow-500/20",
      textColor: "text-yellow-400",
      label: "Warning",
    },
    inactive: {
      bgColor: "bg-gray-500/20",
      textColor: "text-gray-400",
      label: "Inactive",
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={`px-3 py-1 ${config.bgColor} ${config.textColor} text-xs font-semibold rounded-full flex items-center gap-1 w-fit`}
    >
      <i className="fas fa-circle text-[6px]" />
      {config.label}
    </span>
  );
};
