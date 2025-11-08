import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  Incident,
  IncidentSeverity,
  IncidentStatus,
  IncidentType,
  User,
  Site,
} from "@lib/entities";
import {
  CreateIncidentDto,
  UpdateIncidentDto,
  IncidentsFilterDto,
  BulkActionDto,
} from "./dto";

@Injectable()
export class IncidentsService {
  constructor(
    @InjectRepository(Incident)
    private incidentsRepository: Repository<Incident>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Site)
    private sitesRepository: Repository<Site>
  ) {}

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

    return await this.incidentsRepository.save(incident);
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
    const incident = await this.findOne(id);
    Object.assign(incident, updateIncidentDto);
    return await this.incidentsRepository.save(incident);
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
        await this.incidentsRepository.update(
          { id: { $in: incidentIds } as any },
          { assignee_id: action.assigneeId }
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
