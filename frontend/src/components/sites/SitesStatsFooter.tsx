import React from "react";
import type { SitesData } from "@/types/sites.types";

interface SitesStatsFooterProps {
  data: SitesData;
  filteredCount: number;
}

/**
 * Sites Stats Footer Component
 * Single Responsibility: Display site statistics summary
 * Interface Segregation: Minimal props - only data and filtered count
 */
export const SitesStatsFooter: React.FC<SitesStatsFooterProps> = ({
  data,
  filteredCount,
}) => {
  return (
    <div className="mt-6 flex items-center justify-between text-sm text-gray-400">
      <div className="flex items-center gap-6">
        <span>
          Total Sites:{" "}
          <strong className="text-white">{data.totalSites}</strong>
        </span>
        <span>
          Active:{" "}
          <strong className="text-green-400">{data.activeSites}</strong>
        </span>
        <span>
          Warning:{" "}
          <strong className="text-yellow-400">{data.warningSites}</strong>
        </span>
        <span>
          Inactive:{" "}
          <strong className="text-gray-500">{data.inactiveSites}</strong>
        </span>
      </div>
      <span>
        Showing {filteredCount} of {data.totalSites} sites
      </span>
    </div>
  );
};
