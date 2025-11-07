import React from "react";
import Link from "next/link";

export interface RelatedIncident {
  id: string;
  title: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  date: string;
}

interface RelatedIncidentsCardProps {
  incidents: RelatedIncident[];
}

export const RelatedIncidentsCard: React.FC<RelatedIncidentsCardProps> = ({ incidents }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "text-red-400";
      case "High":
        return "text-orange-400";
      case "Medium":
        return "text-yellow-400";
      case "Low":
        return "text-blue-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <i className="fas fa-link text-cyan-500" />
        Related Incidents
      </h3>
      <div className="space-y-3">
        {incidents.map((incident) => (
          <Link
            key={incident.id}
            href={`/incidents/${incident.id}`}
            className="block p-3 bg-slate-950/50 border border-slate-800 rounded-lg hover:bg-slate-950 hover:border-cyan-500/30 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-white mb-1">{incident.id}</h4>
                <p className="text-xs text-gray-400 line-clamp-2 mb-2">{incident.title}</p>
                <p className="text-xs text-gray-500">{incident.date}</p>
              </div>
              <span className={`text-xs font-medium ${getSeverityColor(incident.severity)}`}>
                {incident.severity}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
