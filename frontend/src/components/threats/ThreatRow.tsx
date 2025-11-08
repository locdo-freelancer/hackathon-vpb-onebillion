import React from "react";
import type { ThreatIndicator } from "@/types/threats.types";
import { SeverityBadge, Badge } from "@/components/shared";
import { ConfidenceBar } from "./ConfidenceBar";
import { ThreatCheckbox } from "./ThreatCheckbox";
import { CountryFlag } from "./CountryFlag";
import { getSeverityConfig } from "@/config/threat-severity.config";

interface ThreatRowProps {
  threat: ThreatIndicator;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onClick: (id: string) => void;
}

/**
 * Threat Row Component
 * Single Responsibility: Render a single threat indicator row
 * Open/Closed: Uses configuration for severity highlighting
 * Liskov Substitution: Can be replaced with any compatible row component
 * Interface Segregation: Minimal props - threat data and handlers
 * Dependency Inversion: Depends on ThreatIndicator abstraction
 */
export const ThreatRow: React.FC<ThreatRowProps> = ({
  threat,
  isSelected,
  onSelect,
  onClick,
}) => {
  const severityConfig = getSeverityConfig(threat.severity);

  const getRowHighlight = () => {
    if (threat.severity === "critical" || threat.severity === "high") {
      return `${severityConfig.bgColor} border-l-4 ${severityConfig.borderColor}`;
    }
    if (threat.severity === "medium") {
      return `${severityConfig.bgColor} border-l-4 ${severityConfig.borderColor}`;
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
        <div
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.stopPropagation();
              onSelect(threat.id);
            }
          }}
          role="button"
          tabIndex={0}
        >
          <ThreatCheckbox
            checked={isSelected}
            onChange={() => onSelect(threat.id)}
            ariaLabel={`Select ${threat.indicator}`}
          />
        </div>
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
        <Badge 
          label={
            threat.type === "ip" ? "IP Address" :
            threat.type === "domain" ? "Domain" :
            threat.type === "url" ? "URL" :
            threat.type === "hash" ? "File Hash" : threat.type
          }
          variant={
            threat.type === "ip" ? "info" :
            threat.type === "domain" ? "success" :
            threat.type === "url" ? "info" :
            threat.type === "hash" ? "default" : "default"
          }
        />
      </td>

      {/* Severity */}
      <td className="px-6 py-4">
        <SeverityBadge severity={threat.severity.toUpperCase() as "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"} />
      </td>

      {/* Confidence */}
      <td className="px-6 py-4">
        <ConfidenceBar confidence={threat.confidence} />
      </td>

      {/* Country */}
      <td className="px-6 py-4">
        <CountryFlag
          countryCode={threat.countryCode}
          countryName={threat.country}
          flag={threat.countryFlag}
        />
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
