// Agents Service - Handle agent management API calls
import { apiClient } from "../api-client";

export type AgentStatus = "online" | "offline" | "updating";
export type OSType = "linux" | "windows" | "docker" | "macos";

export interface Agent {
  id: string;
  hostname: string;
  ipAddress: string;
  os: string;
  osType: OSType;
  osIcon: string;
  version: string;
  status: AgentStatus;
  lastHeartbeat: string; // formatted time ago
  siteId: string;
  siteName: string;
  iconGradient: string;
  createdAt?: number;
  updatedAt?: number;
}

export interface AgentStats {
  totalAgents: number;
  onlineAgents: number;
  offlineAgents: number;
  updatingAgents: number;
  byOS: {
    linux: number;
    windows: number;
    docker: number;
    macos: number;
  };
}

export interface AgentMetrics {
  id: string;
  hostname: string;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkIn: number;
  networkOut: number;
  uptime: number;
  lastUpdated: string;
}

export interface AgentQueryParams {
  status?: AgentStatus | "all";
  siteId?: string;
  page?: number;
  limit?: number;
}

export class AgentsService {
  /**
   * Get all agents with filtering - GET /api/agents
   * Query params: status (online|offline|updating|all), siteId
   */
  static async getAllAgents(params?: AgentQueryParams): Promise<Agent[]> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.status) {
        queryParams.append("status", params.status);
      }
      if (params?.siteId) {
        queryParams.append("siteId", params.siteId);
      }
      if (params?.page) {
        queryParams.append("page", params.page.toString());
      }
      if (params?.limit) {
        queryParams.append("limit", params.limit.toString());
      }

      const queryString = queryParams.toString();
      const endpoint = queryString ? `/agents?${queryString}` : "/agents";

      const response = await apiClient.get(endpoint);

      // Handle wrapped response: { success: true, data: [...] }
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }

      // Handle direct array response
      if (Array.isArray(response)) {
        return response;
      }

      return [];
    } catch (error: any) {
      console.error("Get agents error:", error);
      throw new Error(error.message || "Failed to fetch agents");
    }
  }

  /**
   * Get agent statistics - GET /api/agents/stats
   */
  static async getAgentStats(): Promise<AgentStats> {
    try {
      const response = await apiClient.get("/agents/stats");

      // Handle wrapped response
      if (response.data) {
        return response.data;
      }

      return response;
    } catch (error: any) {
      console.error("Get agent stats error:", error);
      throw new Error(error.message || "Failed to fetch agent statistics");
    }
  }

  /**
   * Get OS distribution for charts - GET /api/agents/os-distribution
   */
  static async getOSDistribution(): Promise<
    { os: string; count: number; percentage: number }[]
  > {
    try {
      const response = await apiClient.get("/agents/os-distribution");

      // Handle wrapped response
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }

      if (Array.isArray(response)) {
        return response;
      }

      return [];
    } catch (error: any) {
      console.error("Get OS distribution error:", error);
      throw new Error(error.message || "Failed to fetch OS distribution");
    }
  }

  /**
   * Get agent by ID - GET /api/agents/:id
   */
  static async getAgentById(id: string): Promise<Agent> {
    try {
      const response = await apiClient.get(`/agents/${id}`);

      // Handle wrapped response
      if (response.data) {
        return response.data;
      }

      return response;
    } catch (error: any) {
      console.error("Get agent error:", error);
      throw new Error(error.message || "Failed to fetch agent");
    }
  }

  /**
   * Get detailed agent metrics - GET /api/agents/:id/metrics
   */
  static async getAgentMetrics(id: string): Promise<AgentMetrics> {
    try {
      const response = await apiClient.get(`/agents/${id}/metrics`);

      // Handle wrapped response
      if (response.data) {
        return response.data;
      }

      return response;
    } catch (error: any) {
      console.error("Get agent metrics error:", error);
      throw new Error(error.message || "Failed to fetch agent metrics");
    }
  }

  /**
   * Get agents by site - Helper method
   */
  static async getAgentsBySite(siteId: string): Promise<Agent[]> {
    return this.getAllAgents({ siteId });
  }

  /**
   * Get online agents - Helper method
   */
  static async getOnlineAgents(): Promise<Agent[]> {
    return this.getAllAgents({ status: "online" });
  }

  /**
   * Get offline agents - Helper method
   */
  static async getOfflineAgents(): Promise<Agent[]> {
    return this.getAllAgents({ status: "offline" });
  }
}
