import { useState, useEffect } from "react";
import { AgentInstallService, type InstallCommands } from "@/lib/services";
import type { Platform } from "@/types/agent-install.types";

interface UseInstallCommandsReturn {
  commands: InstallCommands | null;
  loading: boolean;
  error: string | null;
  refetch: (platform: Platform, token?: string) => Promise<void>;
}

/**
 * Hook to fetch platform-specific installation commands from API
 */
export const useInstallCommands = (
  platform: Platform,
  token?: string
): UseInstallCommandsReturn => {
  const [commands, setCommands] = useState<InstallCommands | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCommands = async (plat: Platform, tok?: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await AgentInstallService.getInstallCommands(plat, tok);
      setCommands(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch install commands";
      setError(message);
      console.error("Failed to fetch install commands:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommands(platform, token);
  }, [platform, token]);

  const refetch = async (plat: Platform, tok?: string) => {
    await fetchCommands(plat, tok);
  };

  return {
    commands,
    loading,
    error,
    refetch,
  };
};
