import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Incident, User, Site } from "@lib/entities";
import {
  CreateIncidentDto,
  UpdateIncidentDto,
  IncidentsFilterDto,
  BulkActionDto,
} from "./dto";
import { IncidentStatus, IncidentSeverity } from "@lib/constant";
import { SqsService } from "../../aws/services/sqs.service";
import { EventBridgeService } from "../../aws/services/eventbridge.service";
import { S3Service } from "../../aws/services/s3.service";
import { LambdaService } from "../../aws/services/lambda.service";
import { RedisService } from "../redis/redis.service";
import { SecretsManagerService } from "../../aws";

@Injectable()
export class IncidentsService {
  private readonly logger = new Logger(IncidentsService.name);

  constructor(
    @InjectRepository(Incident)
    private incidentsRepository: Repository<Incident>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Site)
    private sitesRepository: Repository<Site>,
    private sqsService: SqsService,
    private eventBridgeService: EventBridgeService,
    private s3Service: S3Service,
    private lambdaService: LambdaService,
    private redisService: RedisService,
    private readonly secretsService: SecretsManagerService
  ) {}

  // async analyzeIncidentWithAI(incident: any) {
  //   // Get OpenAI key from Secrets Manager
  //   const openaiKey = await this.secretsService.getOpenAIKey();

  //   const openai = new OpenAI({ apiKey: openaiKey });

  //   const completion = await openai.chat.completions.create({
  //     model: "gpt-4",
  //     messages: [
  //       { role: "system", content: "You are a cybersecurity analyst..." },
  //       {
  //         role: "user",
  //         content: `Analyze this incident: ${JSON.stringify(incident)}`,
  //       },
  //     ],
  //   });

  //   return completion.choices[0].message.content;
  // }

  async create(
    createIncidentDto: CreateIncidentDto,
    userId: string
  ): Promise<Incident> {
    // Generate incident ID
    const lastIncident = await this.incidentsRepository
      .createQueryBuilder("incident")
      .orderBy("incident.createdAt", "DESC")
      .getOne();

    let nextNumber = 1;
    if (lastIncident?.incident_id) {
      const match = lastIncident.incident_id.match(/INC-(\d+)/);
      if (match) {
        nextNumber = parseInt(match[1]) + 1;
      }
    }

    const incident_id = `INC-${nextNumber.toString().padStart(3, "0")}`;

    const incident = this.incidentsRepository.create({
      ...createIncidentDto,
      incident_id,
      status: createIncidentDto.status || IncidentStatus.OPEN,
    });

    const savedIncident = await this.incidentsRepository.save(incident);

    // Reload with relations to get site info
    const incidentWithRelations = await this.incidentsRepository.findOne({
      where: { id: savedIncident.id },
      relations: ["site"],
    });

    // Push incident event to SQS for AI triage and enrichment
    try {
      await this.sqsService.sendIncidentEvent({
        incidentId: savedIncident.id,
        siteId: incidentWithRelations?.site?.id || "unknown",
        severity: savedIncident.severity,
        type: savedIncident.type,
        title: savedIncident.title,
        description: savedIncident.description,
        affectedSystems: savedIncident.affected_systems,
      });

      // Trigger EventBridge workflow for incident management
      await this.eventBridgeService.publishIncidentCreated({
        incidentId: savedIncident.id,
        siteId: incidentWithRelations?.site?.id || "unknown",
        severity: savedIncident.severity,
        type: savedIncident.type,
        title: savedIncident.title,
        description: savedIncident.description,
        workflowStep: "created",
      });

      // Trigger Lambda AI Triage Worker asynchronously for immediate analysis
      await this.lambdaService.invokeAITriageWorkerAsync({
        eventId: savedIncident.id,
        eventType: "incident",
        content: `${savedIncident.title}\n\n${savedIncident.description}`,
        context: {
          severity: savedIncident.severity,
          type: savedIncident.type,
          affectedSystems: savedIncident.affected_systems,
          siteId: incidentWithRelations?.site?.id,
        },
        requestId: savedIncident.id,
      });

      // Store incident details in S3 for AI analysis
      await this.s3Service.storeAIAnalysis(
        savedIncident.id,
        "incident-triage",
        {
          incidentId: savedIncident.id,
          title: savedIncident.title,
          description: savedIncident.description,
          severity: savedIncident.severity,
          type: savedIncident.type,
          affectedSystems: savedIncident.affected_systems,
          createdAt: new Date().toISOString(),
        }
      );

      // If critical/high severity, trigger immediate notification workflow
      if (
        savedIncident.severity === IncidentSeverity.CRITICAL ||
        savedIncident.severity === IncidentSeverity.HIGH
      ) {
        await this.sqsService.sendNotification({
          userId: "security-team",
          type: "incident-alert",
          title: `${savedIncident.severity.toUpperCase()} Incident: ${savedIncident.type}`,
          message: savedIncident.description || savedIncident.title,
          priority:
            savedIncident.severity === IncidentSeverity.CRITICAL
              ? "critical"
              : "high",
          data: {
            incidentId: savedIncident.id,
            incidentNumber: savedIncident.incident_id,
            siteId: incidentWithRelations?.site?.id,
          },
        });
      }

      this.logger.log(
        `Incident created and AWS workflows triggered: ${savedIncident.incident_id}`
      );
    } catch (error) {
      this.logger.error(
        `Failed to trigger AWS workflows: ${error.message}`,
        error.stack
      );
      // Don't fail the creation if event push fails
    }

    return savedIncident;
  }

  async findAll(filter: IncidentsFilterDto = {}, userId: string) {
    const queryBuilder = this.incidentsRepository
      .createQueryBuilder("incident")
      .leftJoinAndSelect("incident.assignee", "assignee")
      .leftJoinAndSelect("incident.site", "site")
      .orderBy("incident.createdAt", "DESC");

    // Apply filters
    if (filter.severity && filter.severity !== "all") {
      queryBuilder.andWhere("incident.severity = :severity", {
        severity: filter.severity,
      });
    }

    if (filter.status && filter.status !== "all") {
      queryBuilder.andWhere("incident.status = :status", {
        status: filter.status,
      });
    }

    if (filter.type && filter.type !== "all") {
      queryBuilder.andWhere("incident.type = :type", { type: filter.type });
    }

    if (filter.assignee) {
      queryBuilder.andWhere("incident.assignee_id = :assigneeId", {
        assigneeId: filter.assignee,
      });
    }

    if (filter.siteId) {
      queryBuilder.andWhere("incident.site_id = :siteId", {
        siteId: filter.siteId,
      });
    }

    if (filter.dateFrom && filter.dateTo) {
      queryBuilder.andWhere(
        "incident.createdAt BETWEEN :dateFrom AND :dateTo",
        {
          dateFrom: new Date(filter.dateFrom),
          dateTo: new Date(filter.dateTo),
        }
      );
    }

    if (filter.searchQuery) {
      queryBuilder.andWhere(
        "(incident.incident_id ILIKE :search OR incident.title ILIKE :search OR incident.description ILIKE :search OR incident.ai_summary ILIKE :search)",
        { search: `%${filter.searchQuery}%` }
      );
    }

    const incidents = await queryBuilder.getMany();
    const stats = await this.getStats(userId);

    // Transform for frontend compatibility
    const transformedIncidents = incidents.map((incident) =>
      this.transformIncidentForFrontend(incident)
    );

    return {
      incidents: transformedIncidents,
      stats,
    };
  }

  async findOne(id: string): Promise<any> {
    const incident = await this.incidentsRepository.findOne({
      where: { id },
      relations: ["assignee", "site", "remediationActions", "notifications"],
    });

    if (!incident) {
      throw new NotFoundException(`Incident with ID ${id} not found`);
    }

    return this.transformIncidentDetailForFrontend(incident);
  }

  async findByIncidentId(incident_id: string): Promise<any> {
    const incident = await this.incidentsRepository.findOne({
      where: { incident_id },
      relations: ["assignee", "site", "remediationActions", "notifications"],
    });

    if (!incident) {
      throw new NotFoundException(`Incident with ID ${incident_id} not found`);
    }

    return this.transformIncidentDetailForFrontend(incident);
  }

  async update(
    id: string,
    updateIncidentDto: UpdateIncidentDto
  ): Promise<Incident> {
    const incident = await this.incidentsRepository.findOne({
      where: { id },
      relations: ["site", "assignee"],
    });

    if (!incident) {
      throw new NotFoundException(`Incident with ID ${id} not found`);
    }

    const oldStatus = incident.status;
    const oldSeverity = incident.severity;

    Object.assign(incident, updateIncidentDto);
    const updatedIncident = await this.incidentsRepository.save(incident);

    // Determine workflow step based on status change
    let workflowStep:
      | "created"
      | "enriched"
      | "triaged"
      | "assigned"
      | "resolved" = "enriched";

    if (
      updatedIncident.status === IncidentStatus.INVESTIGATING &&
      oldStatus !== IncidentStatus.INVESTIGATING
    ) {
      workflowStep = "assigned";
    } else if (
      updatedIncident.status === IncidentStatus.RESOLVED &&
      oldStatus !== IncidentStatus.RESOLVED
    ) {
      workflowStep = "resolved";
    } else if (updatedIncident.ai_summary && !incident.ai_summary) {
      workflowStep = "triaged";
    }

    // Push update event to EventBridge
    try {
      await this.eventBridgeService.publishIncidentUpdated({
        incidentId: updatedIncident.id,
        siteId: incident.site?.id || "unknown",
        severity: updatedIncident.severity,
        type: updatedIncident.type,
        workflowStep,
      });

      this.logger.log(
        `Incident updated and workflow event pushed: ${updatedIncident.incident_id}`
      );
    } catch (error) {
      this.logger.error(
        `Failed to push incident update event: ${error.message}`,
        error.stack
      );
    }

    return updatedIncident;
  }

  async remove(id: string): Promise<void> {
    const result = await this.incidentsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Incident with ID ${id} not found`);
    }
  }

  async bulkAction(incidentIds: string[], action: BulkActionDto): Promise<any> {
    switch (action.action) {
      case "close":
        await this.incidentsRepository.update(
          { id: { $in: incidentIds } as any },
          { status: IncidentStatus.CLOSED }
        );
        return {
          message: `${incidentIds.length} incidents closed successfully`,
        };

      case "assign":
        if (!action.assigneeId) {
          throw new Error("Assignee ID is required for assign action");
        }
        const assignee = await this.usersRepository.findOne({
          where: { id: action.assigneeId },
        });
        await this.incidentsRepository.update(
          { id: { $in: incidentIds } as any },
          { assignee }
        );
        return {
          message: `${incidentIds.length} incidents assigned successfully`,
        };

      case "export":
        const incidents = await this.incidentsRepository.findByIds(incidentIds);
        return {
          message: "Export data prepared",
          data: incidents,
        };

      default:
        throw new Error("Invalid bulk action");
    }
  }

  async getStats(userId: string) {
    const stats = await this.incidentsRepository
      .createQueryBuilder("incident")
      .select([
        "COUNT(*) as total",
        `COUNT(CASE WHEN incident.status = '${IncidentStatus.OPEN}' THEN 1 END) as open`,
        `COUNT(CASE WHEN incident.status = '${IncidentStatus.INVESTIGATING}' THEN 1 END) as investigating`,
        `COUNT(CASE WHEN incident.status = '${IncidentStatus.RESOLVED}' THEN 1 END) as resolved`,
        `COUNT(CASE WHEN incident.status = '${IncidentStatus.CLOSED}' THEN 1 END) as closed`,
        `COUNT(CASE WHEN incident.severity = '${IncidentSeverity.CRITICAL}' THEN 1 END) as critical`,
        `COUNT(CASE WHEN incident.severity = '${IncidentSeverity.HIGH}' THEN 1 END) as high`,
        `COUNT(CASE WHEN incident.severity = '${IncidentSeverity.MEDIUM}' THEN 1 END) as medium`,
        `COUNT(CASE WHEN incident.severity = '${IncidentSeverity.LOW}' THEN 1 END) as low`,
      ])
      .getRawOne();

    return {
      total: parseInt(stats.total) || 0,
      open: parseInt(stats.open) || 0,
      investigating: parseInt(stats.investigating) || 0,
      resolved: parseInt(stats.resolved) || 0,
      closed: parseInt(stats.closed) || 0,
      critical: parseInt(stats.critical) || 0,
      high: parseInt(stats.high) || 0,
      medium: parseInt(stats.medium) || 0,
      low: parseInt(stats.low) || 0,
    };
  }

  /**
   * Process incident with AI triage for automated analysis
   */
  async processIncidentWithAI(id: string): Promise<any> {
    const incident = await this.incidentsRepository.findOne({
      where: { id },
      relations: ["site"],
    });

    if (!incident) {
      throw new NotFoundException(`Incident with ID ${id} not found`);
    }

    const cacheKey = `incident:ai-analysis:${id}`;

    // Check cache first
    const cachedAnalysis = await this.redisService.get(cacheKey);
    if (cachedAnalysis) {
      this.logger.log(
        `Retrieved AI analysis from cache for incident ${incident.incident_id}`
      );
      return cachedAnalysis;
    }

    try {
      // Call Lambda AI Triage Worker synchronously
      const aiAnalysis = await this.lambdaService.invokeAITriageWorker({
        eventId: incident.id,
        eventType: "incident",
        content: `${incident.title}\n\n${incident.description}\n\nAffected Systems: ${incident.affected_systems?.join(", ")}`,
        context: {
          severity: incident.severity,
          type: incident.type,
          affectedSystems: incident.affected_systems,
          siteId: incident.site?.id,
          rawLogs: incident.raw_logs,
        },
        requestId: incident.id,
      });

      // Store AI analysis result in S3
      await this.s3Service.storeAIAnalysis(
        incident.id,
        "incident-ai-triage",
        aiAnalysis
      );

      // Cache AI analysis result in Redis (TTL: 1 hour)
      await this.redisService.set(cacheKey, aiAnalysis, 3600);

      // Update incident with AI analysis results
      const updateData: any = {};

      if (aiAnalysis.summary) {
        updateData.ai_summary = aiAnalysis.summary;
      }

      if (aiAnalysis.recommendations) {
        updateData.ai_recommendations = aiAnalysis.recommendations;
      }

      if (aiAnalysis.mitreAttack) {
        updateData.mitre_attack = aiAnalysis.mitreAttack;
      }

      if (aiAnalysis.severity && aiAnalysis.severity !== incident.severity) {
        updateData.severity = aiAnalysis.severity;
        this.logger.log(
          `AI adjusted severity from ${incident.severity} to ${aiAnalysis.severity} for ${incident.incident_id}`
        );
      }

      if (Object.keys(updateData).length > 0) {
        await this.incidentsRepository.update(incident.id, updateData);
      }

      // Trigger EventBridge workflow update
      await this.eventBridgeService.publishIncidentUpdated({
        incidentId: incident.id,
        siteId: incident.site?.id || "unknown",
        severity: aiAnalysis.severity || incident.severity,
        type: incident.type,
        workflowStep: "triaged",
      });

      this.logger.log(
        `AI triage completed for incident ${incident.incident_id}`
      );

      return aiAnalysis;
    } catch (error) {
      this.logger.error(
        `AI triage failed for incident ${incident.incident_id}: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }

  /**
   * Batch process multiple incidents with AI
   */
  async batchProcessIncidentsWithAI(ids: string[]): Promise<any> {
    const results = [];

    for (const id of ids) {
      try {
        const aiAnalysis = await this.processIncidentWithAI(id);
        results.push({
          incidentId: id,
          success: true,
          analysis: aiAnalysis,
        });
      } catch (error) {
        results.push({
          incidentId: id,
          success: false,
          error: error.message,
        });
      }
    }

    return {
      total: ids.length,
      processed: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
      results,
    };
  }

  /**
   * Store incident attachment to S3
   */
  async storeIncidentAttachment(
    incidentId: string,
    fileName: string,
    fileContent: Buffer,
    contentType: string
  ): Promise<string> {
    const incident = await this.incidentsRepository.findOne({
      where: { id: incidentId },
    });

    if (!incident) {
      throw new NotFoundException(`Incident with ID ${incidentId} not found`);
    }

    try {
      const s3Key = await this.s3Service.storeIncidentAttachment(
        incidentId,
        fileName,
        fileContent,
        contentType
      );

      this.logger.log(
        `Attachment stored for incident ${incident.incident_id}: ${s3Key}`
      );

      return s3Key;
    } catch (error) {
      this.logger.error(
        `Failed to store attachment for incident ${incident.incident_id}: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }

  /**
   * Publish incident event to Redis for real-time updates
   */
  private async publishIncidentEventToRedis(
    event: string,
    incidentData: any
  ): Promise<void> {
    try {
      await this.redisService.publish("incidents:updates", {
        event,
        data: incidentData,
        timestamp: Date.now(),
      });
    } catch (error) {
      this.logger.error(
        `Failed to publish incident event to Redis: ${error.message}`,
        error.stack
      );
    }
  }

  private transformIncidentForFrontend(incident: Incident): any {
    return {
      id: incident.id,
      incidentId: incident.incident_id,
      title: incident.title,
      description: incident.description || "",
      aiSummary: incident.ai_summary || "",
      severity: incident.severity,
      status: incident.status,
      type: incident.type,
      dateCreated: this.formatDateForFrontend(incident.createdAt),
      dateUpdated: this.formatDateForFrontend(incident.updatedAt),
      assignee: incident.assignee
        ? {
            id: incident.assignee.id,
            name: incident.assignee.full_name || incident.assignee.email,
            avatar: null, // Will be added later if needed
          }
        : null,
      affectedSystems: incident.affected_systems || [],
      tags: incident.tags || [],
    };
  }

  private transformIncidentDetailForFrontend(incident: Incident): any {
    const base = this.transformIncidentForFrontend(incident);

    return {
      ...base,
      sourceIP: incident.source_ip,
      destinationIP: incident.destination_ip,
      protocol: incident.protocol,
      timeline: incident.timeline || [],
      mitreAttack: incident.mitre_attack || [],
      rawLogs: incident.raw_logs || [],
      aiRecommendations: incident.ai_recommendations || [],
      fileHash: incident.file_hash,
      ipReputation: incident.ip_reputation,
      relatedIncidents: incident.related_incidents || [],
      externalReferences: incident.external_references || [],
      relatedIndicators: incident.related_indicators || [],
      recommendations: incident.recommendations || [],
      evidence: incident.evidence || [],
    };
  }

  private formatDateForFrontend(date: Date): string {
    return (
      date.toISOString().split("T")[0] +
      " " +
      date.toTimeString().split(" ")[0].substring(0, 5)
    );
  }
}
