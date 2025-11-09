// Incidents Service - Handle security incident management API calls
import { apiClient } from "../api-client";

export type IncidentSeverity = "critical" | "high" | "medium" | "low";
export type IncidentStatus = "open" | "investigating" | "resolved" | "closed";
export type IncidentType = 
  | "malware" 
  | "phishing" 
  | "ddos" 
  | "breach" 
  | "policy_violation" 
  | "vulnerability" 
  | "ransomware" 
  | "intrusion";

export interface Assignee {
  id: string;
  name: string;
  avatar?: string;
}

export interface Incident {
  id: string;
  incidentId: string; // INC-001, INC-002, etc.
  title: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  type: IncidentType;
  dateCreated: string;
  assignee?: Assignee;
  affectedSystems: string[];
  tags: string[];
  description?: string;
  timeline?: TimelineEvent[];
  mitreAttack?: string[];
  aiRecommendations?: string[];
  relatedIncidents?: string[];
}

export interface TimelineEvent {
  timestamp: string;
  event: string;
  user?: string;
  details?: string;
}

export interface IncidentStats {
  total: number;
  open: number;
  investigating: number;
  resolved: number;
  closed: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface IncidentsResponse {
  incidents: Incident[];
  stats: IncidentStats;
}

export interface CreateIncidentDto {
  title: string;
  severity: IncidentSeverity;
  type: IncidentType;
  description: string;
  affectedSystems: string[];
  tags?: string[];
}

export interface UpdateIncidentDto {
  title?: string;
  severity?: IncidentSeverity;
  status?: IncidentStatus;
  type?: IncidentType;
  description?: string;
  affectedSystems?: string[];
  tags?: string[];
  assigneeId?: string;
}

export interface BulkActionDto {
  incidentIds: string[];
  action: "close" | "assign" | "export";
  assigneeId?: string;
}

export class IncidentsService {
  /**
   * Get all incidents with filtering - GET /api/incidents
   */
  static async getAllIncidents(params?: {
    status?: IncidentStatus;
    severity?: IncidentSeverity;
    type?: IncidentType;
  }): Promise<IncidentsResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.status) queryParams.append("status", params.status);
      if (params?.severity) queryParams.append("severity", params.severity);
      if (params?.type) queryParams.append("type", params.type);

      const queryString = queryParams.toString();
      const endpoint = queryString ? `/incidents?${queryString}` : "/incidents";
      
      const response = await apiClient.get(endpoint);
      return response;
    } catch (error: any) {
      console.error("Get incidents error:", error);
      throw new Error(error.message || "Failed to fetch incidents");
    }
  }

  /**
   * Get incident statistics - GET /api/incidents/stats
   */
  static async getIncidentStats(): Promise<IncidentStats> {
    try {
      const response = await apiClient.get("/incidents/stats");
      return response;
    } catch (error: any) {
      console.error("Get incident stats error:", error);
      throw new Error(error.message || "Failed to fetch incident statistics");
    }
  }

  /**
   * Get incident by ID - GET /api/incidents/:id
   */
  static async getIncidentById(id: string): Promise<Incident> {
    try {
      const response = await apiClient.get(`/incidents/${id}`);
      return response;
    } catch (error: any) {
      console.error("Get incident error:", error);
      throw new Error(error.message || "Failed to fetch incident");
    }
  }

  /**
   * Get incident by display ID - GET /api/incidents/incident/:incidentId
   */
  static async getIncidentByDisplayId(incidentId: string): Promise<Incident> {
    try {
      const response = await apiClient.get(`/incidents/incident/${incidentId}`);
      return response;
    } catch (error: any) {
      console.error("Get incident error:", error);
      throw new Error(error.message || "Failed to fetch incident");
    }
  }

  /**
   * Create new incident - POST /api/incidents
   */
  static async createIncident(data: CreateIncidentDto): Promise<Incident> {
    try {
      const response = await apiClient.post("/incidents", data);
      return response;
    } catch (error: any) {
      console.error("Create incident error:", error);
      throw new Error(error.message || "Failed to create incident");
    }
  }

  /**
   * Update incident - PATCH /api/incidents/:id
   */
  static async updateIncident(id: string, data: UpdateIncidentDto): Promise<Incident> {
    try {
      const response = await apiClient.patch(`/incidents/${id}`, data);
      return response;
    } catch (error: any) {
      console.error("Update incident error:", error);
      throw new Error(error.message || "Failed to update incident");
    }
  }

  /**
   * Delete incident - DELETE /api/incidents/:id
   */
  static async deleteIncident(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.delete(`/incidents/${id}`);
      return response;
    } catch (error: any) {
      console.error("Delete incident error:", error);
      throw new Error(error.message || "Failed to delete incident");
    }
  }

  /**
   * Bulk action on incidents - POST /api/incidents/bulk-action
   */
  static async bulkAction(data: BulkActionDto): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post("/incidents/bulk-action", data);
      return response;
    } catch (error: any) {
      console.error("Bulk action error:", error);
      throw new Error(error.message || "Failed to perform bulk action");
    }
  }

  /**
   * Resolve incident - POST /api/incidents/:id/resolve
   */
  static async resolveIncident(id: string): Promise<Incident> {
    try {
      const response = await apiClient.post(`/incidents/${id}/resolve`, {});
      return response;
    } catch (error: any) {
      console.error("Resolve incident error:", error);
      throw new Error(error.message || "Failed to resolve incident");
    }
  }

  /**
   * Close incident - POST /api/incidents/:id/close
   */
  static async closeIncident(id: string): Promise<Incident> {
    try {
      const response = await apiClient.post(`/incidents/${id}/close`, {});
      return response;
    } catch (error: any) {
      console.error("Close incident error:", error);
      throw new Error(error.message || "Failed to close incident");
    }
  }

  /**
   * Assign incident - POST /api/incidents/:id/assign
   */
  static async assignIncident(id: string, assigneeId: string): Promise<Incident> {
    try {
      const response = await apiClient.post(`/incidents/${id}/assign`, { assigneeId });
      return response;
    } catch (error: any) {
      console.error("Assign incident error:", error);
      throw new Error(error.message || "Failed to assign incident");
    }
  }
}
