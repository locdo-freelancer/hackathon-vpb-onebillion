"use client";

import { useState } from "react";
import type { Agent, AgentStatus } from "@/types/agents.types";
import { useAgentsData } from "@/hooks/useAgentsData";

export interface AgentsFlow {
  activeTab: AgentStatus | "all";
  filteredAgents: Agent[];
  selectedAgent: Agent | null;
  metrics: ReturnType<typeof useAgentsData>["metrics"];
  osDistribution: ReturnType<typeof useAgentsData>["osDistribution"];
  handleTabChange: (tab: AgentStatus | "all") => void;
  handleAgentClick: (agent: Agent) => void;
  handleDrawerClose: () => void;
  isDrawerOpen: boolean
}

export const useAgentsFlow = (): AgentsFlow => {
  const { filteredAgents, filterByStatus, selectedAgent, setSelectedAgent, metrics, osDistribution } = useAgentsData();
  const [activeTab, setActiveTab] = useState<AgentStatus | "all">("all");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleTabChange = (tab: AgentStatus | "all") => {
    setActiveTab(tab);
    filterByStatus(tab);
  };

  const handleAgentClick = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedAgent(null), 300);
  };

  return {
    activeTab,
    filteredAgents,
    selectedAgent,
    metrics,
    osDistribution,
    handleTabChange,
    handleAgentClick,
    handleDrawerClose,
    isDrawerOpen,
  };
};
