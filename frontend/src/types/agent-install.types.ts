// Agent Install API Response Types

/**
 * Standard API wrapper from backend
 */
export interface AgentInstallApiResponse<T = any> {
  success: boolean;
  data: T;
  timestamp: string;
}

/**
 * Platform type for agent installation
 */
export type Platform = "linux" | "windows" | "docker" | "macos";

/**
 * Get Install Commands Response
 * GET /api/agent-install/commands/:platform?token=xxx
 */
export interface GetInstallCommandsResponseData {
  platform: string;
  commands: {
    // Linux & Windows
    download?: string;
    install?: string;
    configure?: string;
    start?: string;
    status?: string;
    // Docker
    pull?: string;
    run?: string;
  };
  downloadUrl: string;
}

/**
 * Agent Info in Installation Status
 */
export interface AgentInfo {
  id: string;
  siteName: string;
  lastHeartbeat: string | null;
  version: string | null;
  osInfo: string | null;
}

/**
 * Check Install Status Response
 * GET /api/agent-install/status
 */
export interface CheckInstallStatusResponseData {
  totalSites: number;
  connectedAgents: number;
  isRegistered: boolean;
  agents: AgentInfo[];
}
