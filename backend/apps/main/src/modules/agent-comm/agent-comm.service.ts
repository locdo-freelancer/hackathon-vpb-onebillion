import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AgentEntity, Site } from "@lib/entities";
import { SiteStatus } from "@lib/constant";
import { Repository } from "typeorm";
import { S3Service } from "../../aws/services/s3.service";
import { SqsService } from "../../aws/services/sqs.service";
import { EventBridgeService } from "../../aws/services/eventbridge.service";
import { ReportThreatDto } from "./dto/report-threat.dto";

@Injectable()
export class AgentCommService {
  private readonly logger = new Logger(AgentCommService.name);

  constructor(
    @InjectRepository(AgentEntity)
    private agentRepository: Repository<AgentEntity>,
    @InjectRepository(Site)
    private siteRepository: Repository<Site>,
    private s3Service: S3Service,
    private sqsService: SqsService,
    private eventBridgeService: EventBridgeService
  ) {}

  async handleCheckIn(site: Site) {
    const now = Date.now();

    // Update agent record
    await this.agentRepository.update(
      { site: { id: site.id } },
      {
        last_checkin: now,
        is_connected: 1,
      }
    );

    // Update site status
    await this.siteRepository.update(site.id, {
      status: SiteStatus.CONNECTED,
      updatedAt: now,
    });

    return {
      success: true,
      message: "Check-in successful",
      timestamp: now,
    };
  }

  /**
   * Handle threat report from agent
   */
  async handleReportThreat(
    site: Site,
    reportThreatDto: ReportThreatDto
  ): Promise<{ success: boolean; threatId?: string; message: string }> {
    try {
      const threatId = `threat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Store threat data to S3 as JSON
      const threatData = JSON.stringify({
        ...reportThreatDto,
        siteId: site.id,
        siteName: site.name,
        reportedAt: Date.now(),
      });

      const timestamp = new Date().toISOString();
      const s3Key = `threat-reports/${site.id}/${threatId}/${timestamp}.json`;

      await this.s3Service.uploadFile(s3Key, threatData, {
        contentType: "application/json",
        metadata: {
          siteId: site.id.toString(),
          threatId,
          type: reportThreatDto.type,
          severity: reportThreatDto.severity,
        },
        tags: {
          Type: "ThreatReport",
          SiteId: site.id.toString(),
          Severity: reportThreatDto.severity,
        },
      });

      this.logger.log(`Stored threat data to S3: ${s3Key}`);

      // Send threat detection event to SQS
      await this.sqsService.sendThreatEvent({
        threatId,
        siteId: site.id.toString(),
        indicator: reportThreatDto.indicator,
        type: reportThreatDto.type,
        severity: reportThreatDto.severity,
        confidence: 0.8, // Default confidence from agent reports
      });

      // Trigger EventBridge threat workflow
      await this.eventBridgeService.sendThreatWorkflowEvent({
        threatId,
        siteId: site.id.toString(),
        indicator: reportThreatDto.indicator,
        type: reportThreatDto.type,
        workflowStep: "enrichment",
      });

      this.logger.log(
        `Threat report processed: ${reportThreatDto.indicator} (${reportThreatDto.type})`
      );

      return {
        success: true,
        threatId,
        message: "Threat reported and queued for enrichment",
      };
    } catch (error) {
      this.logger.error(
        `Failed to process threat report: ${error.message}`,
        error.stack
      );
      return {
        success: false,
        message: `Failed to process threat report: ${error.message}`,
      };
    }
  }

  /**
   * Handle log data from agents
   */
  async handleLogData(data: {
    siteId: string;
    agentId: string;
    logType: string;
    logContent: string;
    metadata?: any;
  }): Promise<{ success: boolean; s3Key?: string; message: string }> {
    try {
      // Store raw log to S3
      const s3Key = await this.s3Service.storeRawLog(
        data.siteId,
        data.agentId,
        data.logContent,
        data.logType
      );

      this.logger.log(`Stored raw log to S3: ${s3Key}`);

      // Send log ingestion event to SQS
      await this.sqsService.sendLogIngestionEvent({
        agentId: data.agentId,
        siteId: data.siteId,
        logType: data.logType,
        logContent: data.logContent,
        timestamp: Date.now(),
        metadata: data.metadata,
      });

      // Trigger EventBridge log ingestion workflow
      const priority = this.determineLogPriority(data.logType, data.logContent);
      await this.eventBridgeService.sendLogIngestionEvent({
        agentId: data.agentId,
        siteId: data.siteId,
        logType: data.logType,
        s3Key,
        priority,
      });

      this.logger.log(
        `Log ingestion workflow triggered for agent ${data.agentId}`
      );

      return {
        success: true,
        s3Key,
        message: "Log data processed and stored successfully",
      };
    } catch (error) {
      this.logger.error(
        `Failed to process log data: ${error.message}`,
        error.stack
      );
      return {
        success: false,
        message: `Failed to process log data: ${error.message}`,
      };
    }
  }

  /**
   * Handle security events from agents
   */
  async handleSecurityEvent(data: {
    siteId: string;
    agentId: string;
    eventType: string;
    severity: "low" | "medium" | "high" | "critical";
    details: any;
  }): Promise<{ success: boolean; message: string }> {
    try {
      // Send event to SQS for processing
      await this.sqsService.sendEvent({
        eventType: "log_ingestion",
        eventId: `sec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        siteId: data.siteId,
        timestamp: Date.now(),
        data: {
          agentId: data.agentId,
          eventType: data.eventType,
          severity: data.severity,
          details: data.details,
        },
        priority: data.severity,
        source: "agent-security-event",
      });

      this.logger.log(
        `Security event sent to queue from agent ${data.agentId}`
      );

      return {
        success: true,
        message: "Security event queued for processing",
      };
    } catch (error) {
      this.logger.error(
        `Failed to handle security event: ${error.message}`,
        error.stack
      );
      return {
        success: false,
        message: `Failed to process security event: ${error.message}`,
      };
    }
  }

  private determineLogPriority(
    logType: string,
    logContent: string
  ): "low" | "medium" | "high" | "critical" {
    // Simple heuristics to determine log priority
    const criticalKeywords = ["error", "critical", "alert", "breach", "attack"];
    const highKeywords = ["warning", "fail", "unauthorized", "suspicious"];

    const lowerContent = logContent.toLowerCase();
    const lowerType = logType.toLowerCase();

    if (
      criticalKeywords.some(
        (kw) => lowerContent.includes(kw) || lowerType.includes(kw)
      )
    ) {
      return "critical";
    }

    if (
      highKeywords.some(
        (kw) => lowerContent.includes(kw) || lowerType.includes(kw)
      )
    ) {
      return "high";
    }

    // Auth logs and security logs are medium priority by default
    if (lowerType.includes("auth") || lowerType.includes("security")) {
      return "medium";
    }

    return "low";
  }
}
