import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "libs/guards/src";
import { NotificationsService } from "./notifications.service";
import {
  CreateNotificationDto,
  UpdateNotificationDto,
  NotificationsFilterDto,
} from "./dto";

@ApiTags("Notifications")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @ApiOperation({
    summary: "Create a new notification",
    description: "Creates a new notification for a user from various sources",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Notification created successfully",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid input data",
  })
  async create(@Body() createDto: CreateNotificationDto) {
    const notification = await this.notificationsService.create(createDto);

    return {
      success: true,
      message: "Notification created successfully",
      data: notification,
    };
  }

  @Post("bulk")
  @ApiOperation({
    summary: "Create multiple notifications",
    description: "Creates multiple notifications in a single operation",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Notifications created successfully",
  })
  async createBulk(@Body() createDtos: CreateNotificationDto[]) {
    const notifications =
      await this.notificationsService.createBulkNotifications(createDtos);

    return {
      success: true,
      message: `${notifications.length} notifications created successfully`,
      data: notifications,
    };
  }

  @Get()
  @ApiOperation({
    summary: "Get all notifications with filtering",
    description:
      "Retrieves a paginated list of notifications with optional filtering",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Notifications retrieved successfully",
  })
  async findAll(@Query() filters: NotificationsFilterDto) {
    const result = await this.notificationsService.findAll(filters);

    return {
      success: true,
      message: "Notifications retrieved successfully",
      data: result.data,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
        unreadCount: result.unreadCount,
      },
    };
  }

  @Get("statistics")
  @ApiOperation({
    summary: "Get notification statistics",
    description: "Retrieves comprehensive statistics about notifications",
  })
  @ApiQuery({
    name: "user_id",
    required: false,
    description: "Filter statistics by user ID",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Statistics retrieved successfully",
  })
  async getStatistics(@Query("user_id") userId?: string) {
    const statistics = await this.notificationsService.getStatistics(userId);

    return {
      success: true,
      message: "Statistics retrieved successfully",
      data: statistics,
    };
  }

  @Get("high-priority")
  @ApiOperation({
    summary: "Get high priority notifications",
    description: "Retrieves unread high and critical priority notifications",
  })
  @ApiQuery({
    name: "user_id",
    required: false,
    description: "Filter by user ID",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "High priority notifications retrieved successfully",
  })
  async getHighPriorityNotifications(@Query("user_id") userId?: string) {
    const notifications =
      await this.notificationsService.getHighPriorityNotifications(userId);

    return {
      success: true,
      message: "High priority notifications retrieved successfully",
      data: notifications,
    };
  }

  @Get("user/:userId")
  @ApiOperation({
    summary: "Get notifications for a specific user",
    description:
      "Retrieves notifications for a specific user with optional unread filter",
  })
  @ApiQuery({
    name: "unread_only",
    required: false,
    description: "Show only unread notifications",
    type: "boolean",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    description: "Maximum number of notifications to return",
    type: "number",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User notifications retrieved successfully",
  })
  async getUserNotifications(
    @Param("userId") userId: string,
    @Query("unread_only") unreadOnly = false,
    @Query("limit") limit = 50
  ) {
    const notifications = await this.notificationsService.getUserNotifications(
      userId,
      Boolean(unreadOnly),
      Number(limit)
    );

    return {
      success: true,
      message: "User notifications retrieved successfully",
      data: notifications,
    };
  }

  @Get("by-source/:sourceType/:sourceId")
  @ApiOperation({
    summary: "Get notifications by source",
    description:
      "Retrieves notifications associated with a specific source (incident, site, threat, security_metric)",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Source notifications retrieved successfully",
  })
  async getNotificationsBySource(
    @Param("sourceType")
    sourceType: "incident" | "site" | "threat" | "security_metric",
    @Param("sourceId") sourceId: string
  ) {
    const notifications =
      await this.notificationsService.getNotificationsBySource(
        sourceType,
        sourceId
      );

    return {
      success: true,
      message: "Source notifications retrieved successfully",
      data: notifications,
    };
  }

  @Get(":id")
  @ApiOperation({
    summary: "Get a specific notification",
    description: "Retrieves detailed information about a specific notification",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Notification retrieved successfully",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Notification not found",
  })
  async findOne(@Param("id") id: string) {
    const notification = await this.notificationsService.findOne(id);

    return {
      success: true,
      message: "Notification retrieved successfully",
      data: notification,
    };
  }

  @Patch(":id")
  @ApiOperation({
    summary: "Update a notification",
    description: "Updates an existing notification with new information",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Notification updated successfully",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Notification not found",
  })
  async update(
    @Param("id") id: string,
    @Body() updateDto: UpdateNotificationDto
  ) {
    const notification = await this.notificationsService.update(id, updateDto);

    return {
      success: true,
      message: "Notification updated successfully",
      data: notification,
    };
  }

  @Patch(":id/read")
  @ApiOperation({
    summary: "Mark notification as read",
    description: "Marks a specific notification as read",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Notification marked as read successfully",
  })
  async markAsRead(@Param("id") id: string) {
    const notification = await this.notificationsService.markAsRead(id);

    return {
      success: true,
      message: "Notification marked as read successfully",
      data: notification,
    };
  }

  @Patch("user/:userId/read-all")
  @ApiOperation({
    summary: "Mark all user notifications as read",
    description: "Marks all unread notifications for a user as read",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "All notifications marked as read successfully",
  })
  async markAllAsRead(@Param("userId") userId: string) {
    const result = await this.notificationsService.markAllAsRead(userId);

    return {
      success: true,
      message: `${result.updated} notifications marked as read successfully`,
      data: result,
    };
  }

  @Patch("bulk/read")
  @ApiOperation({
    summary: "Bulk mark notifications as read",
    description: "Marks multiple notifications as read at once",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Bulk read operation completed",
  })
  async bulkMarkAsRead(@Body() body: { ids: string[] }) {
    const result = await this.notificationsService.bulkMarkAsRead(body.ids);

    return {
      success: true,
      message: `Bulk read completed. ${result.updated} notifications marked as read.`,
      data: {
        updated: result.updated,
        errors: result.errors,
      },
    };
  }

  @Delete("cleanup-expired")
  @ApiOperation({
    summary: "Cleanup expired notifications",
    description: "Removes all expired notifications from the system",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Expired notifications cleaned up successfully",
  })
  async cleanupExpired() {
    const result =
      await this.notificationsService.cleanupExpiredNotifications();

    return {
      success: true,
      message: `${result.deleted} expired notifications cleaned up successfully`,
      data: result,
    };
  }

  @Delete(":id")
  @ApiOperation({
    summary: "Delete a notification",
    description: "Deletes a specific notification permanently",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Notification deleted successfully",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Notification not found",
  })
  async remove(@Param("id") id: string) {
    await this.notificationsService.remove(id);

    return {
      success: true,
      message: "Notification deleted successfully",
    };
  }
}
