import { useState, useEffect, useCallback, useRef } from "react";
import type { ConnectionPhase } from "@/components/agent-install";
import { AgentInstallService } from "@/lib/services";

interface UseAgentInstallReturn {
  connectionPhase: ConnectionPhase;
  heartbeatTime: string;
  isConnected: boolean;
  isRegistered: boolean;
  totalSites: number;
  connectedAgents: number;
  checkInstallStatus: () => Promise<boolean>;
  startPolling: () => void;
  stopPolling: () => void;
}

export const useAgentInstall = (): UseAgentInstallReturn => {
  const [connectionPhase, setConnectionPhase] =
    useState<ConnectionPhase>("waiting");
  const [heartbeatTime, setHeartbeatTime] = useState<string>("");
  const [totalSites, setTotalSites] = useState<number>(0);
  const [connectedAgents, setConnectedAgents] = useState<number>(0);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPollingRef = useRef<boolean>(false);

  const updateHeartbeat = useCallback(() => {
    const now = new Date();
    const timestamp =
      now.toISOString().replace("T", " ").substring(0, 19) + " UTC";
    setHeartbeatTime(timestamp);
  }, []);

  // Check installation status from API
  const checkInstallStatus = useCallback(async () => {
    try {
      const status = await AgentInstallService.getInstallStatus();

      setTotalSites(status.totalSites);
      setConnectedAgents(status.connectedAgents);

      if (status.isRegistered && status.connectedAgents > 0) {
        setConnectionPhase("registered");
        updateHeartbeat();
        return true; // Already registered
      } else if (status.totalSites > 0 && status.connectedAgents === 0) {
        setConnectionPhase("connected");
        return false;
      } else {
        setConnectionPhase("waiting");
        return false;
      }
    } catch (error) {
      console.error("Failed to check install status:", error);
      setConnectionPhase("waiting");
      return false;
    }
  }, [updateHeartbeat]);

  // Stop polling
  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
      isPollingRef.current = false;
    }
  }, []);

  // Start polling installation status
  const startPolling = useCallback(() => {
    // Prevent duplicate polling
    if (isPollingRef.current) {
      return;
    }

    isPollingRef.current = true;
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes (60 * 5s)

    pollingIntervalRef.current = setInterval(async () => {
      attempts++;

      const isRegistered = await checkInstallStatus();

      // Stop polling if registered or max attempts reached
      if (isRegistered || attempts >= maxAttempts) {
        stopPolling();
      }
    }, 5000); // Check every 5 seconds
  }, [checkInstallStatus, stopPolling]);

  // Auto-check status on mount (only once)
  useEffect(() => {
    checkInstallStatus();
  }, []); // Empty deps - only run once

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  useEffect(() => {
    // Start heartbeat update when registered
    if (connectionPhase === "registered") {
      const heartbeatInterval = setInterval(updateHeartbeat, 30000);
      return () => clearInterval(heartbeatInterval);
    }
  }, [connectionPhase, updateHeartbeat]);

  return {
    connectionPhase,
    heartbeatTime,
    isConnected: connectionPhase !== "waiting",
    isRegistered: connectionPhase === "registered",
    totalSites,
    connectedAgents,
    checkInstallStatus,
    startPolling,
    stopPolling,
  };
};
