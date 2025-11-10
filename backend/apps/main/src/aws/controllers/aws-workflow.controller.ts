import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@lib/guards';
import { WorkflowService } from '../../aws/services/workflow.service';
import { LogIngestionDto, BulkEnrichmentDto, NotificationDto } from '../dto';


@ApiTags('aws-workflows')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('aws/workflows')
export class AwsWorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Post('log-ingestion')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: 'Process log ingestion workflow',
    description: 'Trigger AWS workflow for log processing, storage, and analysis',
  })
  @ApiResponse({
    status: 202,
    description: 'Log ingestion workflow initiated',
    schema: {
      type: 'object',
      properties: {
        workflowId: { type: 'string' },
        s3Key: { type: 'string' },
        sqsMessageId: { type: 'string' },
        status: { type: 'string' },
      },
    },
  })
  async processLogIngestion(@Body() logIngestionDto: LogIngestionDto) {
    const result = await this.workflowService.processLogIngestion({
      agentId: logIngestionDto.agentId,
      siteId: logIngestionDto.siteId,
      logType: logIngestionDto.logType,
      logContent: logIngestionDto.logContent,
      priority: logIngestionDto.priority || 'medium',
    });

    return {
      ...result,
      status: 'initiated',
      message: 'Log ingestion workflow started successfully',
    };
  }

  @Post('bulk-enrichment')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: 'Process bulk enrichment workflow',
    description: 'Trigger AWS workflow for bulk threat intelligence enrichment',
  })
  @ApiResponse({
    status: 202,
    description: 'Bulk enrichment workflow initiated',
    schema: {
      type: 'object',
      properties: {
        workflowId: { type: 'string' },
        requestIds: { type: 'array', items: { type: 'string' } },
        status: { type: 'string' },
      },
    },
  })
  async processBulkEnrichment(@Body() bulkEnrichmentDto: BulkEnrichmentDto) {
    const result = await this.workflowService.processBulkEnrichment(
      bulkEnrichmentDto.indicators
    );

    return {
      ...result,
      status: 'initiated',
      message: `Bulk enrichment workflow started for ${bulkEnrichmentDto.indicators.length} indicators`,
    };
  }

  @Post('notification')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: 'Process notification workflow',
    description: 'Trigger AWS workflow for multi-channel notification delivery',
  })
  @ApiResponse({
    status: 202,
    description: 'Notification workflow initiated',
    schema: {
      type: 'object',
      properties: {
        workflowId: { type: 'string' },
        sqsMessageId: { type: 'string' },
        status: { type: 'string' },
      },
    },
  })
  async processNotification(@Body() notificationDto: NotificationDto) {
    const result = await this.workflowService.processNotificationWorkflow({
      userId: notificationDto.userId,
      type: notificationDto.type,
      title: notificationDto.title,
      message: notificationDto.message,
      priority: notificationDto.priority,
      channels: notificationDto.channels,
      data: notificationDto.data,
    });

    return {
      ...result,
      status: 'initiated',
      message: 'Notification workflow started successfully',
    };
  }
}