import { Injectable, Logger } from "@nestjs/common";
import { SqsService } from "./sqs.service";
import { S3Service } from "./s3.service";
import { EventBridgeService } from "./eventbridge.service";
import { LambdaService } from "./lambda.service";

export interface LogIngestionWorkflow {
  agentId: string;
  siteId: string;
  logType: string;
  logContent: string;
  priority?: "low" | "medium" | "high" | "critical";
}

export interface IncidentCreationWorkflow {
  incidentId: string;
  siteId: string;
  severity: string;
  type: string;
  title: string;
  description: string;
  affectedSystems?: string[];
  attachments?: Array<{ name: string; content: Buffer; contentType: string }>;
}

export interface ThreatDetectionWorkflow {
  threatId: string;
  siteId: string;
  indicator: string;
  type: string;
  confidence: number;
  severity: string;
  context?: any;
}

@Injectable()
export class WorkflowService {
  private readonly logger = new Logger(WorkflowService.name);

  constructor(
    private sqsService: SqsService,
    private s3Service: S3Service,
    private eventBridgeService: EventBridgeService,
    private lambdaService: LambdaService
  ) {}

  /**
   * Process log ingestion workflow
   * 1. Store raw log in S3
   * 2. Send event to SQS for processing
   * 3. Trigger EventBridge workflow
   * 4. Invoke Lambda for AI analysis
   */
  async processLogIngestion(workflow: LogIngestionWorkflow): Promise<{
    workflowId: string;
    s3Key: string;
    sqsMessageId: string;
  }> {
    const workflowId = `log-ingestion-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    try {
      this.logger.log(`Starting log ingestion workflow: ${workflowId}`);

      // Step 1: Store raw log in S3
      const s3Key = await this.s3Service.storeRawLog(
        workflow.siteId,
        workflow.agentId,
        workflow.logContent,
        workflow.logType
      );

      // Step 2: Send log ingestion event to SQS
      const sqsMessageId = await this.sqsService.sendLogIngestionEvent({
        agentId: workflow.agentId,
        siteId: workflow.siteId,
        logType: workflow.logType,
        logContent: workflow.logContent,
        timestamp: Date.now(),
        metadata: { s3Key, workflowId },
      });

      // Step 3: Send workflow event to EventBridge
      await this.eventBridgeService.sendLogIngestionEvent({
        agentId: workflow.agentId,
        siteId: workflow.siteId,
        logType: workflow.logType,
        s3Key,
        priority: workflow.priority || "medium",
      });

      // Step 4: Trigger async Lambda analysis
      await this.lambdaService.invokeAITriageWorkerAsync({
        eventId: workflowId,
        eventType: "log",
        content: workflow.logContent,
        context: {
          siteId: workflow.siteId,
          agentId: workflow.agentId,
          logType: workflow.logType,
          s3Key,
        },
        requestId: `${workflowId}-triage`,
      });

      this.logger.log(`Log ingestion workflow initiated: ${workflowId}`);

      return {
        workflowId,
        s3Key,
        sqsMessageId,
      };
    } catch (error) {
      this.logger.error(`Log ingestion workflow failed: ${workflowId}`, error);
      throw error;
    }
  }

  /**
   * Process incident creation workflow
   * 1. Store attachments in S3 if any
   * 2. Send incident event to SQS
   * 3. Trigger EventBridge workflow
   * 4. Send notifications
   */
  async processIncidentCreation(workflow: IncidentCreationWorkflow): Promise<{
    workflowId: string;
    attachmentKeys: string[];
    sqsMessageId: string;
  }> {
    const workflowId = `incident-${workflow.incidentId}`;

    try {
      this.logger.log(`Starting incident creation workflow: ${workflowId}`);

      // Step 1: Store attachments in S3 if any
      const attachmentKeys: string[] = [];
      if (workflow.attachments && workflow.attachments.length > 0) {
        for (const attachment of workflow.attachments) {
          const key = await this.s3Service.storeIncidentAttachment(
            workflow.incidentId,
            attachment.name,
            attachment.content,
            attachment.contentType
          );
          attachmentKeys.push(key);
        }
      }

      // Step 2: Send incident event to SQS
      const sqsMessageId = await this.sqsService.sendIncidentEvent({
        incidentId: workflow.incidentId,
        siteId: workflow.siteId,
        severity: workflow.severity,
        type: workflow.type,
        title: workflow.title,
        description: workflow.description,
        affectedSystems: workflow.affectedSystems,
      });

      // Step 3: Send workflow event to EventBridge
      await this.eventBridgeService.sendIncidentWorkflowEvent({
        incidentId: workflow.incidentId,
        siteId: workflow.siteId,
        severity: workflow.severity,
        type: workflow.type,
        workflowStep: "created",
      });

      // Step 4: Send notifications for high/critical incidents
      if (workflow.severity === "high" || workflow.severity === "critical") {
        await this.sqsService.sendNotification({
          userId: "security-team",
          type: "incident-alert",
          title: `${workflow.severity.toUpperCase()} Incident: ${workflow.title}`,
          message: workflow.description,
          priority: workflow.severity as any,
          data: {
            incidentId: workflow.incidentId,
            siteId: workflow.siteId,
            attachmentKeys,
          },
        });
      }

      this.logger.log(`Incident creation workflow completed: ${workflowId}`);

      return {
        workflowId,
        attachmentKeys,
        sqsMessageId,
      };
    } catch (error) {
      this.logger.error(
        `Incident creation workflow failed: ${workflowId}`,
        error
      );
      throw error;
    }
  }

  /**
   * Process threat detection workflow
   * 1. Send threat event to SQS
   * 2. Trigger enrichment Lambda
   * 3. Send EventBridge workflow event
   * 4. Store threat intelligence
   */
  async processThreatDetection(workflow: ThreatDetectionWorkflow): Promise<{
    workflowId: string;
    enrichmentRequestId: string;
    sqsMessageId: string;
  }> {
    const workflowId = `threat-${workflow.threatId}`;

    try {
      this.logger.log(`Starting threat detection workflow: ${workflowId}`);

      // Step 1: Send threat event to SQS
      const sqsMessageId = await this.sqsService.sendThreatEvent({
        threatId: workflow.threatId,
        siteId: workflow.siteId,
        indicator: workflow.indicator,
        type: workflow.type,
        severity: workflow.severity,
        confidence: workflow.confidence,
      });

      // Step 2: Trigger enrichment Lambda
      const enrichmentRequestId = `${workflowId}-enrichment`;
      await this.lambdaService.invokeEnrichmentWorkerAsync({
        indicator: workflow.indicator,
        type: workflow.type as any,
        sources: ["virustotal", "abuseipdb"],
        requestId: enrichmentRequestId,
      });

      // Step 3: Send workflow event to EventBridge
      await this.eventBridgeService.sendThreatWorkflowEvent({
        threatId: workflow.threatId,
        siteId: workflow.siteId,
        indicator: workflow.indicator,
        type: workflow.type,
        workflowStep: "detected",
      });

      // Step 4: If high confidence, trigger immediate response
      if (workflow.confidence > 0.8) {
        await this.sqsService.sendNotification({
          userId: "security-team",
          type: "threat-alert",
          title: `High Confidence Threat Detected: ${workflow.type}`,
          message: `Indicator: ${workflow.indicator} (Confidence: ${workflow.confidence})`,
          priority: "high",
          data: {
            threatId: workflow.threatId,
            indicator: workflow.indicator,
            confidence: workflow.confidence,
          },
        });
      }

      this.logger.log(`Threat detection workflow completed: ${workflowId}`);

      return {
        workflowId,
        enrichmentRequestId,
        sqsMessageId,
      };
    } catch (error) {
      this.logger.error(
        `Threat detection workflow failed: ${workflowId}`,
        error
      );
      throw error;
    }
  }

  /**
   * Process bulk enrichment for multiple indicators
   */
  async processBulkEnrichment(
    indicators: Array<{
      value: string;
      type: "ip" | "domain" | "url" | "hash";
    }>
  ): Promise<{
    workflowId: string;
    requestIds: string[];
  }> {
    const workflowId = `bulk-enrichment-${Date.now()}`;
    const requestIds: string[] = [];

    try {
      this.logger.log(
        `Starting bulk enrichment workflow: ${workflowId} (${indicators.length} indicators)`
      );

      // Send enrichment requests to SQS for each indicator
      for (let i = 0; i < indicators.length; i++) {
        const indicator = indicators[i];
        const requestId = `${workflowId}-${i}`;

        await this.sqsService.sendEnrichmentRequest({
          type: indicator.type,
          indicator: indicator.value,
          sources: ["virustotal", "abuseipdb"],
          callbackEventId: workflowId,
          priority: "medium",
        });

        requestIds.push(requestId);
      }

      // Send bulk enrichment workflow event
      await this.eventBridgeService.sendEnrichmentWorkflowEvent({
        requestId: workflowId,
        indicator: `${indicators.length} indicators`,
        type: "bulk",
        workflowStep: "started",
      });

      this.logger.log(`Bulk enrichment workflow initiated: ${workflowId}`);

      return {
        workflowId,
        requestIds,
      };
    } catch (error) {
      this.logger.error(
        `Bulk enrichment workflow failed: ${workflowId}`,
        error
      );
      throw error;
    }
  }

  /**
   * Process notification workflow
   */
  async processNotificationWorkflow(notification: {
    userId: string;
    type: string;
    title: string;
    message: string;
    priority: "low" | "medium" | "high" | "critical";
    channels: string[];
    data?: any;
  }): Promise<{
    workflowId: string;
    sqsMessageId: string;
  }> {
    const workflowId = `notification-${Date.now()}`;

    try {
      this.logger.log(`Starting notification workflow: ${workflowId}`);

      // Send notification to SQS
      const sqsMessageId = await this.sqsService.sendNotification(notification);

      // Send workflow event to EventBridge
      await this.eventBridgeService.sendNotificationWorkflowEvent({
        notificationId: workflowId,
        userId: notification.userId,
        type: notification.type,
        priority: notification.priority,
        channel: notification.channels?.[0] || "email",
      });

      // Invoke notifier Lambda for immediate processing
      await this.lambdaService.invokeNotifierWorkerAsync({
        ...notification,
      });

      this.logger.log(`Notification workflow completed: ${workflowId}`);

      return {
        workflowId,
        sqsMessageId,
      };
    } catch (error) {
      this.logger.error(`Notification workflow failed: ${workflowId}`, error);
      throw error;
    }
  }
}
