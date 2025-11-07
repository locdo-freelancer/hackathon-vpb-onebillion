import React, { useState, useRef, useEffect } from "react";
import type { SitesFilter } from "@/types/sites.types";

interface FilterMenuProps {
  currentFilter: SitesFilter;
  onApply: (filter: SitesFilter) => void;
}

export const FilterMenu: React.FC<FilterMenuProps> = ({
  currentFilter,
  onApply,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempFilter, setTempFilter] = useState<SitesFilter>(currentFilter);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleApply = () => {
    onApply(tempFilter);
    setIsOpen(false);
  };

  const handleClear = () => {
    const clearedFilter: SitesFilter = {
      status: "all",
      agentCount: "any",
      searchQuery: "",
    };
    setTempFilter(clearedFilter);
    onApply(clearedFilter);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-slate-900 border border-slate-800 text-gray-300 rounded-lg hover:border-cyan-500/50 transition-colors flex items-center gap-2"
      >
        <i className="fas fa-filter" />
        <span>Filter</span>
        <i className="fas fa-chevron-down text-xs" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-lg shadow-xl z-50 p-4">
          <h4 className="text-sm font-semibold text-white mb-3">
            Filter Sites
          </h4>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Status</label>
              <select
                value={tempFilter.status}
                onChange={(e) =>
                  setTempFilter({
                    ...tempFilter,
                    status: e.target.value as SitesFilter["status"],
                  })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="warning">Warning</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1 block">
                Agent Count
              </label>
              <select
                value={tempFilter.agentCount}
                onChange={(e) =>
                  setTempFilter({
                    ...tempFilter,
                    agentCount: e.target.value as SitesFilter["agentCount"],
                  })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500"
              >
                <option value="any">Any</option>
                <option value="0">0 agents</option>
                <option value="1-5">1-5 agents</option>
                <option value="5+">5+ agents</option>
              </select>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleApply}
                className="flex-1 px-3 py-2 bg-cyan-500/20 text-cyan-400 text-sm rounded-lg hover:bg-cyan-500/30"
              >
                Apply
              </button>
              <button
                onClick={handleClear}
                className="flex-1 px-3 py-2 bg-slate-950 text-gray-400 text-sm rounded-lg hover:text-white"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
