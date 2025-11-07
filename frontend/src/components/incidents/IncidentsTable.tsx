import React from "react";
import type { Incident } from "@/types/incidents.types";
import { IncidentRow } from "./IncidentRow";

interface IncidentsTableProps {
  incidents: Incident[];
  selectedIds: string[];
  onSelectIncident: (id: string) => void;
  onSelectAll: () => void;
  onIncidentClick: (id: string) => void;
  totalCount: number;
}

export const IncidentsTable: React.FC<IncidentsTableProps> = ({
  incidents,
  selectedIds,
  onSelectIncident,
  onSelectAll,
  onIncidentClick,
  totalCount,
}) => {
  const allSelected = incidents.length > 0 && selectedIds.length === incidents.length;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Security Incidents</h3>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">
              {totalCount} incidents found
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
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onSelectAll}
                  className="rounded border-slate-800 bg-slate-950"
                />
              </th>
              <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Severity
              </th>
              <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                AI Summary
              </th>
              <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Assignee
              </th>
              <th className="px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {incidents.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center">
                  <div className="text-gray-400">
                    <i className="fas fa-exclamation-triangle text-4xl mb-4 opacity-50" />
                    <p className="text-sm">No incidents found</p>
                  </div>
                </td>
              </tr>
            ) : (
              incidents.map((incident) => (
                <IncidentRow
                  key={incident.id}
                  incident={incident}
                  isSelected={selectedIds.includes(incident.id)}
                  onSelect={onSelectIncident}
                  onClick={onIncidentClick}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {incidents.length > 0 && (
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Showing {incidents.length} of {totalCount} incidents
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 bg-slate-950 border border-slate-800 rounded text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              disabled
            >
              Previous
            </button>
            <button className="px-3 py-1 bg-cyan-500 text-white rounded">1</button>
            <button className="px-3 py-1 bg-slate-950 border border-slate-800 rounded text-gray-400 hover:text-white transition-colors">
              2
            </button>
            <button className="px-3 py-1 bg-slate-950 border border-slate-800 rounded text-gray-400 hover:text-white transition-colors">
              3
            </button>
            <span className="px-2 text-gray-400">...</span>
            <button className="px-3 py-1 bg-slate-950 border border-slate-800 rounded text-gray-400 hover:text-white transition-colors">
              {Math.ceil(totalCount / 10)}
            </button>
            <button className="px-3 py-1 bg-slate-950 border border-slate-800 rounded text-gray-400 hover:text-white transition-colors">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
