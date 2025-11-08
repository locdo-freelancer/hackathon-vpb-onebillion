import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder, In } from "typeorm";
import {
  Notification,
  NotificationPriority,
} from "libs/entities/src/notification.entity";
import {
  CreateNotificationDto,
  UpdateNotificationDto,
  NotificationsFilterDto,
} from "./dto";

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>
  ) {}

  async create(createDto: CreateNotificationDto): Promise<Notification> {
    const notification = this.notificationRepository.create(createDto);
    return await this.notificationRepository.save(notification);
  }

  async findAll(filters: NotificationsFilterDto): Promise<{
    data: Notification[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    unreadCount: number;
  }> {
    const queryBuilder = this.createQueryBuilder(filters);

    // Get unread count for the same filters but with is_read = false
    const unreadQueryBuilder = this.createQueryBuilder({
      ...filters,
      is_read: false,
    });
    const unreadCount = await unreadQueryBuilder.getCount();

    // Apply pagination
    const { page = 1, limit = 10 } = filters;
    const offset = (page - 1) * limit;

    queryBuilder.skip(offset).take(limit);

    // Apply sorting
    const { sort_by = "created_at", sort_order = "DESC" } = filters;
    queryBuilder.orderBy(`notification.${sort_by}`, sort_order);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      unreadCount,
    };
  }

  async findOne(id: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
      relations: [
        "user",
        "incident",
        "site",
        "threatIndicator",
        "securityMetric",
      ],
    });

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    return notification;
  }

  async update(
    id: string,
    updateDto: UpdateNotificationDto
  ): Promise<Notification> {
    const notification = await this.findOne(id);

    // If marking as read, set read_at timestamp
    if (updateDto.is_read === true && !notification.is_read) {
      updateDto.read_at = Date.now();
    }

    await this.notificationRepository.update(id, updateDto);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const notification = await this.findOne(id);
    await this.notificationRepository.remove(notification);
  }

  async markAsRead(id: string): Promise<Notification> {
    return await this.update(id, {
      is_read: true,
      read_at: Date.now(),
    });
  }

  async markAllAsRead(userId: string): Promise<{ updated: number }> {
    const result = await this.notificationRepository.update(
      { user_id: userId, is_read: false },
      { is_read: true, read_at: Date.now() }
    );

    return { updated: result.affected || 0 };
  }

  async bulkMarkAsRead(
    ids: string[]
  ): Promise<{ updated: number; errors: string[] }> {
    const errors: string[] = [];
    let updated = 0;

    for (const id of ids) {
      try {
        await this.markAsRead(id);
        updated++;
      } catch (error) {
        errors.push(`Failed to mark ${id} as read: ${error.message}`);
      }
    }

    return { updated, errors };
  }

  async getUserNotifications(
    userId: string,
    unreadOnly = false,
    limit = 50
  ): Promise<Notification[]> {
    const queryBuilder = this.notificationRepository
      .createQueryBuilder("notification")
      .leftJoinAndSelect("notification.incident", "incident")
      .leftJoinAndSelect("notification.site", "site")
      .leftJoinAndSelect("notification.threatIndicator", "threatIndicator")
      .leftJoinAndSelect("notification.securityMetric", "securityMetric")
      .where("notification.user_id = :userId", { userId })
      .orderBy("notification.created_at", "DESC")
      .take(limit);

    if (unreadOnly) {
      queryBuilder.andWhere("notification.is_read = :isRead", {
        isRead: false,
      });
    }

    // Filter out expired notifications
    const now = Date.now();
    queryBuilder.andWhere(
      "(notification.expires_at IS NULL OR notification.expires_at > :now)",
      { now }
    );

    return await queryBuilder.getMany();
  }

  async getNotificationsBySource(
    sourceType: "incident" | "site" | "threat" | "security_metric",
    sourceId: string
  ): Promise<Notification[]> {
    const whereCondition: any = {};

    switch (sourceType) {
      case "incident":
        whereCondition.incident_id = sourceId;
        break;
      case "site":
        whereCondition.site_id = sourceId;
        break;
      case "threat":
        whereCondition.threat_indicator_id = sourceId;
        break;
      case "security_metric":
        whereCondition.security_metric_id = sourceId;
        break;
    }

    return await this.notificationRepository.find({
      where: whereCondition,
      relations: ["user"],
      order: { createdAt: "DESC" },
    });
  }

  async getStatistics(userId?: string): Promise<{
    total: number;
    unread: number;
    byType: Record<string, number>;
    byPriority: Record<string, number>;
    byChannel: Record<string, number>;
    recent: number; // Last 24 hours
    expired: number;
  }> {
    let queryBuilder =
      this.notificationRepository.createQueryBuilder("notification");

    if (userId) {
      queryBuilder = queryBuilder.where("notification.user_id = :userId", {
        userId,
      });
    }

    const notifications = await queryBuilder.getMany();

    const stats = {
      total: notifications.length,
      unread: 0,
      byType: {} as Record<string, number>,
      byPriority: {} as Record<string, number>,
      byChannel: {} as Record<string, number>,
      recent: 0,
      expired: 0,
    };

    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;

    notifications.forEach((notification) => {
      // Count unread
      if (!notification.is_read) {
        stats.unread++;
      }

      // Count by type
      stats.byType[notification.notification_type] =
        (stats.byType[notification.notification_type] || 0) + 1;

      // Count by priority
      stats.byPriority[notification.priority] =
        (stats.byPriority[notification.priority] || 0) + 1;

      // Count by channel
      stats.byChannel[notification.channel] =
        (stats.byChannel[notification.channel] || 0) + 1;

      // Count recent (last 24 hours)
      if (
        notification.createdAt &&
        notification.createdAt.getTime() > oneDayAgo
      ) {
        stats.recent++;
      }

      // Count expired
      if (notification.expires_at && notification.expires_at < now) {
        stats.expired++;
      }
    });

    return stats;
  }

  async createBulkNotifications(
    notifications: CreateNotificationDto[]
  ): Promise<Notification[]> {
    const notificationEntities = notifications.map((notification) =>
      this.notificationRepository.create(notification)
    );

    return await this.notificationRepository.save(notificationEntities);
  }

  async cleanupExpiredNotifications(): Promise<{ deleted: number }> {
    const now = Date.now();

    const result = await this.notificationRepository.delete({
      expires_at: { $lt: now } as any,
    });

    return { deleted: result.affected || 0 };
  }

  async getHighPriorityNotifications(userId?: string): Promise<Notification[]> {
    let queryBuilder = this.notificationRepository
      .createQueryBuilder("notification")
      .leftJoinAndSelect("notification.incident", "incident")
      .leftJoinAndSelect("notification.site", "site")
      .leftJoinAndSelect("notification.threatIndicator", "threatIndicator")
      .leftJoinAndSelect("notification.securityMetric", "securityMetric")
      .where("notification.priority IN (:...priorities)", {
        priorities: [NotificationPriority.HIGH, NotificationPriority.CRITICAL],
      })
      .andWhere("notification.is_read = :isRead", { isRead: false })
      .orderBy("notification.priority", "DESC")
      .addOrderBy("notification.created_at", "DESC");

    if (userId) {
      queryBuilder = queryBuilder.andWhere("notification.user_id = :userId", {
        userId,
      });
    }

    // Filter out expired notifications
    const now = Date.now();
    queryBuilder.andWhere(
      "(notification.expires_at IS NULL OR notification.expires_at > :now)",
      { now }
    );

    return await queryBuilder.getMany();
  }

  private createQueryBuilder(
    filters: NotificationsFilterDto
  ): SelectQueryBuilder<Notification> {
    let queryBuilder = this.notificationRepository
      .createQueryBuilder("notification")
      .leftJoinAndSelect("notification.user", "user")
      .leftJoinAndSelect("notification.incident", "incident")
      .leftJoinAndSelect("notification.site", "site")
      .leftJoinAndSelect("notification.threatIndicator", "threatIndicator")
      .leftJoinAndSelect("notification.securityMetric", "securityMetric");

    // Apply filters
    if (filters.user_id) {
      queryBuilder = queryBuilder.andWhere("notification.user_id = :userId", {
        userId: filters.user_id,
      });
    }

    if (filters.notification_type) {
      queryBuilder = queryBuilder.andWhere(
        "notification.notification_type = :notificationType",
        { notificationType: filters.notification_type }
      );
    }

    if (filters.priority) {
      queryBuilder = queryBuilder.andWhere(
        "notification.priority = :priority",
        { priority: filters.priority }
      );
    }

    if (filters.channel) {
      queryBuilder = queryBuilder.andWhere("notification.channel = :channel", {
        channel: filters.channel,
      });
    }

    if (filters.is_read !== undefined) {
      queryBuilder = queryBuilder.andWhere("notification.is_read = :isRead", {
        isRead: filters.is_read,
      });
    }

    if (filters.incident_id) {
      queryBuilder = queryBuilder.andWhere(
        "notification.incident_id = :incidentId",
        { incidentId: filters.incident_id }
      );
    }

    if (filters.site_id) {
      queryBuilder = queryBuilder.andWhere("notification.site_id = :siteId", {
        siteId: filters.site_id,
      });
    }

    if (filters.threat_indicator_id) {
      queryBuilder = queryBuilder.andWhere(
        "notification.threat_indicator_id = :threatId",
        { threatId: filters.threat_indicator_id }
      );
    }

    if (filters.security_metric_id) {
      queryBuilder = queryBuilder.andWhere(
        "notification.security_metric_id = :metricId",
        { metricId: filters.security_metric_id }
      );
    }

    if (filters.title) {
      queryBuilder = queryBuilder.andWhere("notification.title ILIKE :title", {
        title: `%${filters.title}%`,
      });
    }

    if (filters.tags && filters.tags.length > 0) {
      queryBuilder = queryBuilder.andWhere("notification.tags && :tags", {
        tags: filters.tags,
      });
    }

    if (filters.created_from) {
      queryBuilder = queryBuilder.andWhere(
        "notification.created_at >= :createdFrom",
        { createdFrom: new Date(filters.created_from) }
      );
    }

    if (filters.created_to) {
      queryBuilder = queryBuilder.andWhere(
        "notification.created_at <= :createdTo",
        { createdTo: new Date(filters.created_to) }
      );
    }

    if (filters.expires_from) {
      queryBuilder = queryBuilder.andWhere(
        "notification.expires_at >= :expiresFrom",
        { expiresFrom: filters.expires_from }
      );
    }

    if (filters.expires_to) {
      queryBuilder = queryBuilder.andWhere(
        "notification.expires_at <= :expiresTo",
        { expiresTo: filters.expires_to }
      );
    }

    // Filter out expired notifications by default
    const now = Date.now();
    queryBuilder.andWhere(
      "(notification.expires_at IS NULL OR notification.expires_at > :now)",
      { now }
    );

    return queryBuilder;
  }
}
