import React from "react";
import type { ThreatIndicator } from "@/types/threats.types";
import { ThreatRow } from "./ThreatRow";
import { ThreatCheckbox } from "./ThreatCheckbox";
import { ThreatsEmptyState } from "./ThreatsEmptyState";

interface ThreatsTableProps {
  threats: ThreatIndicator[];
  selectedIds: string[];
  onSelectThreat: (id: string) => void;
  onSelectAll: () => void;
  onThreatClick: (id: string) => void;
  totalCount: number;
}

/**
 * Threats Table Component
 * Single Responsibility: Render table structure and iterate over threats
 * Open/Closed: Uses composition for extensibility
 * Liskov Substitution: Can be replaced with any compatible table component
 * Interface Segregation: Clean props interface - data and handlers
 * Dependency Inversion: Depends on ThreatIndicator abstraction
 */
export const ThreatsTable: React.FC<ThreatsTableProps> = ({
  threats,
  selectedIds,
  onSelectThreat,
  onSelectAll,
  onThreatClick,
  totalCount,
}) => {
  const allSelected = threats.length > 0 && selectedIds.length === threats.length;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">
            Threat Indicators
          </h3>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">
              {totalCount.toLocaleString()} indicators found
            </span>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <i className="fas fa-refresh" />
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <i className="fas fa-columns" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-950/50">
            <tr className="text-left">
              <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                <ThreatCheckbox
                  checked={allSelected}
                  onChange={onSelectAll}
                  ariaLabel="Select all threats"
                />
              </th>
              <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Indicator
              </th>
              <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Severity
              </th>
              <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Confidence
              </th>
              <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Country
              </th>
              <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                First Seen
              </th>
              <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {threats.length === 0 ? (
              <ThreatsEmptyState />
            ) : (
              threats.map((threat) => (
                <ThreatRow
                  key={threat.id}
                  threat={threat}
                  isSelected={selectedIds.includes(threat.id)}
                  onSelect={onSelectThreat}
                  onClick={onThreatClick}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {threats.length > 0 && (
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between">
          <p className="text-sm text-gray-400">
            Showing {threats.length} of {totalCount.toLocaleString()} results
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-gray-400 hover:text-white border border-slate-800 rounded-lg hover:border-cyan-500 transition-colors">
              <i className="fas fa-chevron-left" />
            </button>
            <button className="px-3 py-1 bg-cyan-500 text-white rounded-lg">
              1
            </button>
            <button className="px-3 py-1 text-gray-400 hover:text-white border border-slate-800 rounded-lg hover:border-cyan-500 transition-colors">
              2
            </button>
            <button className="px-3 py-1 text-gray-400 hover:text-white border border-slate-800 rounded-lg hover:border-cyan-500 transition-colors">
              3
            </button>
            <span className="px-3 py-1 text-gray-400">...</span>
            <button className="px-3 py-1 text-gray-400 hover:text-white border border-slate-800 rounded-lg hover:border-cyan-500 transition-colors">
              {Math.ceil(totalCount / 10)}
            </button>
            <button className="px-3 py-1 text-gray-400 hover:text-white border border-slate-800 rounded-lg hover:border-cyan-500 transition-colors">
              <i className="fas fa-chevron-right" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
