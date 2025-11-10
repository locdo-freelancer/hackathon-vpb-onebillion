import { Injectable, Logger } from '@nestjs/common';
import { SQSClient, SendMessageCommand, SendMessageBatchCommand, ReceiveMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs';
import { AwsConfigService } from '../config/aws-config.service';
import { ResilienceService } from './resilience.service';

export interface QueueMessage {
  id?: string;
  body: any;
  messageAttributes?: Record<string, any>;
  delaySeconds?: number;
}

export interface SQSEventMessage {
  eventType: 'incident' | 'threat' | 'vulnerability' | 'security_metric' | 'log_ingestion';
  eventId: string;
  siteId: string;
  timestamp: number;
  data: any;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  source?: string;
}

@Injectable()
export class SqsService {
  private readonly logger = new Logger(SqsService.name);
  private readonly sqsClient: SQSClient;

  constructor(
    private awsConfigService: AwsConfigService,
    private resilienceService: ResilienceService,
  ) {
    this.sqsClient = this.awsConfigService.createSQSClient();
  }

  /**
   * Send a single message to SQS queue
   */
  async sendMessage(queueUrl: string, message: QueueMessage): Promise<string> {
    return this.resilienceService.withResilientExecution(
      `sqs-send-${queueUrl}`,
      async () => {
        const command = new SendMessageCommand({
          QueueUrl: queueUrl,
          MessageBody: JSON.stringify(message.body),
          MessageAttributes: this.formatMessageAttributes(message.messageAttributes),
          DelaySeconds: message.delaySeconds,
        });

        const result = await this.sqsClient.send(command);
        this.logger.log(`Message sent to queue ${queueUrl}: ${result.MessageId}`);
        return result.MessageId!;
      },
      { maxRetries: 3, delay: 1000 },
      { failureThreshold: 5, resetTimeout: 60000 }
    );
  }

  /**
   * Send multiple messages to SQS queue in batch
   */
  async sendMessageBatch(queueUrl: string, messages: QueueMessage[]): Promise<void> {
    try {
      const entries = messages.map((message, index) => ({
        Id: message.id || `msg-${index}`,
        MessageBody: JSON.stringify(message.body),
        MessageAttributes: this.formatMessageAttributes(message.messageAttributes),
        DelaySeconds: message.delaySeconds,
      }));

      const command = new SendMessageBatchCommand({
        QueueUrl: queueUrl,
        Entries: entries,
      });

      const result = await this.sqsClient.send(command);
      this.logger.log(`Batch sent to queue ${queueUrl}: ${result.Successful?.length} successful, ${result.Failed?.length} failed`);

      if (result.Failed && result.Failed.length > 0) {
        this.logger.error('Failed messages:', result.Failed);
      }
    } catch (error) {
      this.logger.error(`Failed to send batch to queue ${queueUrl}:`, error);
      throw error;
    }
  }

  /**
   * Send event to events queue
   */
  async sendEvent(event: SQSEventMessage): Promise<string> {
    const queueUrl = this.awsConfigService.getEventsQueueUrl();
    return this.sendMessage(queueUrl, {
      body: event,
      messageAttributes: {
        eventType: event.eventType,
        priority: event.priority || 'medium',
        siteId: event.siteId,
      },
    });
  }

  /**
   * Send notification to notifications queue
   */
  async sendNotification(notification: {
    userId: string;
    type: string;
    title: string;
    message: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    data?: any;
  }): Promise<string> {
    const queueUrl = this.awsConfigService.getNotificationsQueueUrl();
    return this.sendMessage(queueUrl, {
      body: notification,
      messageAttributes: {
        userId: notification.userId,
        type: notification.type,
        priority: notification.priority,
      },
    });
  }

  /**
   * Send enrichment request to enrichment queue
   */
  async sendEnrichmentRequest(request: {
    type: 'ip' | 'domain' | 'url' | 'hash';
    indicator: string;
    sources: string[];
    callbackEventId?: string;
    priority?: 'low' | 'medium' | 'high';
  }): Promise<string> {
    const queueUrl = this.awsConfigService.getEnrichmentQueueUrl();
    return this.sendMessage(queueUrl, {
      body: request,
      messageAttributes: {
        type: request.type,
        indicator: request.indicator,
        priority: request.priority || 'medium',
      },
    });
  }

  /**
   * Receive messages from queue (for testing/debugging)
   */
  async receiveMessages(queueUrl: string, maxMessages = 10): Promise<any[]> {
    try {
      const command = new ReceiveMessageCommand({
        QueueUrl: queueUrl,
        MaxNumberOfMessages: maxMessages,
        WaitTimeSeconds: 20, // Long polling
        MessageAttributeNames: ['All'],
      });

      const result = await this.sqsClient.send(command);
      return result.Messages || [];
    } catch (error) {
      this.logger.error(`Failed to receive messages from queue ${queueUrl}:`, error);
      throw error;
    }
  }

  /**
   * Delete message from queue
   */
  async deleteMessage(queueUrl: string, receiptHandle: string): Promise<void> {
    try {
      const command = new DeleteMessageCommand({
        QueueUrl: queueUrl,
        ReceiptHandle: receiptHandle,
      });

      await this.sqsClient.send(command);
      this.logger.log(`Message deleted from queue ${queueUrl}`);
    } catch (error) {
      this.logger.error(`Failed to delete message from queue ${queueUrl}:`, error);
      throw error;
    }
  }

  /**
   * Send log ingestion event
   */
  async sendLogIngestionEvent(logData: {
    agentId: string;
    siteId: string;
    logType: string;
    logContent: string;
    timestamp: number;
    metadata?: any;
  }): Promise<string> {
    const event: SQSEventMessage = {
      eventType: 'log_ingestion',
      eventId: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      siteId: logData.siteId,
      timestamp: logData.timestamp,
      data: logData,
      priority: 'medium',
      source: 'agent',
    };

    return this.sendEvent(event);
  }

  /**
   * Send incident creation event
   */
  async sendIncidentEvent(incidentData: {
    incidentId: string;
    siteId: string;
    severity: string;
    type: string;
    title: string;
    description?: string;
    affectedSystems?: string[];
  }): Promise<string> {
    const event: SQSEventMessage = {
      eventType: 'incident',
      eventId: incidentData.incidentId,
      siteId: incidentData.siteId,
      timestamp: Date.now(),
      data: incidentData,
      priority: this.mapSeverityToPriority(incidentData.severity),
      source: 'system',
    };

    return this.sendEvent(event);
  }

  /**
   * Send threat detection event
   */
  async sendThreatEvent(threatData: {
    threatId: string;
    siteId: string;
    indicator: string;
    type: string;
    severity: string;
    confidence: number;
  }): Promise<string> {
    const event: SQSEventMessage = {
      eventType: 'threat',
      eventId: threatData.threatId,
      siteId: threatData.siteId,
      timestamp: Date.now(),
      data: threatData,
      priority: this.mapSeverityToPriority(threatData.severity),
      source: 'detection',
    };

    return this.sendEvent(event);
  }

  private formatMessageAttributes(attributes?: Record<string, any>): Record<string, any> {
    if (!attributes) return {};

    const formatted: Record<string, any> = {};
    for (const [key, value] of Object.entries(attributes)) {
      formatted[key] = {
        DataType: 'String',
        StringValue: String(value),
      };
    }
    return formatted;
  }

  private mapSeverityToPriority(severity: string): 'low' | 'medium' | 'high' | 'critical' {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'critical';
      case 'high':
        return 'high';
      case 'medium':
        return 'medium';
      case 'low':
      default:
        return 'low';
    }
  }
}