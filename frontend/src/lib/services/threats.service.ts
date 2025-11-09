// Threats Service - Handle threat intelligence API calls
import { apiClient } from "../api-client";

export type ThreatSeverity = "critical" | "high" | "medium" | "low";
export type ThreatType = "ip" | "domain" | "url" | "hash";
export type ThreatStatus = "active" | "blocked" | "expired" | "investigating";

export interface Threat {
  id: string;
  indicator: string;
  description: string;
  type: ThreatType;
  severity: ThreatSeverity;
  confidence: number; // 0-100
  country?: string;
  countryCode?: string;
  countryFlag?: string;
  firstSeen: string;
  lastSeen: string;
  status: ThreatStatus;
  icon: string;
  iconColor: string;
  malwareFamily?: string;
  tags?: string[];
  sources?: string[];
}

export interface ThreatStats {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  blocked: number;
  active: number;
}

export interface ThreatsResponse {
  indicators: Threat[];
  stats: ThreatStats;
}

export interface CreateThreatDto {
  indicator: string;
  description: string;
  type: ThreatType;
  severity: ThreatSeverity;
  confidence?: number;
  malwareFamily?: string;
  tags?: string[];
  sources?: string[];
}

export interface UpdateThreatDto {
  indicator?: string;
  description?: string;
  type?: ThreatType;
  severity?: ThreatSeverity;
  confidence?: number;
  status?: ThreatStatus;
  malwareFamily?: string;
  tags?: string[];
}

export interface ThreatEnrichment {
  indicator: string;
  type: ThreatType;
  reputation: "malicious" | "suspicious" | "clean" | "unknown";
  score: number;
  geolocation?: {
    country: string;
    city: string;
    lat: number;
    lon: number;
  };
  asn?: {
    number: number;
    organization: string;
  };
  malware?: {
    family: string;
    variants: string[];
  };
  sources: string[];
  lastUpdated: string;
}

export class ThreatsService {
  /**
   * Get all threats with filtering - GET /api/threats
   */
  static async getAllThreats(params?: {
    type?: ThreatType;
    severity?: ThreatSeverity;
    status?: ThreatStatus;
    startDate?: string;
    endDate?: string;
  }): Promise<ThreatsResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.type) queryParams.append("type", params.type);
      if (params?.severity) queryParams.append("severity", params.severity);
      if (params?.status) queryParams.append("status", params.status);
      if (params?.startDate) queryParams.append("startDate", params.startDate);
      if (params?.endDate) queryParams.append("endDate", params.endDate);

      const queryString = queryParams.toString();
      const endpoint = queryString ? `/threats?${queryString}` : "/threats";
      
      const response = await apiClient.get(endpoint);
      return response;
    } catch (error: any) {
      console.error("Get threats error:", error);
      throw new Error(error.message || "Failed to fetch threats");
    }
  }

  /**
   * Get threat statistics - GET /api/threats/stats
   */
  static async getThreatStats(): Promise<ThreatStats> {
    try {
      const response = await apiClient.get("/threats/stats");
      return response;
    } catch (error: any) {
      console.error("Get threat stats error:", error);
      throw new Error(error.message || "Failed to fetch threat statistics");
    }
  }

  /**
   * Get threat by ID - GET /api/threats/:id
   */
  static async getThreatById(id: string): Promise<Threat> {
    try {
      const response = await apiClient.get(`/threats/${id}`);
      return response;
    } catch (error: any) {
      console.error("Get threat error:", error);
      throw new Error(error.message || "Failed to fetch threat");
    }
  }

  /**
   * Get threat enrichment data - GET /api/threats/enrichment/:indicator
   */
  static async getThreatEnrichment(indicator: string): Promise<ThreatEnrichment> {
    try {
      const response = await apiClient.get(`/threats/enrichment/${encodeURIComponent(indicator)}`);
      return response;
    } catch (error: any) {
      console.error("Get threat enrichment error:", error);
      throw new Error(error.message || "Failed to fetch threat enrichment");
    }
  }

  /**
   * Create new threat - POST /api/threats
   */
  static async createThreat(data: CreateThreatDto): Promise<Threat> {
    try {
      const response = await apiClient.post("/threats", data);
      return response;
    } catch (error: any) {
      console.error("Create threat error:", error);
      throw new Error(error.message || "Failed to create threat");
    }
  }

  /**
   * Update threat - PATCH /api/threats/:id
   */
  static async updateThreat(id: string, data: UpdateThreatDto): Promise<Threat> {
    try {
      const response = await apiClient.patch(`/threats/${id}`, data);
      return response;
    } catch (error: any) {
      console.error("Update threat error:", error);
      throw new Error(error.message || "Failed to update threat");
    }
  }

  /**
   * Delete threat - DELETE /api/threats/:id
   */
  static async deleteThreat(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.delete(`/threats/${id}`);
      return response;
    } catch (error: any) {
      console.error("Delete threat error:", error);
      throw new Error(error.message || "Failed to delete threat");
    }
  }

  /**
   * Block threat indicator - POST /api/threats/:id/block
   */
  static async blockThreat(id: string): Promise<Threat> {
    try {
      const response = await apiClient.post(`/threats/${id}/block`, {});
      return response;
    } catch (error: any) {
      console.error("Block threat error:", error);
      throw new Error(error.message || "Failed to block threat");
    }
  }

  /**
   * Unblock threat indicator - POST /api/threats/:id/unblock
   */
  static async unblockThreat(id: string): Promise<Threat> {
    try {
      const response = await apiClient.post(`/threats/${id}/unblock`, {});
      return response;
    } catch (error: any) {
      console.error("Unblock threat error:", error);
      throw new Error(error.message || "Failed to unblock threat");
    }
  }

  /**
   * Bulk block threats - POST /api/threats/bulk/block
   */
  static async bulkBlockThreats(ids: string[]): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post("/threats/bulk/block", { ids });
      return response;
    } catch (error: any) {
      console.error("Bulk block error:", error);
      throw new Error(error.message || "Failed to block threats");
    }
  }

  /**
   * Bulk delete threats - POST /api/threats/bulk/delete
   */
  static async bulkDeleteThreats(ids: string[]): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post("/threats/bulk/delete", { ids });
      return response;
    } catch (error: any) {
      console.error("Bulk delete error:", error);
      throw new Error(error.message || "Failed to delete threats");
    }
  }

  /**
   * Export threats to CSV - GET /api/threats/export/csv
   */
  static async exportThreatsToCSV(params?: {
    type?: ThreatType;
    severity?: ThreatSeverity;
    status?: ThreatStatus;
  }): Promise<Blob> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.type) queryParams.append("type", params.type);
      if (params?.severity) queryParams.append("severity", params.severity);
      if (params?.status) queryParams.append("status", params.status);

      const queryString = queryParams.toString();
      const endpoint = queryString ? `/threats/export/csv?${queryString}` : "/threats/export/csv";
      
      // Special handling for blob response
      const token = localStorage.getItem("token");
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const response = await fetch(`${API_URL}/api${endpoint}`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to export CSV");
      }

      return await response.blob();
    } catch (error: any) {
      console.error("Export CSV error:", error);
      throw new Error(error.message || "Failed to export threats");
    }
  }
}
