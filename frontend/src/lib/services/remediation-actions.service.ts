// Remediation Actions Service - Handle remediation actions API calls
import { apiClient } from "../api-client";

export type RemediationPriority = "critical" | "high" | "medium" | "low";
export type RemediationStatus = "pending" | "in_progress" | "completed" | "failed" | "cancelled";
export type RemediationType = "manual" | "automated" | "semi_automated";
export type SourceType = "incident" | "threat" | "vulnerability";

export interface RemediationAction {
  id: string;
  actionType: string;
  description: string;
  priority: RemediationPriority;
  status: RemediationStatus;
  remediationType: RemediationType;
  progressPercentage: number;
  assignedTo?: string;
  dueDate?: number;
  costEstimate?: number;
  effectivenessScore?: number;
  site?: {
    id: string;
    name: string;
  };
  incident?: {
    id: string;
    incidentId: string;
    title: string;
  };
  threat?: {
    id: string;
    indicator: string;
  };
  vulnerability?: {
    id: string;
    cveId: string;
    title: string;
  };
  createdAt?: number;
  updatedAt?: number;
  completedAt?: number;
}

export interface RemediationStats {
  total: number;
  byStatus: {
    pending: number;
    in_progress: number;
    completed: number;
    failed: number;
    cancelled: number;
  };
  byPriority: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  byType: {
    manual: number;
    automated: number;
    semi_automated: number;
  };
  averageEffectiveness: number;
  totalCost: number;
}

export interface RemediationActionsResponse {
  data: RemediationAction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateRemediationActionDto {
  actionType: string;
  description: string;
  priority: RemediationPriority;
  remediationType: RemediationType;
  siteId?: string;
  sourceType?: SourceType;
  sourceId?: string;
  assignedTo?: string;
  dueDate?: number;
  costEstimate?: number;
}

export interface UpdateRemediationActionDto {
  actionType?: string;
  description?: string;
  priority?: RemediationPriority;
  status?: RemediationStatus;
  progressPercentage?: number;
  assignedTo?: string;
  dueDate?: number;
  costEstimate?: number;
  effectivenessScore?: number;
}

export class RemediationActionsService {
  /**
   * Get all remediation actions - GET /api/remediation-actions
   */
  static async getAllActions(params?: {
    status?: RemediationStatus;
    priority?: RemediationPriority;
    type?: RemediationType;
    siteId?: string;
    page?: number;
    limit?: number;
  }): Promise<RemediationActionsResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.status) queryParams.append("status", params.status);
      if (params?.priority) queryParams.append("priority", params.priority);
      if (params?.type) queryParams.append("type", params.type);
      if (params?.siteId) queryParams.append("siteId", params.siteId);
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());

      const queryString = queryParams.toString();
      const endpoint = queryString ? `/remediation-actions?${queryString}` : "/remediation-actions";
      
      const response = await apiClient.get(endpoint);
      return response;
    } catch (error: any) {
      console.error("Get remediation actions error:", error);
      throw new Error(error.message || "Failed to fetch remediation actions");
    }
  }

  /**
   * Get remediation statistics - GET /api/remediation-actions/statistics
   */
  static async getStatistics(): Promise<RemediationStats> {
    try {
      const response = await apiClient.get("/remediation-actions/statistics");
      return response;
    } catch (error: any) {
      console.error("Get remediation stats error:", error);
      throw new Error(error.message || "Failed to fetch remediation statistics");
    }
  }

  /**
   * Get remediation action by ID - GET /api/remediation-actions/:id
   */
  static async getActionById(id: string): Promise<RemediationAction> {
    try {
      const response = await apiClient.get(`/remediation-actions/${id}`);
      return response;
    } catch (error: any) {
      console.error("Get remediation action error:", error);
      throw new Error(error.message || "Failed to fetch remediation action");
    }
  }

  /**
   * Get actions by source - GET /api/remediation-actions/by-source/:sourceType/:sourceId
   */
  static async getActionsBySource(sourceType: SourceType, sourceId: string): Promise<RemediationAction[]> {
    try {
      const response = await apiClient.get(`/remediation-actions/by-source/${sourceType}/${sourceId}`);
      return response;
    } catch (error: any) {
      console.error("Get actions by source error:", error);
      throw new Error(error.message || "Failed to fetch remediation actions by source");
    }
  }

  /**
   * Create new remediation action - POST /api/remediation-actions
   */
  static async createAction(data: CreateRemediationActionDto): Promise<RemediationAction> {
    try {
      const response = await apiClient.post("/remediation-actions", data);
      return response;
    } catch (error: any) {
      console.error("Create remediation action error:", error);
      throw new Error(error.message || "Failed to create remediation action");
    }
  }

  /**
   * Update remediation action - PATCH /api/remediation-actions/:id
   */
  static async updateAction(id: string, data: UpdateRemediationActionDto): Promise<RemediationAction> {
    try {
      const response = await apiClient.patch(`/remediation-actions/${id}`, data);
      return response;
    } catch (error: any) {
      console.error("Update remediation action error:", error);
      throw new Error(error.message || "Failed to update remediation action");
    }
  }

  /**
   * Delete remediation action - DELETE /api/remediation-actions/:id
   */
  static async deleteAction(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.delete(`/remediation-actions/${id}`);
      return response;
    } catch (error: any) {
      console.error("Delete remediation action error:", error);
      throw new Error(error.message || "Failed to delete remediation action");
    }
  }

  /**
   * Bulk update status - PATCH /api/remediation-actions/bulk/status
   */
  static async bulkUpdateStatus(ids: string[], status: RemediationStatus): Promise<{ success: boolean; message: string; updated: number }> {
    try {
      const response = await apiClient.patch("/remediation-actions/bulk/status", { ids, status });
      return response;
    } catch (error: any) {
      console.error("Bulk update status error:", error);
      throw new Error(error.message || "Failed to bulk update status");
    }
  }
}
