// Agent Install Service - Handle agent installation API calls
import { apiClient } from "../api-client";

export type Platform = "linux" | "windows" | "docker";

export interface InstallCommands {
  platform: Platform;
  downloadCommand: string;
  installCommand: string;
  verifyCommand: string;
  fullScript: string;
}

export interface InstallStatus {
  agentId?: string;
  status: "not_installed" | "installing" | "installed" | "error";
  message?: string;
  progress?: number;
  lastChecked?: string;
}

export class AgentInstallService {
  /**
   * Get platform-specific installation commands
   * GET /api/agent-install/commands/:platform
   */
  static async getInstallCommands(platform: Platform, token?: string): Promise<InstallCommands> {
    try {
      const queryParam = token ? `?token=${token}` : "";
      const response = await apiClient.get(`/agent-install/commands/${platform}${queryParam}`);
      return response;
    } catch (error: any) {
      console.error("Get install commands error:", error);
      throw new Error(error.message || "Failed to fetch installation commands");
    }
  }

  /**
   * Check agent installation status
   * GET /api/agent-install/status
   */
  static async getInstallStatus(siteId?: string): Promise<InstallStatus> {
    try {
      const queryParam = siteId ? `?siteId=${siteId}` : "";
      const response = await apiClient.get(`/agent-install/status${queryParam}`);
      return response;
    } catch (error: any) {
      console.error("Get install status error:", error);
      throw new Error(error.message || "Failed to fetch installation status");
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
   */
  static async pollInstallStatus(
    siteId: string,
    onProgress: (status: InstallStatus) => void,
    interval: number = 3000,
    maxAttempts: number = 60
  ): Promise<InstallStatus> {
    let attempts = 0;
    
    return new Promise((resolve, reject) => {
      const poll = setInterval(async () => {
        try {
          attempts++;
          const status = await this.getInstallStatus(siteId);
          
          onProgress(status);
          
          if (status.status === "installed" || status.status === "error") {
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
