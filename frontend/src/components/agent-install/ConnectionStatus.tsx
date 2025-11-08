import React from "react";
import { StatusCard } from "./StatusCard";
import { getStatusConfig } from "@/config/connection-status.config";

export type ConnectionPhase = "waiting" | "connected" | "registered";

interface ConnectionStatusProps {
  phase: ConnectionPhase;
  heartbeatTime?: string;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  phase,
  heartbeatTime,
}) => {
  const status = getStatusConfig(phase);

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        Connection Status
      </h3>

      <div className="space-y-4">
        <StatusCard config={status} />
      </div>

      {phase === "registered" && heartbeatTime && (
        <div className="mt-6 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <i className="fas fa-heartbeat text-cyan-400" />
              <span className="text-sm font-medium text-white">
                Last Heartbeat
              </span>
            </div>
            <span className="text-sm text-gray-400">{heartbeatTime}</span>
          </div>
        </div>
      )}
    </div>
  );
};
