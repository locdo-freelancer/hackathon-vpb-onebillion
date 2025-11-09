import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder } from "typeorm";
import {
  RemediationAction,
  RemediationStatus,
} from "../../../libs/entities/src/remediation-action.entity";
import {
  CreateRemediationActionDto,
  UpdateRemediationActionDto,
  RemediationActionsFilterDto,
} from "./dto";

@Injectable()
export class RemediationActionsService {
  constructor(
    @InjectRepository(RemediationAction)
    private remediationActionRepository: Repository<RemediationAction>
  ) {}

  async create(
    createDto: CreateRemediationActionDto
  ): Promise<RemediationAction> {
    const remediationAction = this.remediationActionRepository.create({
      ...createDto,
      executed_at: Date.now(),
    });

    return await this.remediationActionRepository.save(remediationAction);
  }

  async findAll(filters: RemediationActionsFilterDto): Promise<{
    data: RemediationAction[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const queryBuilder = this.createQueryBuilder(filters);

    // Apply pagination
    const { page = 1, limit = 10 } = filters;
    const offset = (page - 1) * limit;

    queryBuilder.skip(offset).take(limit);

    // Apply sorting
    const { sort_by = "created_at", sort_order = "DESC" } = filters;
    queryBuilder.orderBy(`remediation.${sort_by}`, sort_order);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<RemediationAction> {
    const remediationAction = await this.remediationActionRepository.findOne({
      where: { id },
      relations: [
        "site",
        "incident",
        "threatIndicator",
        "siteVulnerability",
        "siteVulnerability.vulnerability",
      ],
    });

    if (!remediationAction) {
      throw new NotFoundException(`Remediation action with ID ${id} not found`);
    }

    return remediationAction;
  }

  async update(
    id: string,
    updateDto: UpdateRemediationActionDto
  ): Promise<RemediationAction> {
    const remediationAction = await this.findOne(id);

    if (
      updateDto.status === RemediationStatus.COMPLETED &&
      !updateDto.completed_at
    ) {
      updateDto.completed_at = Date.now();
    }

    if (updateDto.progress_percentage === 100 && !updateDto.status) {
      updateDto.status = RemediationStatus.COMPLETED;
      updateDto.completed_at = Date.now();
    }

    await this.remediationActionRepository.update(id, updateDto);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const remediationAction = await this.findOne(id);
    await this.remediationActionRepository.remove(remediationAction);
  }

  async bulkUpdateStatus(
    ids: string[],
    status: RemediationStatus
  ): Promise<{
    updated: number;
    errors: string[];
  }> {
    const errors: string[] = [];
    let updated = 0;

    for (const id of ids) {
      try {
        await this.update(id, { status });
        updated++;
      } catch (error) {
        errors.push(`Failed to update ${id}: ${error.message}`);
      }
    }

    return { updated, errors };
  }

  async getStatistics(siteId?: string): Promise<{
    total: number;
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
    byType: Record<string, number>;
    avgCompletionTime: number;
    overdue: number;
    effectiveness: {
      avg: number;
      high: number;
      medium: number;
      low: number;
    };
  }> {
    let queryBuilder =
      this.remediationActionRepository.createQueryBuilder("remediation");

    if (siteId) {
      queryBuilder = queryBuilder.where("remediation.site_id = :siteId", {
        siteId,
      });
    }

    const actions = await queryBuilder.getMany();

    const stats = {
      total: actions.length,
      byStatus: {} as Record<string, number>,
      byPriority: {} as Record<string, number>,
      byType: {} as Record<string, number>,
      avgCompletionTime: 0,
      overdue: 0,
      effectiveness: {
        avg: 0,
        high: 0,
        medium: 0,
        low: 0,
      },
    };

    let totalCompletionTime = 0;
    let completedActions = 0;
    let totalEffectiveness = 0;
    let effectivenessCount = 0;
    const now = Date.now();

    actions.forEach((action) => {
      stats.byStatus[action.status] = (stats.byStatus[action.status] || 0) + 1;
      stats.byPriority[action.priority] =
        (stats.byPriority[action.priority] || 0) + 1;
      stats.byType[action.remediation_type] =
        (stats.byType[action.remediation_type] || 0) + 1;

      if (action.completed_at && action.executed_at) {
        totalCompletionTime += action.completed_at - action.executed_at;
        completedActions++;
      }

      if (
        action.due_date &&
        action.due_date < now &&
        action.status !== RemediationStatus.COMPLETED
      ) {
        stats.overdue++;
      }

      if (action.effectiveness_score > 0) {
        totalEffectiveness += action.effectiveness_score;
        effectivenessCount++;

        if (action.effectiveness_score > 80) {
          stats.effectiveness.high++;
        } else if (action.effectiveness_score >= 50) {
          stats.effectiveness.medium++;
        } else {
          stats.effectiveness.low++;
        }
      }
    });

    stats.avgCompletionTime =
      completedActions > 0 ? totalCompletionTime / completedActions : 0;
    stats.effectiveness.avg =
      effectivenessCount > 0 ? totalEffectiveness / effectivenessCount : 0;

    return stats;
  }

  async getActionsBySource(
    sourceType: "incident" | "threat" | "vulnerability",
    sourceId: string
  ): Promise<RemediationAction[]> {
    const whereCondition: any = {};

    switch (sourceType) {
      case "incident":
        whereCondition.incident_id = sourceId;
        break;
      case "threat":
        whereCondition.threat_indicator_id = sourceId;
        break;
      case "vulnerability":
        whereCondition.site_vulnerability_id = sourceId;
        break;
      default:
        throw new BadRequestException("Invalid source type");
    }

    return await this.remediationActionRepository.find({
      where: whereCondition,
      relations: ["site"],
      order: { createdAt: "DESC" },
    });
  }

  private createQueryBuilder(
    filters: RemediationActionsFilterDto
  ): SelectQueryBuilder<RemediationAction> {
    let queryBuilder = this.remediationActionRepository
      .createQueryBuilder("remediation")
      .leftJoinAndSelect("remediation.site", "site")
      .leftJoinAndSelect("remediation.incident", "incident")
      .leftJoinAndSelect("remediation.threatIndicator", "threatIndicator")
      .leftJoinAndSelect("remediation.siteVulnerability", "siteVulnerability")
      .leftJoinAndSelect("siteVulnerability.vulnerability", "vulnerability");

    // Apply filters
    if (filters.site_id) {
      queryBuilder = queryBuilder.andWhere("remediation.site_id = :siteId", {
        siteId: filters.site_id,
      });
    }

    if (filters.status) {
      queryBuilder = queryBuilder.andWhere("remediation.status = :status", {
        status: filters.status,
      });
    }

    if (filters.priority) {
      queryBuilder = queryBuilder.andWhere("remediation.priority = :priority", {
        priority: filters.priority,
      });
    }

    if (filters.remediation_type) {
      queryBuilder = queryBuilder.andWhere(
        "remediation.remediation_type = :type",
        { type: filters.remediation_type }
      );
    }

    if (filters.assigned_to) {
      queryBuilder = queryBuilder.andWhere(
        "remediation.assigned_to = :assignedTo",
        { assignedTo: filters.assigned_to }
      );
    }

    if (filters.action_type) {
      queryBuilder = queryBuilder.andWhere(
        "remediation.action_type ILIKE :actionType",
        { actionType: `%${filters.action_type}%` }
      );
    }

    if (filters.incident_id) {
      queryBuilder = queryBuilder.andWhere(
        "remediation.incident_id = :incidentId",
        { incidentId: filters.incident_id }
      );
    }

    if (filters.threat_indicator_id) {
      queryBuilder = queryBuilder.andWhere(
        "remediation.threat_indicator_id = :threatId",
        { threatId: filters.threat_indicator_id }
      );
    }

    if (filters.site_vulnerability_id) {
      queryBuilder = queryBuilder.andWhere(
        "remediation.site_vulnerability_id = :vulnId",
        { vulnId: filters.site_vulnerability_id }
      );
    }

    if (filters.due_date_from) {
      queryBuilder = queryBuilder.andWhere(
        "remediation.due_date >= :dueDateFrom",
        { dueDateFrom: filters.due_date_from }
      );
    }

    if (filters.due_date_to) {
      queryBuilder = queryBuilder.andWhere(
        "remediation.due_date <= :dueDateTo",
        { dueDateTo: filters.due_date_to }
      );
    }

    if (filters.executed_from) {
      queryBuilder = queryBuilder.andWhere(
        "remediation.executed_at >= :executedFrom",
        { executedFrom: filters.executed_from }
      );
    }

    if (filters.executed_to) {
      queryBuilder = queryBuilder.andWhere(
        "remediation.executed_at <= :executedTo",
        { executedTo: filters.executed_to }
      );
    }

    return queryBuilder;
  }
}
