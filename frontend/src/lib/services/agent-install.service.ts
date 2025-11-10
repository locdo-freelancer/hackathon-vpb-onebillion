// Agent Install Service - Handle agent installation API calls
import { apiClient } from "../api-client";

// Type definitions
export type Platform = "linux" | "windows" | "docker" | "macos";

interface AgentInstallApiResponse<T = any> {
  success: boolean;
  data: T;
  timestamp: string;
}

interface GetInstallCommandsResponseData {
  platform: Platform;
  commands: Record<string, string>;
  downloadUrl: string;
}

interface CheckInstallStatusResponseData {
  totalSites: number;
  connectedAgents: number;
  isRegistered: boolean;
  agents: Array<{
    id: string;
    siteName: string;
    lastHeartbeat: string | null;
    version: string | null;
    osInfo: string | null;
  }>;
}

export interface InstallCommands {
  platform: Platform;
  commands: {
    download?: string;
    install?: string;
    configure?: string;
    start?: string;
    status?: string;
    pull?: string;
    run?: string;
  };
  downloadUrl: string;
}

export interface InstallStatus {
  totalSites: number;
  connectedAgents: number;
  isRegistered: boolean;
  agents: Array<{
    id: string;
    siteName: string;
    lastHeartbeat: string | null;
    version: string | null;
    osInfo: string | null;
  }>;
}

export class AgentInstallService {
  /**
   * Get platform-specific installation commands
   * GET /api/agent-install/commands/:platform?token=xxx
   */
  static async getInstallCommands(
    platform: Platform,
    token?: string
  ): Promise<InstallCommands> {
    try {
      const queryParam = token ? `?token=${token}` : "";
      const response = await apiClient.get(
        `/agent-install/commands/${platform}${queryParam}`
      );

      // Backend returns: { success: true, data: { platform, commands, downloadUrl } }
      // apiClient unwraps to: { platform, commands, downloadUrl }
      const commandData = response.data || response;

      return {
        platform: commandData.platform as Platform,
        commands: commandData.commands,
        downloadUrl: commandData.downloadUrl,
      };
    } catch (error) {
      console.error("Get install commands error:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch installation commands";
      throw new Error(message);
    }
  }

  /**
   * Check agent installation status
   * GET /api/agent-install/status
   */
  static async getInstallStatus(): Promise<InstallStatus> {
    try {
      const response = (await apiClient.get(
        `/agent-install/status`
      )) as AgentInstallApiResponse<CheckInstallStatusResponseData>;

      // API returns: { success: true, data: { totalSites, connectedAgents, isRegistered, agents }, timestamp }
      const statusData = response.data;

      return {
        totalSites: statusData.totalSites,
        connectedAgents: statusData.connectedAgents,
        isRegistered: statusData.isRegistered,
        agents: statusData.agents,
      };
    } catch (error) {
      console.error("Get install status error:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch installation status";
      throw new Error(message);
    }
  }

  /**
   * Get Linux installation commands - Helper method
   */
  static async getLinuxCommands(token?: string): Promise<InstallCommands> {
    return this.getInstallCommands("linux", token);
  }

  /**
   * Get Windows installation commands - Helper method
   */
  static async getWindowsCommands(token?: string): Promise<InstallCommands> {
    return this.getInstallCommands("windows", token);
  }

  /**
   * Get Docker installation commands - Helper method
   */
  static async getDockerCommands(token?: string): Promise<InstallCommands> {
    return this.getInstallCommands("docker", token);
  }

  /**
   * Poll installation status - Helper method
   * Continuously check if agent has connected
   */
  static async pollInstallStatus(
    onProgress: (status: InstallStatus) => void,
    interval: number = 5000,
    maxAttempts: number = 60
  ): Promise<InstallStatus> {
    let attempts = 0;

    return new Promise((resolve, reject) => {
      const poll = setInterval(async () => {
        try {
          attempts++;
          const status = await this.getInstallStatus();

          onProgress(status);

          // Stop polling when agent is registered
          if (status.isRegistered && status.connectedAgents > 0) {
            clearInterval(poll);
            resolve(status);
          }

          if (attempts >= maxAttempts) {
            clearInterval(poll);
            reject(new Error("Installation timeout"));
          }
        } catch (error) {
          clearInterval(poll);
          reject(error);
        }
      }, interval);
    });
  }
}
