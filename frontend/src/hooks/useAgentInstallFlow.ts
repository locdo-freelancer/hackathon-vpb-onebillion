"use client";

import { useState, useEffect, useRef } from "react";
import { useAgentInstall } from "@/hooks/useAgentInstall";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { OnboardingService } from "@/lib/services";

/**
 * Custom hook for Agent Install Flow logic
 *
 * Single Responsibility: Only manages agent install page state and interactions
 * Dependency Inversion: Depends on abstract hooks, not concrete implementations
 */
export const useAgentInstallFlow = () => {
  const [currentTab, setCurrentTab] = useState<"linux" | "windows" | "mac">(
    "linux"
  );
  const [installToken, setInstallToken] = useState<string>("");
  const [isGeneratingToken, setIsGeneratingToken] = useState<boolean>(false);
  const hasStartedPolling = useRef<boolean>(false);

  // Dependency Injection: Agent connection state injected via hook
  const {
    connectionPhase,
    heartbeatTime,
    isRegistered,
    startPolling,
    stopPolling,
  } = useAgentInstall();

  // Dependency Injection: Copy functionality injected via hook
  const { copyToClipboard } = useCopyToClipboard();

  // Generate install token on mount
  useEffect(() => {
    const generateToken = async () => {
      // Default to linux for token generation
      setIsGeneratingToken(true);
      try {
        const response = await OnboardingService.generateInstallToken("linux");
        if (response.success && response.token) {
          setInstallToken(response.token);
        }
      } catch (error) {
        console.error("Failed to generate install token:", error);
      } finally {
        setIsGeneratingToken(false);
      }
    };

    generateToken();
  }, []);

  // Start polling when token is available (only once)
  useEffect(() => {
    if (installToken && !hasStartedPolling.current && !isRegistered) {
      hasStartedPolling.current = true;
      startPolling();
    }
  }, [installToken, isRegistered, startPolling]);

  // Stop polling when registered
  useEffect(() => {
    if (isRegistered) {
      stopPolling();
    }
  }, [isRegistered, stopPolling]);

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
    installToken,
    isGeneratingToken,

    // Actions
    handleTabChange,
    handleCopyCommand,
  };
};
