import React from "react";
import type { PhaseConfig } from "@/config/agent-header.config";
import type { ConnectionPhase } from "./ConnectionStatus";

interface PhaseIndicatorProps {
  config: PhaseConfig;
  phase: ConnectionPhase;
}

export const PhaseIndicator: React.FC<PhaseIndicatorProps> = ({
  config,
  phase,
}) => {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-1 rounded-lg border ${config.bgColor} ${config.borderColor}`}
    >
      <div
        className={`w-2 h-2 rounded-full ${config.dotColor} ${
          phase === "waiting" ? "animate-pulse" : ""
        }`}
      />
      <span className={`text-sm font-medium ${config.color}`}>
        {config.text}
      </span>
    </div>
  );
};
