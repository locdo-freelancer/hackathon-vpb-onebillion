import React from "react";
import type { Agent } from "@/types/agents.types";
import { AgentCard } from "./AgentCard";
import { useTranslations } from "@/hooks/useTranslations";

interface AgentGridProps {
  agents: Agent[];
  onAgentClick: (agent: Agent) => void;
}

export const AgentGrid: React.FC<AgentGridProps> = ({
  agents,
  onAgentClick,
}) => {
  const { t } = useTranslations("agents");

  if (agents.length === 0) {
    return (
      <div className="col-span-2 py-12 text-center">
        <div className="text-gray-400">
          <i className="fas fa-desktop text-4xl mb-4 opacity-50" />
          <p className="text-sm">{t("noAgentsFound")}</p>
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
