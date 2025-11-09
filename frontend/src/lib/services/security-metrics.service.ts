// Security Metrics Service - Handle security metrics API calls
import { apiClient } from "../api-client";

export type MetricCategory = "security" | "performance" | "compliance" | "operational";
export type MetricType = 
  | "security_score" 
  | "attack_count" 
  | "vulnerability_count" 
  | "threat_level"
  | "incident_count"
  | "remediation_rate"
  | "uptime"
  | "compliance_score";
export type AlertLevel = "none" | "low" | "medium" | "high" | "critical";

export interface SecurityMetric {
  id: string;
  siteName: string;
  metricName: string;
  metricType: MetricType;
  category: MetricCategory;
  metricValue: number;
  unit: string;
  recordedAt: number;
  currentAlertLevel: AlertLevel;
  changePercentage?: number;
  previousValue?: number;
  thresholds?: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
}

export interface MetricStats {
  total: number;
  active: number;
  byType: Record<string, number>;
  trends: {
    improving: number;
    degrading: number;
    stable: number;
  };
}

export interface MetricsResponse {
  data: SecurityMetric[];
  statistics: MetricStats;
}

export interface CreateMetricDto {
  siteId: string;
  metricName: string;
  metricType: MetricType;
  category: MetricCategory;
  metricValue: number;
  unit?: string;
  thresholds?: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
}

export interface UpdateMetricDto {
  metricValue?: number;
  metricName?: string;
  category?: MetricCategory;
  thresholds?: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
}

export interface AlertCount {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface HistoricalData {
  timestamp: number;
  value: number;
  alertLevel: AlertLevel;
}

export class SecurityMetricsService {
  /**
   * Get all metrics - GET /api/security-metrics
   */
  static async getAllMetrics(params?: {
    siteId?: string;
    metricType?: MetricType;
    category?: MetricCategory;
    alertLevel?: AlertLevel;
    startDate?: number;
    endDate?: number;
    page?: number;
    limit?: number;
  }): Promise<MetricsResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.siteId) queryParams.append("siteId", params.siteId);
      if (params?.metricType) queryParams.append("metricType", params.metricType);
      if (params?.category) queryParams.append("category", params.category);
      if (params?.alertLevel) queryParams.append("alertLevel", params.alertLevel);
      if (params?.startDate) queryParams.append("startDate", params.startDate.toString());
      if (params?.endDate) queryParams.append("endDate", params.endDate.toString());
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());

      const queryString = queryParams.toString();
      const endpoint = queryString ? `/security-metrics?${queryString}` : "/security-metrics";
      
      const response = await apiClient.get(endpoint);
      return response;
    } catch (error: any) {
      console.error("Get security metrics error:", error);
      throw new Error(error.message || "Failed to fetch security metrics");
    }
  }

  /**
   * Get comprehensive statistics - GET /api/security-metrics/statistics
   */
  static async getStatistics(): Promise<MetricStats> {
    try {
      const response = await apiClient.get("/security-metrics/statistics");
      return response;
    } catch (error: any) {
      console.error("Get metrics statistics error:", error);
      throw new Error(error.message || "Failed to fetch metrics statistics");
    }
  }

  /**
   * Get alert count by severity - GET /api/security-metrics/alerts
   */
  static async getAlertCount(siteId?: string): Promise<AlertCount> {
    try {
      const queryParam = siteId ? `?siteId=${siteId}` : "";
      const response = await apiClient.get(`/security-metrics/alerts${queryParam}`);
      return response;
    } catch (error: any) {
      console.error("Get alert count error:", error);
      throw new Error(error.message || "Failed to fetch alert count");
    }
  }

  /**
   * Get latest metrics for each type - GET /api/security-metrics/latest
   */
  static async getLatestMetrics(siteId?: string): Promise<SecurityMetric[]> {
    try {
      const queryParam = siteId ? `?siteId=${siteId}` : "";
      const response = await apiClient.get(`/security-metrics/latest${queryParam}`);
      return response;
    } catch (error: any) {
      console.error("Get latest metrics error:", error);
      throw new Error(error.message || "Failed to fetch latest metrics");
    }
  }

  /**
   * Get historical time-series data - GET /api/security-metrics/historical/:siteId/:metricType
   */
  static async getHistoricalData(
    siteId: string,
    metricType: MetricType,
    startDate?: number,
    endDate?: number
  ): Promise<HistoricalData[]> {
    try {
      const queryParams = new URLSearchParams();
      if (startDate) queryParams.append("startDate", startDate.toString());
      if (endDate) queryParams.append("endDate", endDate.toString());

      const queryString = queryParams.toString();
      const endpoint = queryString 
        ? `/security-metrics/historical/${siteId}/${metricType}?${queryString}`
        : `/security-metrics/historical/${siteId}/${metricType}`;
      
      const response = await apiClient.get(endpoint);
      return response;
    } catch (error: any) {
      console.error("Get historical data error:", error);
      throw new Error(error.message || "Failed to fetch historical data");
    }
  }

  /**
   * Get metrics by site - GET /api/security-metrics/site/:siteId
   */
  static async getMetricsBySite(siteId: string): Promise<SecurityMetric[]> {
    try {
      const response = await apiClient.get(`/security-metrics/site/${siteId}`);
      return response;
    } catch (error: any) {
      console.error("Get site metrics error:", error);
      throw new Error(error.message || "Failed to fetch site metrics");
    }
  }

  /**
   * Get metric by ID - GET /api/security-metrics/:id
   */
  static async getMetricById(id: string): Promise<SecurityMetric> {
    try {
      const response = await apiClient.get(`/security-metrics/${id}`);
      return response;
    } catch (error: any) {
      console.error("Get metric error:", error);
      throw new Error(error.message || "Failed to fetch metric");
    }
  }

  /**
   * Create new metric - POST /api/security-metrics
   */
  static async createMetric(data: CreateMetricDto): Promise<SecurityMetric> {
    try {
      const response = await apiClient.post("/security-metrics", data);
      return response;
    } catch (error: any) {
      console.error("Create metric error:", error);
      throw new Error(error.message || "Failed to create metric");
    }
  }

  /**
   * Create multiple metrics - POST /api/security-metrics/bulk
   */
  static async bulkCreateMetrics(metrics: CreateMetricDto[]): Promise<{ success: boolean; created: number }> {
    try {
      const response = await apiClient.post("/security-metrics/bulk", { metrics });
      return response;
    } catch (error: any) {
      console.error("Bulk create metrics error:", error);
      throw new Error(error.message || "Failed to bulk create metrics");
    }
  }

  /**
   * Update metric - PATCH /api/security-metrics/:id
   */
  static async updateMetric(id: string, data: UpdateMetricDto): Promise<SecurityMetric> {
    try {
      const response = await apiClient.patch(`/security-metrics/${id}`, data);
      return response;
    } catch (error: any) {
      console.error("Update metric error:", error);
      throw new Error(error.message || "Failed to update metric");
    }
  }

  /**
   * Delete metric - DELETE /api/security-metrics/:id
   */
  static async deleteMetric(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.delete(`/security-metrics/${id}`);
      return response;
    } catch (error: any) {
      console.error("Delete metric error:", error);
      throw new Error(error.message || "Failed to delete metric");
    }
  }
}
