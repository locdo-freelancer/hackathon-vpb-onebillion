import React from "react";
import type { Agent } from "@/types/agents.types";
import { AgentCard } from "./AgentCard";

interface AgentGridProps {
  agents: Agent[];
  onAgentClick: (agent: Agent) => void;
}

export const AgentGrid: React.FC<AgentGridProps> = ({
  agents,
  onAgentClick,
}) => {
  if (agents.length === 0) {
    return (
      <div className="col-span-2 py-12 text-center">
        <div className="text-gray-400">
          <i className="fas fa-desktop text-4xl mb-4 opacity-50" />
          <p className="text-sm">No agents found</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {agents.map((agent) => (
        <AgentCard key={agent.id} agent={agent} onClick={onAgentClick} />
      ))}
    </>
  );
};
