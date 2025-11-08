import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder, Between } from "typeorm";
import {
  SecurityMetric,
  AlertThreshold,
  MetricType,
} from "libs/entities/src/security-metric.entity";
import {
  CreateSecurityMetricDto,
  UpdateSecurityMetricDto,
  SecurityMetricsFilterDto,
} from "./dto";

@Injectable()
export class SecurityMetricsService {
  constructor(
    @InjectRepository(SecurityMetric)
    private securityMetricRepository: Repository<SecurityMetric>
  ) {}

  async create(createDto: CreateSecurityMetricDto): Promise<SecurityMetric> {
    // Calculate change percentage if previous value is provided
    let changePercentage: number | undefined;
    if (createDto.previous_value && createDto.previous_value !== 0) {
      changePercentage =
        ((createDto.metric_value - createDto.previous_value) /
          createDto.previous_value) *
        100;
    }

    // Determine alert level based on thresholds
    const currentAlertLevel = this.calculateAlertLevel(createDto);

    const securityMetric = this.securityMetricRepository.create({
      ...createDto,
      recorded_at: Date.now(),
      change_percentage: changePercentage,
      current_alert_level: currentAlertLevel,
    });

    return await this.securityMetricRepository.save(securityMetric);
  }

  async findAll(filters: SecurityMetricsFilterDto): Promise<{
    data: SecurityMetric[];
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
    const { sort_by = "recorded_at", sort_order = "DESC" } = filters;
    queryBuilder.orderBy(`metric.${sort_by}`, sort_order);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<SecurityMetric> {
    const securityMetric = await this.securityMetricRepository.findOne({
      where: { id },
      relations: ["site", "notifications"],
    });

    if (!securityMetric) {
      throw new NotFoundException(`Security metric with ID ${id} not found`);
    }

    return securityMetric;
  }

  async update(
    id: string,
    updateDto: UpdateSecurityMetricDto
  ): Promise<SecurityMetric> {
    const securityMetric = await this.findOne(id);

    // Calculate change percentage if metric_value is being updated
    if (
      updateDto.metric_value !== undefined &&
      securityMetric.metric_value !== updateDto.metric_value
    ) {
      if (securityMetric.metric_value !== 0) {
        updateDto.change_percentage =
          ((updateDto.metric_value - securityMetric.metric_value) /
            securityMetric.metric_value) *
          100;
      }
      updateDto.previous_value = securityMetric.metric_value;
    }

    // Recalculate alert level if thresholds or value changed
    if (this.shouldRecalculateAlertLevel(updateDto)) {
      const updatedThresholds = {
        ...securityMetric,
        ...updateDto,
      };
      updateDto.current_alert_level =
        this.calculateAlertLevel(updatedThresholds);
    }

    await this.securityMetricRepository.update(id, updateDto);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const securityMetric = await this.findOne(id);
    await this.securityMetricRepository.remove(securityMetric);
  }

  async getMetricsBySite(
    siteId: string,
    limit = 100
  ): Promise<SecurityMetric[]> {
    return await this.securityMetricRepository.find({
      where: { site_id: siteId, is_active: true },
      order: { recorded_at: "DESC" },
      take: limit,
      relations: ["site"],
    });
  }

  async getLatestMetrics(siteId?: string): Promise<SecurityMetric[]> {
    let queryBuilder = this.securityMetricRepository
      .createQueryBuilder("metric")
      .leftJoinAndSelect("metric.site", "site")
      .where("metric.is_active = :active", { active: true });

    if (siteId) {
      queryBuilder = queryBuilder.andWhere("metric.site_id = :siteId", {
        siteId,
      });
    }

    // Get latest metric for each type
    const subQuery = this.securityMetricRepository
      .createQueryBuilder("sub")
      .select("sub.metric_type")
      .addSelect("MAX(sub.recorded_at)", "max_recorded_at")
      .where("sub.is_active = :active", { active: true });

    if (siteId) {
      subQuery.andWhere("sub.site_id = :siteId", { siteId });
    }

    subQuery.groupBy("sub.metric_type");

    queryBuilder = queryBuilder
      .innerJoin(
        `(${subQuery.getQuery()})`,
        "latest",
        "metric.metric_type = latest.metric_type AND metric.recorded_at = latest.max_recorded_at"
      )
      .setParameters(subQuery.getParameters());

    return await queryBuilder.getMany();
  }

  async getHistoricalData(
    siteId: string,
    metricType: MetricType,
    timeRangeHours = 24
  ): Promise<SecurityMetric[]> {
    const fromTime = Date.now() - timeRangeHours * 60 * 60 * 1000;

    return await this.securityMetricRepository.find({
      where: {
        site_id: siteId,
        metric_type: metricType,
        is_active: true,
        recorded_at: Between(fromTime, Date.now()),
      },
      order: { recorded_at: "ASC" },
    });
  }

  async getAlertsCount(siteId?: string): Promise<{
    total: number;
    byLevel: Record<string, number>;
  }> {
    let queryBuilder = this.securityMetricRepository
      .createQueryBuilder("metric")
      .where("metric.is_active = :active", { active: true })
      .andWhere("metric.current_alert_level IS NOT NULL");

    if (siteId) {
      queryBuilder = queryBuilder.andWhere("metric.site_id = :siteId", {
        siteId,
      });
    }

    const metrics = await queryBuilder.getMany();

    const result = {
      total: metrics.length,
      byLevel: {
        [AlertThreshold.LOW]: 0,
        [AlertThreshold.MEDIUM]: 0,
        [AlertThreshold.HIGH]: 0,
        [AlertThreshold.CRITICAL]: 0,
      },
    };

    metrics.forEach((metric) => {
      if (metric.current_alert_level) {
        result.byLevel[metric.current_alert_level]++;
      }
    });

    return result;
  }

  async getStatistics(siteId?: string): Promise<{
    total: number;
    active: number;
    byType: Record<string, number>;
    byCategory: Record<string, number>;
    byAlertLevel: Record<string, number>;
    trends: {
      improving: number;
      degrading: number;
      stable: number;
    };
  }> {
    let queryBuilder =
      this.securityMetricRepository.createQueryBuilder("metric");

    if (siteId) {
      queryBuilder = queryBuilder.where("metric.site_id = :siteId", { siteId });
    }

    const metrics = await queryBuilder.getMany();

    const stats = {
      total: metrics.length,
      active: 0,
      byType: {} as Record<string, number>,
      byCategory: {} as Record<string, number>,
      byAlertLevel: {} as Record<string, number>,
      trends: {
        improving: 0,
        degrading: 0,
        stable: 0,
      },
    };

    metrics.forEach((metric) => {
      if (metric.is_active) {
        stats.active++;
      }

      // Count by type
      stats.byType[metric.metric_type] =
        (stats.byType[metric.metric_type] || 0) + 1;

      // Count by category
      stats.byCategory[metric.category] =
        (stats.byCategory[metric.category] || 0) + 1;

      // Count by alert level
      if (metric.current_alert_level) {
        stats.byAlertLevel[metric.current_alert_level] =
          (stats.byAlertLevel[metric.current_alert_level] || 0) + 1;
      }

      // Analyze trends
      if (
        metric.change_percentage !== null &&
        metric.change_percentage !== undefined
      ) {
        if (metric.change_percentage > 5) {
          stats.trends.improving++;
        } else if (metric.change_percentage < -5) {
          stats.trends.degrading++;
        } else {
          stats.trends.stable++;
        }
      }
    });

    return stats;
  }

  async createBulkMetrics(
    metrics: CreateSecurityMetricDto[]
  ): Promise<SecurityMetric[]> {
    const processedMetrics = metrics.map((metric) => {
      let changePercentage: number | undefined;
      if (metric.previous_value && metric.previous_value !== 0) {
        changePercentage =
          ((metric.metric_value - metric.previous_value) /
            metric.previous_value) *
          100;
      }

      const currentAlertLevel = this.calculateAlertLevel(metric);

      return this.securityMetricRepository.create({
        ...metric,
        recorded_at: Date.now(),
        change_percentage: changePercentage,
        current_alert_level: currentAlertLevel,
      });
    });

    return await this.securityMetricRepository.save(processedMetrics);
  }

  private calculateAlertLevel(
    metric: Partial<SecurityMetric>
  ): AlertThreshold | null {
    const {
      metric_value,
      threshold_critical,
      threshold_high,
      threshold_medium,
      threshold_low,
    } = metric;

    if (!metric_value) return null;

    if (
      threshold_critical !== undefined &&
      metric_value >= threshold_critical
    ) {
      return AlertThreshold.CRITICAL;
    }
    if (threshold_high !== undefined && metric_value >= threshold_high) {
      return AlertThreshold.HIGH;
    }
    if (threshold_medium !== undefined && metric_value >= threshold_medium) {
      return AlertThreshold.MEDIUM;
    }
    if (threshold_low !== undefined && metric_value >= threshold_low) {
      return AlertThreshold.LOW;
    }

    return null;
  }

  private shouldRecalculateAlertLevel(
    updateDto: UpdateSecurityMetricDto
  ): boolean {
    return !!(
      updateDto.metric_value !== undefined ||
      updateDto.threshold_critical !== undefined ||
      updateDto.threshold_high !== undefined ||
      updateDto.threshold_medium !== undefined ||
      updateDto.threshold_low !== undefined
    );
  }

  private createQueryBuilder(
    filters: SecurityMetricsFilterDto
  ): SelectQueryBuilder<SecurityMetric> {
    let queryBuilder = this.securityMetricRepository
      .createQueryBuilder("metric")
      .leftJoinAndSelect("metric.site", "site");

    // Apply filters
    if (filters.site_id) {
      queryBuilder = queryBuilder.andWhere("metric.site_id = :siteId", {
        siteId: filters.site_id,
      });
    }

    if (filters.metric_type) {
      queryBuilder = queryBuilder.andWhere("metric.metric_type = :metricType", {
        metricType: filters.metric_type,
      });
    }

    if (filters.category) {
      queryBuilder = queryBuilder.andWhere("metric.category = :category", {
        category: filters.category,
      });
    }

    if (filters.current_alert_level) {
      queryBuilder = queryBuilder.andWhere(
        "metric.current_alert_level = :alertLevel",
        { alertLevel: filters.current_alert_level }
      );
    }

    if (filters.metric_name) {
      queryBuilder = queryBuilder.andWhere(
        "metric.metric_name ILIKE :metricName",
        { metricName: `%${filters.metric_name}%` }
      );
    }

    if (filters.source) {
      queryBuilder = queryBuilder.andWhere("metric.source = :source", {
        source: filters.source,
      });
    }

    if (filters.is_active !== undefined) {
      queryBuilder = queryBuilder.andWhere("metric.is_active = :isActive", {
        isActive: filters.is_active,
      });
    }

    if (filters.recorded_from) {
      queryBuilder = queryBuilder.andWhere(
        "metric.recorded_at >= :recordedFrom",
        { recordedFrom: filters.recorded_from }
      );
    }

    if (filters.recorded_to) {
      queryBuilder = queryBuilder.andWhere(
        "metric.recorded_at <= :recordedTo",
        { recordedTo: filters.recorded_to }
      );
    }

    if (filters.value_min !== undefined) {
      queryBuilder = queryBuilder.andWhere("metric.metric_value >= :valueMin", {
        valueMin: filters.value_min,
      });
    }

    if (filters.value_max !== undefined) {
      queryBuilder = queryBuilder.andWhere("metric.metric_value <= :valueMax", {
        valueMax: filters.value_max,
      });
    }

    return queryBuilder;
  }
}
