import type { ConnectionPhase } from "@/components/agent-install/ConnectionStatus";

export interface PhaseConfig {
  text: string;
  color: string;
  bgColor: string;
  borderColor: string;
  dotColor: string;
}

/**
 * Configuration for agent install header phases
 * Single Responsibility: Only defines phase display configurations
 * Open/Closed: New phases can be added without modifying existing
 */
export const PHASE_CONFIG: Record<ConnectionPhase, PhaseConfig> = {
  waiting: {
    text: "Waiting for Connection",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/20",
    borderColor: "border-yellow-500/30",
    dotColor: "bg-yellow-400",
  },
  connected: {
    text: "Agent Connected",
    color: "text-blue-400",
    bgColor: "bg-blue-500/20",
    borderColor: "border-blue-500/30",
    dotColor: "bg-blue-400",
  },
  registered: {
    text: "Agent Registered",
    color: "text-green-400",
    bgColor: "bg-green-500/20",
    borderColor: "border-green-500/30",
    dotColor: "bg-green-400",
  },
};

/**
 * Get phase configuration
 * Dependency Inversion: Returns abstract configuration interface
 */
export const getPhaseConfig = (phase: ConnectionPhase): PhaseConfig => {
  return PHASE_CONFIG[phase];
};
