import React from "react";
import { ConnectionPhase } from "./ConnectionStatus";

interface AgentInstallHeaderProps {
  connectionPhase: ConnectionPhase;
}

const PHASE_CONFIG: Record<
  ConnectionPhase,
  { text: string; color: string; bgColor: string; borderColor: string }
> = {
  waiting: {
    text: "Waiting for Connection",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/20",
    borderColor: "border-yellow-500/30",
  },
  connected: {
    text: "Agent Connected",
    color: "text-blue-400",
    bgColor: "bg-blue-500/20",
    borderColor: "border-blue-500/30",
  },
  registered: {
    text: "Agent Registered",
    color: "text-green-400",
    bgColor: "bg-green-500/20",
    borderColor: "border-green-500/30",
  },
};

export const AgentInstallHeader: React.FC<AgentInstallHeaderProps> = ({
  connectionPhase,
}) => {
  const config = PHASE_CONFIG[connectionPhase];

  return (
    <header className="border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-xl">
      <div className="px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg shadow-lg shadow-cyan-500/20">
            <i className="fas fa-shield-halved text-lg text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">SecureVault</h1>
            <p className="text-xs text-gray-400">Agent Installation</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-lg border ${config.bgColor} ${config.borderColor}`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                connectionPhase === "waiting"
                  ? "bg-yellow-400 animate-pulse"
                  : connectionPhase === "connected"
                  ? "bg-blue-400"
                  : "bg-green-400"
              }`}
            />
            <span className={`text-sm font-medium ${config.color}`}>
              {config.text}
            </span>
          </div>
          <button className="text-gray-400 hover:text-white transition-colors">
            <i className="fas fa-question-circle text-lg" />
          </button>
        </div>
      </div>
    </header>
  );
};
