import React from "react";

export type ConnectionPhase = "waiting" | "connected" | "registered";

interface ConnectionStatusProps {
  phase: ConnectionPhase;
  heartbeatTime?: string;
}

const STATUS_CONFIG: Record<
  ConnectionPhase,
  {
    icon: string;
    title: string;
    description: string;
    bgColor: string;
    borderColor: string;
    iconBg: string;
    textColor: string;
    dotColor: string;
    animate?: boolean;
  }
> = {
  waiting: {
    icon: "fas fa-clock",
    title: "Waiting for Agent",
    description: "Run the installation command above to begin",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/30",
    iconBg: "bg-yellow-500/20",
    textColor: "text-yellow-400",
    dotColor: "bg-yellow-400",
    animate: true,
  },
  connected: {
    icon: "fas fa-wifi",
    title: "Agent Connected",
    description: "Network connectivity established",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    iconBg: "bg-blue-500/20",
    textColor: "text-blue-400",
    dotColor: "bg-blue-400",
  },
  registered: {
    icon: "fas fa-check-circle",
    title: "Agent Registered",
    description: "Authentication successful, monitoring active",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
    iconBg: "bg-green-500/20",
    textColor: "text-green-400",
    dotColor: "bg-green-400",
  },
};

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  phase,
  heartbeatTime,
}) => {
  const status = STATUS_CONFIG[phase];

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        Connection Status
      </h3>

      <div className="space-y-4">
        <div
          className={`flex items-center gap-4 p-4 ${status.bgColor} border ${status.borderColor} rounded-lg`}
        >
          <div
            className={`w-10 h-10 ${status.iconBg} rounded-full flex items-center justify-center`}
          >
            <i className={`${status.icon} ${status.textColor}`} />
          </div>
          <div className="flex-1">
            <p className="text-white font-medium">{status.title}</p>
            <p className="text-sm text-gray-400">{status.description}</p>
          </div>
          <div
            className={`w-3 h-3 ${status.dotColor} rounded-full ${
              status.animate ? "animate-pulse" : ""
            }`}
          />
        </div>
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
