import { useState, useEffect, useCallback } from "react";
import type { ConnectionPhase } from "@/components/agent-install";
import { AgentInstallService } from "@/lib/services";

interface UseAgentInstallReturn {
  connectionPhase: ConnectionPhase;
  heartbeatTime: string;
  isConnected: boolean;
  isRegistered: boolean;
  checkInstallStatus: (siteId: string) => Promise<void>;
  pollInstallStatus: (siteId: string) => void;
}

export const useAgentInstall = (): UseAgentInstallReturn => {
  const [connectionPhase, setConnectionPhase] =
    useState<ConnectionPhase>("waiting");
  const [heartbeatTime, setHeartbeatTime] = useState<string>("");

  const updateHeartbeat = useCallback(() => {
    const now = new Date();
    const timestamp =
      now.toISOString().replace("T", " ").substring(0, 19) + " UTC";
    setHeartbeatTime(timestamp);
  }, []);

  // Check installation status from API
  const checkInstallStatus = useCallback(async (siteId: string) => {
    try {
      const status = await AgentInstallService.getInstallStatus(siteId);
      
      switch (status.status) {
        case "not_installed":
          setConnectionPhase("waiting");
          break;
        case "installing":
          setConnectionPhase("connected");
          break;
        case "installed":
          setConnectionPhase("registered");
          updateHeartbeat();
          break;
        case "error":
          console.error("Installation error:", status.message);
          break;
      }
    } catch (error) {
      console.error("Failed to check install status:", error);
    }
  }, [updateHeartbeat]);

  // Poll installation status
  const pollInstallStatus = useCallback((siteId: string) => {
    AgentInstallService.pollInstallStatus(
      siteId,
      (status) => {
        if (status.status === "installing") {
          setConnectionPhase("connected");
        } else if (status.status === "installed") {
          setConnectionPhase("registered");
          updateHeartbeat();
        }
      },
      5000, // Check every 5 seconds
      60    // Max 60 attempts (5 minutes)
    ).catch((error) => {
      console.error("Installation polling failed:", error);
    });
  }, [updateHeartbeat]);

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
    checkInstallStatus,
    pollInstallStatus,
  };
};
