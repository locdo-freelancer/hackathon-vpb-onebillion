import React from "react";
import { useRouter } from "next/navigation";

interface IncidentDetailHeaderProps {
  incidentId: string;
  title: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  status: "Open" | "Investigating" | "Resolved" | "Closed";
  createdAt: string;
  onEdit?: () => void;
  onResolve?: () => void;
}

export const IncidentDetailHeader: React.FC<IncidentDetailHeaderProps> = ({
  incidentId,
  title,
  severity,
  status,
  createdAt,
  onEdit,
  onResolve,
}) => {
  const router = useRouter();

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "High":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "Medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Low":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "Investigating":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Resolved":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Closed":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <i className="fas fa-arrow-left" />
          <span>Back to Incidents</span>
        </button>
        <div className="flex items-center gap-3">
          {onEdit && (
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-slate-800 text-white border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <i className="fas fa-edit mr-2" />
              Edit
            </button>
          )}
          {onResolve && status !== "Resolved" && status !== "Closed" && (
            <button
              onClick={onResolve}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <i className="fas fa-check mr-2" />
              Resolve Incident
            </button>
          )}
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
          <i className="fas fa-exclamation-triangle text-red-400 text-xl" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-white">{incidentId}</h1>
            <span className={`px-3 py-1 text-sm font-medium border rounded-full ${getSeverityStyles(severity)}`}>
              {severity}
            </span>
            <span className={`px-3 py-1 text-sm font-medium border rounded-full ${getStatusStyles(status)}`}>
              {status}
            </span>
          </div>
          <h2 className="text-lg text-gray-300 mb-2">{title}</h2>
          <p className="text-sm text-gray-500">
            Created: {new Date(createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    </div>
  );
};
