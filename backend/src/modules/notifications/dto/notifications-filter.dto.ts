import {
  IsOptional,
  IsString,
  IsEnum,
  IsBoolean,
  IsNumber,
  IsArray,
} from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  NotificationType,
  NotificationPriority,
  NotificationChannel,
} from "libs/entities/src/notification.entity";

export class NotificationsFilterDto {
  @ApiPropertyOptional({ description: "Filter by user ID" })
  @IsOptional()
  @IsString()
  user_id?: string;

  @ApiPropertyOptional({
    description: "Filter by notification type",
    enum: NotificationType,
  })
  @IsOptional()
  @IsEnum(NotificationType)
  notification_type?: NotificationType;

  @ApiPropertyOptional({
    description: "Filter by priority level",
    enum: NotificationPriority,
  })
  @IsOptional()
  @IsEnum(NotificationPriority)
  priority?: NotificationPriority;

  @ApiPropertyOptional({
    description: "Filter by delivery channel",
    enum: NotificationChannel,
  })
  @IsOptional()
  @IsEnum(NotificationChannel)
  channel?: NotificationChannel;

  @ApiPropertyOptional({
    description: "Filter by read status",
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  is_read?: boolean;

  @ApiPropertyOptional({ description: "Filter by incident ID" })
  @IsOptional()
  @IsString()
  incident_id?: string;

  @ApiPropertyOptional({ description: "Filter by site ID" })
  @IsOptional()
  @IsString()
  site_id?: string;

  @ApiPropertyOptional({ description: "Filter by threat indicator ID" })
  @IsOptional()
  @IsString()
  threat_indicator_id?: string;

  @ApiPropertyOptional({ description: "Filter by security metric ID" })
  @IsOptional()
  @IsString()
  security_metric_id?: string;

  @ApiPropertyOptional({
    description: "Filter by tags",
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ description: "Filter by title (partial match)" })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: "Filter by minimum creation date (timestamp)",
  })
  @IsOptional()
  @IsNumber()
  created_from?: number;

  @ApiPropertyOptional({
    description: "Filter by maximum creation date (timestamp)",
  })
  @IsOptional()
  @IsNumber()
  created_to?: number;

  @ApiPropertyOptional({
    description: "Filter by minimum expiration date (timestamp)",
  })
  @IsOptional()
  @IsNumber()
  expires_from?: number;

  @ApiPropertyOptional({
    description: "Filter by maximum expiration date (timestamp)",
  })
  @IsOptional()
  @IsNumber()
  expires_to?: number;

  @ApiPropertyOptional({
    description: "Page number for pagination",
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @ApiPropertyOptional({
    description: "Items per page for pagination",
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  limit?: number = 10;

  @ApiPropertyOptional({
    description: "Sort field",
    default: "created_at",
  })
  @IsOptional()
  @IsString()
  sort_by?: string = "created_at";

  @ApiPropertyOptional({
    description: "Sort order",
    enum: ["ASC", "DESC"],
    default: "DESC",
  })
  @IsOptional()
  @IsString()
  sort_order?: "ASC" | "DESC" = "DESC";
}
