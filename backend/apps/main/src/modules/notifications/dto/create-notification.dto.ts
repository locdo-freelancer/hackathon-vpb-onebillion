import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsObject,
  IsArray,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  NotificationType,
  NotificationPriority,
  NotificationChannel,
} from '@lib/constant';

export class CreateNotificationDto {
  @ApiProperty({ description: "User ID to receive this notification" })
  @IsString()
  user_id: string;

  @ApiProperty({
    description: "Type of notification",
    enum: NotificationType,
    default: NotificationType.INFO,
  })
  @IsEnum(NotificationType)
  notification_type: NotificationType;

  @ApiProperty({
    description: "Priority level of the notification",
    enum: NotificationPriority,
    default: NotificationPriority.MEDIUM,
  })
  @IsEnum(NotificationPriority)
  priority: NotificationPriority;

  @ApiProperty({ description: "Notification title" })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: "Detailed notification message" })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiProperty({
    description: "Delivery channel for the notification",
    enum: NotificationChannel,
    default: NotificationChannel.IN_APP,
  })
  @IsEnum(NotificationChannel)
  channel: NotificationChannel;

  @ApiPropertyOptional({ description: "Associated incident ID" })
  @IsOptional()
  @IsString()
  incident_id?: string;

  @ApiPropertyOptional({ description: "Associated site ID" })
  @IsOptional()
  @IsString()
  site_id?: string;

  @ApiPropertyOptional({ description: "Associated threat indicator ID" })
  @IsOptional()
  @IsString()
  threat_indicator_id?: string;

  @ApiPropertyOptional({ description: "Associated security metric ID" })
  @IsOptional()
  @IsString()
  security_metric_id?: string;

  @ApiPropertyOptional({ description: "URL for action button" })
  @IsOptional()
  @IsString()
  action_url?: string;

  @ApiPropertyOptional({ description: "Text for action button" })
  @IsOptional()
  @IsString()
  action_text?: string;

  @ApiPropertyOptional({
    description: "Expiration timestamp for the notification",
  })
  @IsOptional()
  @IsNumber()
  expires_at?: number;

  @ApiPropertyOptional({
    description: "Tags for categorization",
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({
    description: "Additional metadata as key-value pairs",
    type: "object",
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

