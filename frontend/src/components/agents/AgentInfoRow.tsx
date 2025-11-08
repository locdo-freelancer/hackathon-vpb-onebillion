import React from "react";
import type { AgentStatus } from "@/types/agents.types";
import { getTextColor } from "@/config/agent-status.config";

interface AgentInfoRowProps {
  label: string;
  value: string;
  status?: AgentStatus;
  highlightStatus?: boolean;
}

/**
 * Agent Info Row Component
 * Single Responsibility: Renders a single info row with label and value
 * Interface Segregation: Minimal props for flexible info display
 */
export const AgentInfoRow: React.FC<AgentInfoRowProps> = ({
  label,
  value,
  status,
  highlightStatus = false,
}) => {
  const getValueColor = () => {
    if (highlightStatus && status) {
      return getTextColor(status);
    }
    if (status === "updating") {
      return "text-yellow-400";
    }
    return "text-gray-300";
  };

  return (
    <div className="flex justify-between text-xs">
      <span className="text-gray-400">{label}</span>
      <span className={getValueColor()}>{value}</span>
    </div>
  );
};
