import React from "react";
import type { AgentStatus } from "@/types/agents.types";
import { getStatusColor } from "@/config/agent-status.config";

interface StatusIndicatorProps {
  status: AgentStatus;
}

/**
 * Status Indicator Component
 * Single Responsibility: Only renders status dot with appropriate color
 * Interface Segregation: Minimal props - only status needed
 */
export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  return <span className={`w-3 h-3 ${getStatusColor(status)} rounded-full`} />;
};
