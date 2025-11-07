import React from "react";

interface RawLogsCardProps {
  logs: string[];
}

export const RawLogsCard: React.FC<RawLogsCardProps> = ({ logs }) => {
  const formatLogLine = (log: string) => {
    // Extract timestamp, level, and message
    const timestampMatch = log.match(/\[([\d-:\s]+)\]/);
    const levelMatch = log.match(/\[(ALERT|NETWORK|REGISTRY|PROCESS|DNS|ERROR|INFO|WARNING)\]/);
    
    const timestamp = timestampMatch ? timestampMatch[1] : "";
    const level = levelMatch ? levelMatch[1] : "";
    const message = log.replace(/\[[\d-:\s]+\]/, "").replace(/\[(ALERT|NETWORK|REGISTRY|PROCESS|DNS|ERROR|INFO|WARNING)\]/, "").trim();

    const getLevelColor = (level: string) => {
      switch (level) {
        case "ALERT":
        case "ERROR":
        case "REGISTRY":
          return "text-red-400";
        case "NETWORK":
        case "WARNING":
          return "text-orange-400";
        case "PROCESS":
          return "text-purple-400";
        case "DNS":
          return "text-cyan-400";
        case "INFO":
          return "text-blue-400";
        default:
          return "text-yellow-400";
      }
    };

    return (
      <div className="text-gray-400">
        {timestamp && <span className="text-red-400">[{timestamp}]</span>}{" "}
        {level && <span className={getLevelColor(level)}>[{level}]</span>}{" "}
        <span className="text-white">{message}</span>
      </div>
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Raw Logs</h3>
      <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-sm overflow-x-auto">
        <div className="space-y-1">
          {logs.map((log, index) => (
            <div key={index}>{formatLogLine(log)}</div>
          ))}
        </div>
      </div>
    </div>
  );
};
