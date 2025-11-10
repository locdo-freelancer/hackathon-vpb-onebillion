// Sites Service - Handle site management API calls
import { apiClient } from "../api-client";

export interface Site {
  id: string;
  name: string;
  hostname: string;
  ipAddress: string;
  domains?: string[];
  agentCount: number;
  status: "active" | "inactive" | "warning";
  icon: string;
  iconGradient: string;
  lastChecked: string;
  port?: string;
  createdAt?: number;
  updatedAt?: number;
}

export interface SiteStats {
  totalSites: number;
  activeSites: number;
  inactiveSites: number;
  warningSites: number;
}

export interface SitesResponse {
  sites: Site[];
  totalSites: number;
  activeSites: number;
  inactiveSites: number;
  warningSites: number;
}

export interface CreateSiteDto {
  name: string;
  hostname: string;
  ipAddress: string;
  port?: string;
  domains?: string[];
  serverType?: "linux" | "windows" | "docker";
}

export interface UpdateSiteDto {
  name?: string;
  hostname?: string;
  ipAddress?: string;
  port?: string;
  domains?: string[];
  status?: "active" | "inactive" | "warning";
}

export class SitesService {
  /**
   * Get all sites with statistics - GET /api/sites
   */
  static async getAllSites(): Promise<SitesResponse> {
    try {
      const response = await apiClient.get("/sites");

      // Handle wrapped response format: { success: true, data: { ... } }
      if (response.data) {
        return {
          sites: Array.isArray(response.data.sites) ? response.data.sites : [],
          totalSites: response.data.totalSites || 0,
          activeSites: response.data.activeSites || 0,
          inactiveSites: response.data.inactiveSites || 0,
          warningSites: response.data.warningSites || 0,
        };
      }

      // Handle direct response format
      return {
        sites: Array.isArray(response.sites) ? response.sites : [],
        totalSites: response.totalSites || 0,
        activeSites: response.activeSites || 0,
        inactiveSites: response.inactiveSites || 0,
        warningSites: response.warningSites || 0,
      };
    } catch (error: any) {
      console.error("Get sites error:", error);
      throw new Error(error.message || "Failed to fetch sites");
    }
  }

  /**
   * Get site by ID - GET /api/sites/:id
   */
  static async getSiteById(id: string): Promise<Site> {
    try {
      const response = await apiClient.get(`/sites/${id}`);
      return response;
    } catch (error: any) {
      console.error("Get site error:", error);
      throw new Error(error.message || "Failed to fetch site");
    }
  }

  /**
   * Create new site - POST /api/sites
   */
  static async createSite(data: CreateSiteDto): Promise<Site> {
    try {
      // Transform frontend data to backend format
      const requestData = {
        name: data.name,
        ip_address: data.ipAddress,
        domain_name:
          data.domains && data.domains.length > 0 ? data.domains[0] : undefined,
        hostname: data.hostname,
        server_type: data.serverType || "linux",
        port: data.port ? parseInt(data.port) : undefined,
      };

      const response = await apiClient.post("/sites", requestData);

      // Handle wrapped response: { success: true, data: { ... } }
      if (response.data) {
        return response.data;
      }

      return response;
    } catch (error: any) {
      console.error("Create site error:", error);
      throw new Error(error.message || "Failed to create site");
    }
  }

  /**
   * Update site - PATCH /api/sites/:id
   */
  static async updateSite(id: string, data: UpdateSiteDto): Promise<Site> {
    try {
      // Transform frontend data to backend format
      const requestData: any = {};
      if (data.name) requestData.name = data.name;
      if (data.ipAddress) requestData.ip_address = data.ipAddress;
      if (data.domains && data.domains.length > 0)
        requestData.domain_name = data.domains[0];
      if (data.hostname) requestData.hostname = data.hostname;
      if (data.port) requestData.port = parseInt(data.port);
      if (data.status) requestData.status = data.status;

      const response = await apiClient.patch(`/sites/${id}`, requestData);

      // Handle wrapped response
      if (response.data) {
        return response.data;
      }

      return response;
    } catch (error: any) {
      console.error("Update site error:", error);
      throw new Error(error.message || "Failed to update site");
    }
  }

  /**
   * Delete site - DELETE /api/sites/:id
   */
  static async deleteSite(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.delete(`/sites/${id}`);
      return response;
    } catch (error: any) {
      console.error("Delete site error:", error);
      throw new Error(error.message || "Failed to delete site");
    }
  }

  /**
   * Get site statistics
   */
  static async getSiteStats(): Promise<SiteStats> {
    try {
      const response = await this.getAllSites();
      return {
        totalSites: response.totalSites,
        activeSites: response.activeSites,
        inactiveSites: response.inactiveSites,
        warningSites: response.warningSites,
      };
    } catch (error: any) {
      console.error("Get site stats error:", error);
      throw new Error(error.message || "Failed to fetch site statistics");
    }
  }

  /**
   * Get agent token - GET /api/sites/:id/agent-token
   */
  static async getAgentToken(id: string): Promise<{
    success: boolean;
    data: {
      siteId: string;
      siteName: string;
      agentToken: string;
      installCommand: string;
    };
  }> {
    try {
      const response = await apiClient.get(`/sites/${id}/agent-token`);
      return response;
    } catch (error: any) {
      console.error("Get agent token error:", error);
      throw new Error(error.message || "Failed to fetch agent token");
    }
  }
}
