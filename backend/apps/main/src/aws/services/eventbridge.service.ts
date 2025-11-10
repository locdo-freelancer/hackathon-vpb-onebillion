import { Injectable, Logger } from "@nestjs/common";
import {
  EventBridgeClient,
  PutEventsCommand,
} from "@aws-sdk/client-eventbridge";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EventBridgeService {
  private readonly logger = new Logger(EventBridgeService.name);
  private readonly eventBridgeClient: EventBridgeClient;
  private readonly eventBusName: string;
  private readonly eventSource: string;

  constructor(private readonly configService: ConfigService) {
    this.eventBridgeClient = new EventBridgeClient({
      region: this.configService.get("AWS_REGION"),
      credentials: {
        accessKeyId: this.configService.get("AWS_ACCESS_KEY_ID"),
        secretAccessKey: this.configService.get("AWS_SECRET_ACCESS_KEY"),
      },
    });

    this.eventBusName = this.configService.get(
      "AWS_EVENTBRIDGE_BUS_NAME",
      "securevault-event-bus"
    );
    this.eventSource = this.configService.get(
      "AWS_EVENTBRIDGE_SOURCE",
      "securevault.system"
    );
  }

  /**
   * Publish event to EventBridge
   */
  async publishEvent(detailType: string, detail: any): Promise<void> {
    try {
      const command = new PutEventsCommand({
        Entries: [
          {
            Source: this.eventSource,
            DetailType: detailType,
            Detail: JSON.stringify(detail),
            EventBusName: this.eventBusName,
          },
        ],
      });

      const response = await this.eventBridgeClient.send(command);

      if (response.FailedEntryCount > 0) {
        this.logger.error("Failed to publish event", {
          detailType,
          failedEntries: response.Entries,
        });
        throw new Error("Failed to publish event to EventBridge");
      }

      this.logger.log("Event published successfully", {
        detailType,
        eventId: response.Entries[0].EventId,
      });
    } catch (error) {
      this.logger.error("Error publishing event to EventBridge", error.stack);
      throw error;
    }
  }

  /**
   * Publish incident created event
   */
  async publishIncidentCreated(incident: any): Promise<void> {
    await this.publishEvent("Incident Created", {
      incidentId: incident.id,
      title: incident.title,
      description: incident.description,
      severity: incident.severity,
      type: incident.type,
      status: incident.status,
      affectedSystems: incident.affectedSystems || [],
      userId: incident.userId,
      siteId: incident.siteId,
      createdAt: incident.createdAt,
    });
  }

  /**
   * Publish incident updated event
   */
  async publishIncidentUpdated(incident: any): Promise<void> {
    await this.publishEvent("Incident Updated", {
      incidentId: incident.id,
      title: incident.title,
      severity: incident.severity,
      status: incident.status,
      updatedAt: new Date().toISOString(),
    });
  }

  /**
   * Publish threat detected event
   */
  async publishThreatDetected(threat: any): Promise<void> {
    await this.publishEvent("Threat Detected", {
      threatIndicatorId: threat.id,
      indicator: threat.indicator,
      type: threat.type,
      requiresEnrichment: true,
      userId: threat.userId,
      siteId: threat.siteId,
      detectedAt: new Date().toISOString(),
    });
  }

  /**
   * Publish site status changed event
   */
  async publishSiteStatusChanged(
    site: any,
    previousStatus: string
  ): Promise<void> {
    await this.publishEvent("Site Status Changed", {
      siteId: site.id,
      siteName: site.name,
      status: site.status,
      previousStatus,
      reason: site.statusReason || "Unknown",
      userId: site.userId,
      changedAt: new Date().toISOString(),
    });
  }

  /**
   * Publish agent status changed event
   */
  async publishAgentStatusChanged(
    agent: any,
    previousStatus: string
  ): Promise<void> {
    await this.publishEvent("Agent Status Changed", {
      agentId: agent.id,
      siteId: agent.siteId,
      hostname: agent.hostname,
      status: agent.status,
      previousStatus,
      lastSeen: agent.lastSeen,
      userId: agent.site?.userId,
      changedAt: new Date().toISOString(),
    });
  }

  /**
   * Publish vulnerability discovered event
   */
  async publishVulnerabilityDiscovered(vulnerability: any): Promise<void> {
    await this.publishEvent("Vulnerability Discovered", {
      vulnerabilityId: vulnerability.id,
      cveId: vulnerability.cveId,
      severity: vulnerability.severity,
      cvssScore: vulnerability.cvssScore,
      affectedSystem: vulnerability.affectedSystem,
      siteId: vulnerability.siteId,
      userId: vulnerability.userId,
      discoveredAt: new Date().toISOString(),
    });
  }

  /**
   * Publish remediation action required event
   */
  async publishRemediationActionRequired(action: any): Promise<void> {
    await this.publishEvent("Remediation Action Required", {
      actionId: action.id,
      actionType: action.actionType,
      description: action.description,
      priority: action.priority,
      incidentId: action.incidentId,
      requiresAIDecision: action.requiresAIDecision || false,
      estimatedTime: action.estimatedTime,
      createdAt: new Date().toISOString(),
    });
  }

  /**
   * Send log ingestion event
   */
  async sendLogIngestionEvent(data: {
    agentId: string;
    siteId: string;
    logType: string;
    s3Key?: string;
    priority: "low" | "medium" | "high" | "critical";
  }): Promise<void> {
    await this.publishEvent("Log Ingestion", {
      agentId: data.agentId,
      siteId: data.siteId,
      logType: data.logType,
      s3Key: data.s3Key,
      priority: data.priority,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Send incident workflow event
   */
  async sendIncidentWorkflowEvent(data: {
    incidentId: string;
    siteId: string;
    severity: string;
    type: string;
    workflowStep: string;
  }): Promise<void> {
    await this.publishEvent("Incident Workflow", {
      incidentId: data.incidentId,
      siteId: data.siteId,
      severity: data.severity,
      type: data.type,
      workflowStep: data.workflowStep,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Send threat workflow event
   */
  async sendThreatWorkflowEvent(data: {
    threatId: string;
    siteId: string;
    indicator: string;
    type: string;
    workflowStep: string;
  }): Promise<void> {
    await this.publishEvent("Threat Workflow", {
      threatId: data.threatId,
      siteId: data.siteId,
      indicator: data.indicator,
      type: data.type,
      workflowStep: data.workflowStep,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Send enrichment workflow event
   */
  async sendEnrichmentWorkflowEvent(data: {
    requestId: string;
    indicator: string;
    type: string;
    workflowStep: string;
  }): Promise<void> {
    await this.publishEvent("Enrichment Workflow", {
      requestId: data.requestId,
      indicator: data.indicator,
      type: data.type,
      workflowStep: data.workflowStep,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Send notification workflow event
   */
  async sendNotificationWorkflowEvent(data: {
    notificationId: string;
    userId: string;
    type: string;
    priority: string;
    channel: string;
  }): Promise<void> {
    await this.publishEvent("Notification Workflow", {
      notificationId: data.notificationId,
      userId: data.userId,
      type: data.type,
      priority: data.priority,
      channel: data.channel,
      timestamp: new Date().toISOString(),
    });
  }
}
