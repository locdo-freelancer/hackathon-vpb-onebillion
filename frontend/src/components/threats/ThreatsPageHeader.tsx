import React from "react";

interface ThreatsPageHeaderProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  onExport: () => void;
}

/**
 * Presentational component for Threats page header
 * Open/Closed Principle: Can be extended without modifying
 */
export const ThreatsPageHeader: React.FC<ThreatsPageHeaderProps> = ({
  searchQuery,
  onSearch,
  onExport,
}) => {
  return (
    <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl">
      <div className="px-8 py-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Threat Intelligence
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Monitor and analyze threat indicators across your network
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search indicators..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="w-64 px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
            <i className="fas fa-search absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>

          {/* Export Button */}
          <button
            onClick={onExport}
            className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
          >
            <i className="fas fa-download mr-2" />
            Export
          </button>
        </div>
      </div>
    </div>
  );
};
