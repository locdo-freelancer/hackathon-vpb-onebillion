import React from "react";
import { ConnectionPhase } from "./ConnectionStatus";
import { PhaseIndicator } from "./PhaseIndicator";
import { getPhaseConfig } from "@/config/agent-header.config";

interface AgentInstallHeaderProps {
  connectionPhase: ConnectionPhase;
}

export const AgentInstallHeader: React.FC<AgentInstallHeaderProps> = ({
  connectionPhase,
}) => {
  // Dependency Injection: Configuration injected via function
  const config = getPhaseConfig(connectionPhase);

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
          {/* Liskov Substitution: PhaseIndicator can be replaced with compatible implementation */}
          <PhaseIndicator config={config} phase={connectionPhase} />
          
          <button className="text-gray-400 hover:text-white transition-colors">
            <i className="fas fa-question-circle text-lg" />
          </button>
        </div>
      </div>
    </header>
  );
};
