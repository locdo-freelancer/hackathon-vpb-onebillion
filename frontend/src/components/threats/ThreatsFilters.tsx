import React from "react";
import type { ThreatsFilter } from "@/types/threats.types";

interface ThreatsFiltersProps {
  filter: ThreatsFilter;
  onFilterChange: (filter: Partial<ThreatsFilter>) => void;
  onApply: () => void;
}

export const ThreatsFilters: React.FC<ThreatsFiltersProps> = ({
  filter,
  onFilterChange,
  onApply,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Filters</h3>

      <div className="grid grid-cols-6 gap-4">
        {/* Severity Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Severity
          </label>
          <select
            value={filter.severity}
            onChange={(e) =>
              onFilterChange({
                severity: e.target.value as ThreatsFilter["severity"],
              })
            }
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Type
          </label>
          <select
            value={filter.type}
            onChange={(e) =>
              onFilterChange({ type: e.target.value as ThreatsFilter["type"] })
            }
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All</option>
            <option value="ip">IP Address</option>
            <option value="domain">Domain</option>
            <option value="url">URL</option>
            <option value="hash">File Hash</option>
          </select>
        </div>

        {/* Country Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Country
          </label>
          <select
            value={filter.country}
            onChange={(e) => onFilterChange({ country: e.target.value })}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="">All</option>
            <option value="US">United States</option>
            <option value="CN">China</option>
            <option value="RU">Russia</option>
            <option value="IR">Iran</option>
            <option value="KP">North Korea</option>
            <option value="BR">Brazil</option>
            <option value="UA">Ukraine</option>
            <option value="NG">Nigeria</option>
          </select>
        </div>

        {/* IP Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            IP Range
          </label>
          <input
            type="text"
            placeholder="e.g. 192.168.1.0/24"
            value={filter.ipRange}
            onChange={(e) => onFilterChange({ ipRange: e.target.value })}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Time Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Time Range
          </label>
          <select
            value={filter.timeRange}
            onChange={(e) =>
              onFilterChange({
                timeRange: e.target.value as ThreatsFilter["timeRange"],
              })
            }
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>

        {/* Apply Button */}
        <div className="flex items-end">
          <button
            onClick={onApply}
            className="w-full px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
          >
            <i className="fas fa-filter mr-2" />
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};
