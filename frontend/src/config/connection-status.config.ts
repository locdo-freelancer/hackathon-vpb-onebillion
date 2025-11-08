import type { ConnectionPhase } from "@/components/agent-install/ConnectionStatus";

export interface StatusConfig {
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

/**
 * Configuration for connection status display
 * Single Responsibility: Only defines status configurations
 * Open/Closed: New phases can be added without modifying existing
 */
export const STATUS_CONFIG: Record<ConnectionPhase, StatusConfig> = {
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

/**
 * Get status configuration by phase
 * Dependency Inversion: Returns abstract configuration interface
 */
export const getStatusConfig = (phase: ConnectionPhase): StatusConfig => {
  return STATUS_CONFIG[phase];
};
