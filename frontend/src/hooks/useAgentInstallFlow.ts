"use client";

import { useState } from "react";
import { useAgentInstall } from "@/hooks/useAgentInstall";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

/**
 * Custom hook for Agent Install Flow logic
 * 
 * Single Responsibility: Only manages agent install page state and interactions
 * Dependency Inversion: Depends on abstract hooks, not concrete implementations
 */
export const useAgentInstallFlow = () => {
  const [currentTab, setCurrentTab] = useState<"linux" | "windows" | "mac">("linux");
  
  // Dependency Injection: Agent connection state injected via hook
  const { connectionPhase, heartbeatTime, isRegistered } = useAgentInstall();
  
  // Dependency Injection: Copy functionality injected via hook
  const { copyToClipboard } = useCopyToClipboard();

  const handleCopyCommand = (command: string) => {
    copyToClipboard(command);
  };

  const handleTabChange = (tab: "linux" | "windows" | "mac") => {
    setCurrentTab(tab);
  };

  return {
    // State
    currentTab,
    connectionPhase,
    heartbeatTime,
    isRegistered,
    
    // Actions
    handleTabChange,
    handleCopyCommand,
  };
};
