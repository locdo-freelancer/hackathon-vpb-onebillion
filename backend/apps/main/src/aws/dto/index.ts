import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsOptional, IsEnum } from "class-validator";

export class LogIngestionDto {
  @ApiProperty({ description: 'Agent ID' })
  @IsString()
  agentId: string;

  @ApiProperty({ description: 'Site ID' })
  @IsString()
  siteId: string;

  @ApiProperty({ description: 'Log type' })
  @IsString()
  logType: string;

  @ApiProperty({ description: 'Log content' })
  @IsString()
  logContent: string;

  @ApiPropertyOptional({ 
    description: 'Priority level',
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  })
  @IsOptional()
  @IsEnum(['low', 'medium', 'high', 'critical'])
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

export class BulkEnrichmentDto {
  @ApiProperty({ 
    description: 'Indicators to enrich',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        value: { type: 'string' },
        type: { type: 'string', enum: ['ip', 'domain', 'url', 'hash'] }
      }
    }
  })
  indicators: Array<{
    value: string;
    type: 'ip' | 'domain' | 'url' | 'hash';
  }>;
}

export class NotificationDto {
  @ApiProperty({ description: 'User ID' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'Notification type' })
  @IsString()
  type: string;

  @ApiProperty({ description: 'Notification title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Notification message' })
  @IsString()
  message: string;

  @ApiProperty({ 
    description: 'Priority level',
    enum: ['low', 'medium', 'high', 'critical']
  })
  @IsEnum(['low', 'medium', 'high', 'critical'])
  priority: 'low' | 'medium' | 'high' | 'critical';

  @ApiProperty({ 
    description: 'Delivery channels',
    type: [String],
    example: ['email', 'slack', 'sms']
  })
  channels: string[];

  @ApiPropertyOptional({ description: 'Additional data' })
  @IsOptional()
  data?: any;
}
