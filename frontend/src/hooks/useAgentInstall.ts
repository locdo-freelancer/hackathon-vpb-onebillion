import { useState, useEffect, useCallback } from "react";
import type { ConnectionPhase } from "@/components/agent-install";

interface UseAgentInstallReturn {
  connectionPhase: ConnectionPhase;
  heartbeatTime: string;
  isConnected: boolean;
  isRegistered: boolean;
  simulateConnection: () => void;
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

  const simulateConnection = useCallback(() => {
    // First phase: Connected after 5 seconds
    const connectedTimeout = setTimeout(() => {
      setConnectionPhase("connected");

      // Second phase: Registered after additional 3 seconds
      const registeredTimeout = setTimeout(() => {
        setConnectionPhase("registered");
        updateHeartbeat();

        // Update heartbeat every 30 seconds
        const heartbeatInterval = setInterval(updateHeartbeat, 30000);

        return () => clearInterval(heartbeatInterval);
      }, 3000);

      return () => clearTimeout(registeredTimeout);
    }, 5000);

    return () => clearTimeout(connectedTimeout);
  }, [updateHeartbeat]);

  useEffect(() => {
    const cleanup = simulateConnection();
    return cleanup;
  }, [simulateConnection]);

  return {
    connectionPhase,
    heartbeatTime,
    isConnected: connectionPhase !== "waiting",
    isRegistered: connectionPhase === "registered",
    simulateConnection,
  };
};
