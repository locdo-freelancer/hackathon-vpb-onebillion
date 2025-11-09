// Vulnerabilities Service - Handle vulnerability management API calls
import { apiClient } from "../api-client";

export type VulnerabilitySeverity = "Critical" | "High" | "Medium" | "Low";
export type VulnerabilityStatus = "Active" | "Resolved" | "Mitigated";

export interface Vulnerability {
  id: string;
  cveId: string;
  title: string;
  severity: VulnerabilitySeverity;
  cvssScore: string;
  publishedDate: string;
  affectedSites: number;
  sites?: SiteVulnerability[];
  description?: string;
  remediation?: string;
}

export interface SiteVulnerability {
  id: string;
  name: string;
  status: VulnerabilityStatus;
  detectedAt: string;
  lastScanned: string;
}

export interface VulnerabilityStats {
  total: number;
  bySeverity: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  byStatus: {
    active: number;
    resolved: number;
    mitigated: number;
  };
}

export interface VulnerabilitiesResponse {
  vulnerabilities: Vulnerability[];
  stats: VulnerabilityStats;
}

export interface CreateVulnerabilityDto {
  cveId: string;
  title: string;
  severity: VulnerabilitySeverity;
  cvssScore: string;
  description: string;
  remediation?: string;
}

export interface UpdateVulnerabilityDto {
  title?: string;
  severity?: VulnerabilitySeverity;
  cvssScore?: string;
  description?: string;
  remediation?: string;
}

export interface AssignVulnerabilityDto {
  vulnerabilityId: string;
  siteId: string;
}

export class VulnerabilitiesService {
  /**
   * Get all vulnerabilities - GET /api/vulnerabilities
   */
  static async getAllVulnerabilities(params?: {
    severity?: VulnerabilitySeverity;
    minCvss?: number;
    maxCvss?: number;
    page?: number;
    limit?: number;
  }): Promise<VulnerabilitiesResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.severity) queryParams.append("severity", params.severity);
      if (params?.minCvss) queryParams.append("minCvss", params.minCvss.toString());
      if (params?.maxCvss) queryParams.append("maxCvss", params.maxCvss.toString());
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());

      const queryString = queryParams.toString();
      const endpoint = queryString ? `/vulnerabilities?${queryString}` : "/vulnerabilities";
      
      const response = await apiClient.get(endpoint);
      return response;
    } catch (error: any) {
      console.error("Get vulnerabilities error:", error);
      throw new Error(error.message || "Failed to fetch vulnerabilities");
    }
  }

  /**
   * Get vulnerability statistics - GET /api/vulnerabilities/stats
   */
  static async getVulnerabilityStats(): Promise<VulnerabilityStats> {
    try {
      const response = await apiClient.get("/vulnerabilities/stats");
      return response;
    } catch (error: any) {
      console.error("Get vulnerability stats error:", error);
      throw new Error(error.message || "Failed to fetch vulnerability statistics");
    }
  }

  /**
   * Get vulnerability by ID - GET /api/vulnerabilities/:id
   */
  static async getVulnerabilityById(id: string): Promise<Vulnerability> {
    try {
      const response = await apiClient.get(`/vulnerabilities/${id}`);
      return response;
    } catch (error: any) {
      console.error("Get vulnerability error:", error);
      throw new Error(error.message || "Failed to fetch vulnerability");
    }
  }

  /**
   * Get top vulnerabilities by impact - GET /api/vulnerabilities/top
   */
  static async getTopVulnerabilities(limit: number = 10): Promise<Vulnerability[]> {
    try {
      const response = await apiClient.get(`/vulnerabilities/top?limit=${limit}`);
      return response;
    } catch (error: any) {
      console.error("Get top vulnerabilities error:", error);
      throw new Error(error.message || "Failed to fetch top vulnerabilities");
    }
  }

  /**
   * Get site-specific vulnerabilities - GET /api/vulnerabilities/sites/:siteId
   */
  static async getSiteVulnerabilities(siteId: string): Promise<Vulnerability[]> {
    try {
      const response = await apiClient.get(`/vulnerabilities/sites/${siteId}`);
      return response;
    } catch (error: any) {
      console.error("Get site vulnerabilities error:", error);
      throw new Error(error.message || "Failed to fetch site vulnerabilities");
    }
  }

  /**
   * Create new vulnerability - POST /api/vulnerabilities
   */
  static async createVulnerability(data: CreateVulnerabilityDto): Promise<Vulnerability> {
    try {
      const response = await apiClient.post("/vulnerabilities", data);
      return response;
    } catch (error: any) {
      console.error("Create vulnerability error:", error);
      throw new Error(error.message || "Failed to create vulnerability");
    }
  }

  /**
   * Update vulnerability - PATCH /api/vulnerabilities/:id
   */
  static async updateVulnerability(id: string, data: UpdateVulnerabilityDto): Promise<Vulnerability> {
    try {
      const response = await apiClient.patch(`/vulnerabilities/${id}`, data);
      return response;
    } catch (error: any) {
      console.error("Update vulnerability error:", error);
      throw new Error(error.message || "Failed to update vulnerability");
    }
  }

  /**
   * Delete vulnerability - DELETE /api/vulnerabilities/:id
   */
  static async deleteVulnerability(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.delete(`/vulnerabilities/${id}`);
      return response;
    } catch (error: any) {
      console.error("Delete vulnerability error:", error);
      throw new Error(error.message || "Failed to delete vulnerability");
    }
  }

  /**
   * Assign vulnerability to site - POST /api/vulnerabilities/assign
   */
  static async assignVulnerabilityToSite(data: AssignVulnerabilityDto): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post("/vulnerabilities/assign", data);
      return response;
    } catch (error: any) {
      console.error("Assign vulnerability error:", error);
      throw new Error(error.message || "Failed to assign vulnerability");
    }
  }

  /**
   * Update site vulnerability status - PATCH /api/vulnerabilities/sites/:siteId/:vulnId
   */
  static async updateSiteVulnerabilityStatus(
    siteId: string,
    vulnId: string,
    status: VulnerabilityStatus
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.patch(`/vulnerabilities/sites/${siteId}/${vulnId}`, { status });
      return response;
    } catch (error: any) {
      console.error("Update site vulnerability status error:", error);
      throw new Error(error.message || "Failed to update vulnerability status");
    }
  }

  /**
   * Remove vulnerability from site - DELETE /api/vulnerabilities/sites/:siteId/:vulnId
   */
  static async removeVulnerabilityFromSite(siteId: string, vulnId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.delete(`/vulnerabilities/sites/${siteId}/${vulnId}`);
      return response;
    } catch (error: any) {
      console.error("Remove vulnerability error:", error);
      throw new Error(error.message || "Failed to remove vulnerability from site");
    }
  }

  /**
   * Scan site for vulnerabilities - POST /api/vulnerabilities/scan/:siteId
   */
  static async scanSiteVulnerabilities(siteId: string): Promise<{ success: boolean; message: string; vulnerabilitiesFound: number }> {
    try {
      const response = await apiClient.post(`/vulnerabilities/scan/${siteId}`, {});
      return response;
    } catch (error: any) {
      console.error("Scan site error:", error);
      throw new Error(error.message || "Failed to scan site");
    }
  }
}
