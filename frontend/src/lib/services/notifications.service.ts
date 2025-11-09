// Notifications Service - Handle notification management API calls
import { apiClient } from "../api-client";

export type NotificationPriority = "critical" | "high" | "medium" | "low";
export type NotificationType = "incident" | "threat" | "vulnerability" | "metric" | "site" | "general";
export type DeliveryChannel = "in_app" | "email" | "sms" | "webhook" | "slack";
export type SourceType = "incident" | "threat" | "vulnerability" | "metric" | "site";

export interface Notification {
  id: string;
  title: string;
  message: string;
  notificationType: NotificationType;
  priority: NotificationPriority;
  channel: DeliveryChannel;
  isRead: boolean;
  createdAt: string;
  expiresAt?: number;
  actionUrl?: string;
  actionText?: string;
  tags?: string[];
  source?: {
    type: SourceType;
    id: string;
    name: string;
  };
}

export interface NotificationStats {
  total: number;
  unread: number;
  byPriority: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  byType: Record<string, number>;
}

export interface NotificationsResponse {
  data: Notification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    unreadCount: number;
  };
}

export interface CreateNotificationDto {
  userId: string;
  title: string;
  message: string;
  notificationType: NotificationType;
  priority: NotificationPriority;
  channel?: DeliveryChannel;
  expiresAt?: number;
  actionUrl?: string;
  actionText?: string;
  tags?: string[];
  sourceType?: SourceType;
  sourceId?: string;
  sourceName?: string;
}

export interface UpdateNotificationDto {
  title?: string;
  message?: string;
  priority?: NotificationPriority;
  isRead?: boolean;
  actionUrl?: string;
  actionText?: string;
  tags?: string[];
}

export class NotificationsService {
  /**
   * Get all notifications - GET /api/notifications
   */
  static async getAllNotifications(params?: {
    isRead?: boolean;
    priority?: NotificationPriority;
    type?: NotificationType;
    userId?: string;
    page?: number;
    limit?: number;
  }): Promise<NotificationsResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.isRead !== undefined) queryParams.append("isRead", params.isRead.toString());
      if (params?.priority) queryParams.append("priority", params.priority);
      if (params?.type) queryParams.append("type", params.type);
      if (params?.userId) queryParams.append("userId", params.userId);
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());

      const queryString = queryParams.toString();
      const endpoint = queryString ? `/notifications?${queryString}` : "/notifications";
      
      const response = await apiClient.get(endpoint);
      return response;
    } catch (error: any) {
      console.error("Get notifications error:", error);
      throw new Error(error.message || "Failed to fetch notifications");
    }
  }

  /**
   * Get notification statistics - GET /api/notifications/statistics
   */
  static async getStatistics(userId?: string): Promise<NotificationStats> {
    try {
      const queryParam = userId ? `?userId=${userId}` : "";
      const response = await apiClient.get(`/notifications/statistics${queryParam}`);
      return response;
    } catch (error: any) {
      console.error("Get notification stats error:", error);
      throw new Error(error.message || "Failed to fetch notification statistics");
    }
  }

  /**
   * Get high priority notifications - GET /api/notifications/high-priority
   */
  static async getHighPriorityNotifications(userId?: string): Promise<Notification[]> {
    try {
      const queryParam = userId ? `?userId=${userId}` : "";
      const response = await apiClient.get(`/notifications/high-priority${queryParam}`);
      return response;
    } catch (error: any) {
      console.error("Get high priority notifications error:", error);
      throw new Error(error.message || "Failed to fetch high priority notifications");
    }
  }

  /**
   * Get user-specific notifications - GET /api/notifications/user/:userId
   */
  static async getUserNotifications(
    userId: string,
    params?: { page?: number; limit?: number; isRead?: boolean }
  ): Promise<NotificationsResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.isRead !== undefined) queryParams.append("isRead", params.isRead.toString());

      const queryString = queryParams.toString();
      const endpoint = queryString 
        ? `/notifications/user/${userId}?${queryString}`
        : `/notifications/user/${userId}`;
      
      const response = await apiClient.get(endpoint);
      return response;
    } catch (error: any) {
      console.error("Get user notifications error:", error);
      throw new Error(error.message || "Failed to fetch user notifications");
    }
  }

  /**
   * Get notifications by source - GET /api/notifications/by-source/:sourceType/:sourceId
   */
  static async getNotificationsBySource(sourceType: SourceType, sourceId: string): Promise<Notification[]> {
    try {
      const response = await apiClient.get(`/notifications/by-source/${sourceType}/${sourceId}`);
      return response;
    } catch (error: any) {
      console.error("Get notifications by source error:", error);
      throw new Error(error.message || "Failed to fetch notifications by source");
    }
  }

  /**
   * Get notification by ID - GET /api/notifications/:id
   */
  static async getNotificationById(id: string): Promise<Notification> {
    try {
      const response = await apiClient.get(`/notifications/${id}`);
      return response;
    } catch (error: any) {
      console.error("Get notification error:", error);
      throw new Error(error.message || "Failed to fetch notification");
    }
  }

  /**
   * Create new notification - POST /api/notifications
   */
  static async createNotification(data: CreateNotificationDto): Promise<Notification> {
    try {
      const response = await apiClient.post("/notifications", data);
      return response;
    } catch (error: any) {
      console.error("Create notification error:", error);
      throw new Error(error.message || "Failed to create notification");
    }
  }

  /**
   * Create multiple notifications - POST /api/notifications/bulk
   */
  static async bulkCreateNotifications(notifications: CreateNotificationDto[]): Promise<{ success: boolean; created: number }> {
    try {
      const response = await apiClient.post("/notifications/bulk", { notifications });
      return response;
    } catch (error: any) {
      console.error("Bulk create notifications error:", error);
      throw new Error(error.message || "Failed to bulk create notifications");
    }
  }

  /**
   * Update notification - PATCH /api/notifications/:id
   */
  static async updateNotification(id: string, data: UpdateNotificationDto): Promise<Notification> {
    try {
      const response = await apiClient.patch(`/notifications/${id}`, data);
      return response;
    } catch (error: any) {
      console.error("Update notification error:", error);
      throw new Error(error.message || "Failed to update notification");
    }
  }

  /**
   * Mark notification as read - PATCH /api/notifications/:id/read
   */
  static async markAsRead(id: string): Promise<Notification> {
    try {
      const response = await apiClient.patch(`/notifications/${id}/read`, {});
      return response;
    } catch (error: any) {
      console.error("Mark as read error:", error);
      throw new Error(error.message || "Failed to mark notification as read");
    }
  }

  /**
   * Mark all user notifications as read - PATCH /api/notifications/user/:userId/read-all
   */
  static async markAllAsRead(userId: string): Promise<{ success: boolean; message: string; updated: number }> {
    try {
      const response = await apiClient.patch(`/notifications/user/${userId}/read-all`, {});
      return response;
    } catch (error: any) {
      console.error("Mark all as read error:", error);
      throw new Error(error.message || "Failed to mark all notifications as read");
    }
  }

  /**
   * Bulk mark as read - PATCH /api/notifications/bulk/read
   */
  static async bulkMarkAsRead(ids: string[]): Promise<{ success: boolean; message: string; updated: number }> {
    try {
      const response = await apiClient.patch("/notifications/bulk/read", { ids });
      return response;
    } catch (error: any) {
      console.error("Bulk mark as read error:", error);
      throw new Error(error.message || "Failed to bulk mark as read");
    }
  }

  /**
   * Delete notification - DELETE /api/notifications/:id
   */
  static async deleteNotification(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.delete(`/notifications/${id}`);
      return response;
    } catch (error: any) {
      console.error("Delete notification error:", error);
      throw new Error(error.message || "Failed to delete notification");
    }
  }

  /**
   * Clean up expired notifications - DELETE /api/notifications/cleanup-expired
   */
  static async cleanupExpiredNotifications(): Promise<{ success: boolean; message: string; deleted: number }> {
    try {
      const response = await apiClient.delete("/notifications/cleanup-expired");
      return response;
    } catch (error: any) {
      console.error("Cleanup expired error:", error);
      throw new Error(error.message || "Failed to cleanup expired notifications");
    }
  }
}
