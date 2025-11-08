import React from "react";
import { ThreatsFilters, ThreatsTable, ThreatsStatsBar } from "@/components/threats";
import type { ThreatIndicator, ThreatsFilter, ThreatsStats } from "@/types/threats.types";

interface ThreatsPageContentProps {
  threats: ThreatIndicator[];
  filter: ThreatsFilter;
  selectedIndicators: string[];
  stats: ThreatsStats;
  onFilterChange: (filter: Partial<ThreatsFilter>) => void;
  onApplyFilters: () => void;
  onSelectThreat: (id: string) => void;
  onSelectAll: () => void;
  onThreatClick: (id: string) => void;
}

/**
 * Threats Page Content Component
 * Single Responsibility: Compose filters, stats, and table sections
 * Open/Closed Principle: Can be extended with new sections without modification
 * Dependency Inversion: Depends on abstractions (interfaces), not concrete implementations
 */
export const ThreatsPageContent: React.FC<ThreatsPageContentProps> = ({
  threats,
  filter,
  selectedIndicators,
  stats,
  onFilterChange,
  onApplyFilters,
  onSelectThreat,
  onSelectAll,
  onThreatClick,
}) => {
  return (
    <main className="flex-1 p-8 overflow-auto">
      {/* Filters Section */}
      <div className="mb-6">
        <ThreatsFilters
          filter={filter}
          onFilterChange={onFilterChange}
          onApply={onApplyFilters}
        />
      </div>

      {/* Stats Bar Section */}
      <ThreatsStatsBar stats={stats} />

      {/* Table Section */}
      <ThreatsTable
        threats={threats}
        selectedIds={selectedIndicators}
        onSelectThreat={onSelectThreat}
        onSelectAll={onSelectAll}
        onThreatClick={onThreatClick}
        totalCount={stats.total}
      />
    </main>
  );
};
