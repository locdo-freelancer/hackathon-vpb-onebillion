import React from "react";
import type { Incident } from "@/types/incidents.types";
import { IncidentSeverityBadge } from "./IncidentSeverityBadge";
import { IncidentStatusBadge } from "./IncidentStatusBadge";
import { IncidentTypeBadge } from "./IncidentTypeBadge";

interface IncidentRowProps {
  incident: Incident;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onClick: (id: string) => void;
}

export const IncidentRow: React.FC<IncidentRowProps> = ({
  incident,
  isSelected,
  onSelect,
  onClick,
}) => {
  const getRowHighlight = () => {
    if (incident.severity === "critical") {
      return "bg-red-500/10 border-l-4 border-red-500";
    }
    if (incident.severity === "high") {
      return "bg-orange-500/10 border-l-4 border-orange-500";
    }
    if (incident.severity === "medium") {
      return "bg-yellow-500/10 border-l-4 border-yellow-500";
    }
    return "";
  };

  return (
    <tr
      className={`hover:bg-slate-950/30 transition-colors cursor-pointer ${getRowHighlight()}`}
      onClick={() => onClick(incident.id)}
    >
      {/* Checkbox */}
      <td className="px-6 py-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation();
            onSelect(incident.id);
          }}
          onClick={(e) => e.stopPropagation()}
          className="rounded border-slate-800 bg-slate-950"
        />
      </td>

      {/* ID */}
      <td className="px-6 py-4">
        <span className="text-sm font-medium text-white">{incident.incidentId}</span>
      </td>

      {/* Severity */}
      <td className="px-6 py-4">
        <IncidentSeverityBadge severity={incident.severity} />
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <IncidentStatusBadge status={incident.status} />
      </td>

      {/* Date */}
      <td className="px-6 py-4 text-sm text-gray-300">{incident.dateCreated}</td>

      {/* Type */}
      <td className="px-6 py-4">
        <IncidentTypeBadge type={incident.type} />
      </td>

      {/* AI Summary */}
      <td className="px-6 py-4 max-w-xs">
        <div className="flex items-start gap-2">
          <i className="fas fa-robot text-cyan-500 mt-1 text-xs" />
          <p className="text-sm text-gray-300 truncate">{incident.aiSummary}</p>
        </div>
      </td>

      {/* Assignee */}
      <td className="px-6 py-4">
        {incident.assignee ? (
          <div className="flex items-center gap-2">
            <img
              src={incident.assignee.avatar}
              alt={incident.assignee.name}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm text-gray-300">{incident.assignee.name}</span>
          </div>
        ) : (
          <span className="text-sm text-gray-500 italic">Unassigned</span>
        )}
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick(incident.id);
            }}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            title="View details"
          >
            <i className="fas fa-eye" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Edit action
            }}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            title="Edit incident"
          >
            <i className="fas fa-edit" />
          </button>
        </div>
      </td>
    </tr>
  );
};
