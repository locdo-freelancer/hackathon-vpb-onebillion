import React from "react";

interface IncidentOverviewCardProps {
  assignee?: {
    id?: string;
    name: string;
    avatar: string;
  } | null;
  incidentType: string;
  sourceIP?: string;
  destinationIP?: string;
  protocol?: string;
  lastUpdated: string;
  severity?: "critical" | "high" | "medium" | "low";
  status?: "open" | "investigating" | "resolved" | "closed";
  createdAt?: string;
}

export const IncidentOverviewCard: React.FC<IncidentOverviewCardProps> = ({
  assignee,
  incidentType,
  sourceIP,
  destinationIP,
  protocol,
  lastUpdated,
  severity,
  status,
  createdAt,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Incident Overview</h3>
      <div className="grid grid-cols-4 gap-6">
        <div>
          <p className="text-sm text-gray-400 mb-1">Assignee</p>
          {assignee ? (
            <div className="flex items-center gap-2">
              {assignee.avatar ? (
                <img
                  src={assignee.avatar}
                  alt={assignee.name}
                  className="w-6 h-6 rounded-full"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center text-xs text-white">
                  {assignee.name.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-white">{assignee.name}</span>
            </div>
          ) : (
            <span className="text-gray-500 italic">Unassigned</span>
          )}
        </div>
        <div>
          <p className="text-sm text-gray-400 mb-1">Type</p>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400">
            {incidentType}
          </span>
        </div>
        {sourceIP && (
          <div>
            <p className="text-sm text-gray-400 mb-1">Source IP</p>
            <p className="text-white font-mono text-sm">{sourceIP}</p>
          </div>
        )}
        {destinationIP && (
          <div>
            <p className="text-sm text-gray-400 mb-1">Destination IP</p>
            <p className="text-white font-mono text-sm">{destinationIP}</p>
          </div>
        )}
        {protocol && (
          <div>
            <p className="text-sm text-gray-400 mb-1">Protocol</p>
            <p className="text-white">{protocol}</p>
          </div>
        )}
        <div>
          <p className="text-sm text-gray-400 mb-1">Last Updated</p>
          <p className="text-white">{lastUpdated}</p>
        </div>
      </div>
    </div>
  );
};
