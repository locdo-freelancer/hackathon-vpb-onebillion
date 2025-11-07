import React from "react";
import type { ThreatIndicator } from "@/types/threats.types";
import { SeverityBadge } from "./SeverityBadge";
import { TypeBadge } from "./TypeBadge";
import { ConfidenceBar } from "./ConfidenceBar";

interface ThreatRowProps {
  threat: ThreatIndicator;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onClick: (id: string) => void;
}

export const ThreatRow: React.FC<ThreatRowProps> = ({
  threat,
  isSelected,
  onSelect,
  onClick,
}) => {
  const getRowHighlight = () => {
    if (threat.severity === "critical") {
      return "bg-red-500/10 border-l-4 border-red-500";
    }
    if (threat.severity === "high") {
      return "bg-orange-500/10 border-l-4 border-orange-500";
    }
    if (threat.severity === "medium") {
      return "bg-yellow-500/10 border-l-4 border-yellow-500";
    }
    return "";
  };

  return (
    <tr
      className={`hover:bg-slate-950/30 transition-colors cursor-pointer ${getRowHighlight()}`}
      onClick={() => onClick(threat.id)}
    >
      {/* Checkbox */}
      <td className="px-6 py-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation();
            onSelect(threat.id);
          }}
          onClick={(e) => e.stopPropagation()}
          className="rounded border-slate-800 bg-slate-950"
        />
      </td>

      {/* Indicator */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <i className={`${threat.icon} ${threat.iconColor}`} />
          <div>
            <p className="text-sm font-medium text-white truncate max-w-xs">
              {threat.indicator}
            </p>
            <p className="text-xs text-gray-400">{threat.description}</p>
          </div>
        </div>
      </td>

      {/* Type */}
      <td className="px-6 py-4">
        <TypeBadge type={threat.type} />
      </td>

      {/* Severity */}
      <td className="px-6 py-4">
        <SeverityBadge severity={threat.severity} />
      </td>

      {/* Confidence */}
      <td className="px-6 py-4">
        <ConfidenceBar confidence={threat.confidence} />
      </td>

      {/* Country */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">{threat.countryFlag}</span>
          <span className="text-sm text-gray-300">{threat.country}</span>
        </div>
      </td>

      {/* First Seen */}
      <td className="px-6 py-4 text-sm text-gray-300">{threat.firstSeen}</td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Block action
            }}
            className="p-1 text-gray-400 hover:text-red-400 transition-colors"
            title="Block indicator"
          >
            <i className="fas fa-ban" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Flag action
            }}
            className="p-1 text-gray-400 hover:text-yellow-400 transition-colors"
            title="Flag indicator"
          >
            <i className="fas fa-flag" />
          </button>
        </div>
      </td>
    </tr>
  );
};
