import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, MoreThan } from "typeorm";
import {
  ThreatIndicator,
  ThreatSeverity,
  ThreatStatus,
  ThreatType,
  Site,
} from "@lib/entities";
import {
  CreateThreatIndicatorDto,
  UpdateThreatIndicatorDto,
  ThreatsFilterDto,
} from "./dto";

@Injectable()
export class ThreatsService {
  constructor(
    @InjectRepository(ThreatIndicator)
    private threatIndicatorsRepository: Repository<ThreatIndicator>,
    @InjectRepository(Site)
    private sitesRepository: Repository<Site>
  ) {}

  async create(
    createThreatIndicatorDto: CreateThreatIndicatorDto
  ): Promise<ThreatIndicator> {
    // Set default icon and color based on type
    const iconConfig = this.getIconConfig(
      createThreatIndicatorDto.type,
      createThreatIndicatorDto.severity
    );

    const threatIndicator = this.threatIndicatorsRepository.create({
      ...createThreatIndicatorDto,
      icon: createThreatIndicatorDto.icon || iconConfig.icon,
      icon_color: createThreatIndicatorDto.icon_color || iconConfig.color,
      severity: createThreatIndicatorDto.severity || ThreatSeverity.MEDIUM,
      status: createThreatIndicatorDto.status || ThreatStatus.MONITORING,
      confidence: createThreatIndicatorDto.confidence || 50,
    });

    return await this.threatIndicatorsRepository.save(threatIndicator);
  }

  async findAll(filter: ThreatsFilterDto = {}) {
    const queryBuilder = this.threatIndicatorsRepository
      .createQueryBuilder("indicator")
      .leftJoinAndSelect("indicator.site", "site")
      .orderBy("indicator.last_seen", "DESC");

    // Apply filters
    if (filter.severity && filter.severity !== "all") {
      queryBuilder.andWhere("indicator.severity = :severity", {
        severity: filter.severity,
      });
    }

    if (filter.type && filter.type !== "all") {
      queryBuilder.andWhere("indicator.type = :type", { type: filter.type });
    }

    if (filter.status && filter.status !== "all") {
      queryBuilder.andWhere("indicator.status = :status", {
        status: filter.status,
      });
    }

    if (filter.country) {
      queryBuilder.andWhere("indicator.country_code = :countryCode", {
        countryCode: filter.country,
      });
    }

    if (filter.siteId) {
      queryBuilder.andWhere("indicator.site_id = :siteId", {
        siteId: filter.siteId,
      });
    }

    if (filter.timeRange && filter.timeRange !== "all") {
      const timeThreshold = this.getTimeThreshold(filter.timeRange);
      queryBuilder.andWhere("indicator.last_seen >= :timeThreshold", {
        timeThreshold,
      });
    }

    if (filter.searchQuery) {
      queryBuilder.andWhere(
        "(indicator.indicator ILIKE :search OR indicator.description ILIKE :search OR indicator.country ILIKE :search)",
        { search: `%${filter.searchQuery}%` }
      );
    }

    const indicators = await queryBuilder.getMany();
    const stats = await this.getStats();

    // Transform for frontend compatibility
    const transformedIndicators = indicators.map((indicator) =>
      this.transformIndicatorForFrontend(indicator)
    );

    return {
      indicators: transformedIndicators,
      stats,
    };
  }

  async findOne(id: string): Promise<any> {
    const indicator = await this.threatIndicatorsRepository.findOne({
      where: { id },
      relations: ["site"],
    });

    if (!indicator) {
      throw new NotFoundException(`Threat indicator with ID ${id} not found`);
    }

    return this.transformIndicatorDetailForFrontend(indicator);
  }

  async update(
    id: string,
    updateThreatIndicatorDto: UpdateThreatIndicatorDto
  ): Promise<ThreatIndicator> {
    const indicator = await this.threatIndicatorsRepository.findOne({
      where: { id },
    });
    if (!indicator) {
      throw new NotFoundException(`Threat indicator with ID ${id} not found`);
    }

    // Update icon and color if type or severity changed
    if (updateThreatIndicatorDto.type || updateThreatIndicatorDto.severity) {
      const iconConfig = this.getIconConfig(
        updateThreatIndicatorDto.type || indicator.type,
        updateThreatIndicatorDto.severity || indicator.severity
      );
      updateThreatIndicatorDto.icon =
        updateThreatIndicatorDto.icon || iconConfig.icon;
      updateThreatIndicatorDto.icon_color =
        updateThreatIndicatorDto.icon_color || iconConfig.color;
    }

    Object.assign(indicator, updateThreatIndicatorDto);
    indicator.last_seen = new Date(); // Update last seen timestamp

    return await this.threatIndicatorsRepository.save(indicator);
  }

  async remove(id: string): Promise<void> {
    const result = await this.threatIndicatorsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Threat indicator with ID ${id} not found`);
    }
  }

  async block(id: string): Promise<ThreatIndicator> {
    return await this.update(id, { status: ThreatStatus.BLOCKED });
  }

  async unblock(id: string): Promise<ThreatIndicator> {
    return await this.update(id, { status: ThreatStatus.MONITORING });
  }

  async bulkBlock(ids: string[]): Promise<any> {
    await this.threatIndicatorsRepository.update(
      { id: { $in: ids } as any },
      { status: ThreatStatus.BLOCKED }
    );
    return { message: `${ids.length} indicators blocked successfully` };
  }

  async bulkDelete(ids: string[]): Promise<any> {
    await this.threatIndicatorsRepository.delete({ id: { $in: ids } as any });
    return { message: `${ids.length} indicators deleted successfully` };
  }

  async getStats() {
    const stats = await this.threatIndicatorsRepository
      .createQueryBuilder("indicator")
      .select([
        "COUNT(*) as total",
        `COUNT(CASE WHEN indicator.severity = '${ThreatSeverity.CRITICAL}' THEN 1 END) as critical`,
        `COUNT(CASE WHEN indicator.severity = '${ThreatSeverity.HIGH}' THEN 1 END) as high`,
        `COUNT(CASE WHEN indicator.severity = '${ThreatSeverity.MEDIUM}' THEN 1 END) as medium`,
        `COUNT(CASE WHEN indicator.severity = '${ThreatSeverity.LOW}' THEN 1 END) as low`,
        `COUNT(CASE WHEN indicator.status = '${ThreatStatus.BLOCKED}' THEN 1 END) as blocked`,
        `COUNT(CASE WHEN indicator.status = '${ThreatStatus.ACTIVE}' THEN 1 END) as active`,
      ])
      .getRawOne();

    return {
      total: parseInt(stats.total) || 0,
      critical: parseInt(stats.critical) || 0,
      high: parseInt(stats.high) || 0,
      medium: parseInt(stats.medium) || 0,
      low: parseInt(stats.low) || 0,
      blocked: parseInt(stats.blocked) || 0,
      active: parseInt(stats.active) || 0,
    };
  }

  private transformIndicatorForFrontend(indicator: ThreatIndicator): any {
    return {
      id: indicator.id,
      indicator: indicator.indicator,
      description: indicator.description || "",
      type: indicator.type,
      severity: indicator.severity,
      confidence: indicator.confidence,
      country: indicator.country || "Unknown",
      countryCode: indicator.country_code || "",
      countryFlag: indicator.country_flag || "",
      firstSeen: this.formatTimeAgo(indicator.first_seen),
      lastSeen: this.formatTimeAgo(indicator.last_seen),
      status: indicator.status,
      icon: indicator.icon || "fas fa-exclamation-triangle",
      iconColor: indicator.icon_color || "text-yellow-400",
    };
  }

  private transformIndicatorDetailForFrontend(indicator: ThreatIndicator): any {
    const base = this.transformIndicatorForFrontend(indicator);

    return {
      ...base,
      enrichment: {
        isp: indicator.isp || "Unknown",
        asn: indicator.asn || "Unknown",
        organization: indicator.organization || "Unknown",
        tags: indicator.tags || [],
        malwareFamily: indicator.malware_family,
      },
      intelligence: indicator.intelligence || [],
      relatedIndicators:
        indicator.related_indicators?.map((rel) => ({
          id: `rel-${Math.random().toString(36).substr(2, 9)}`,
          indicator: rel,
          type: this.guessIndicatorType(rel),
        })) || [],
    };
  }

  private getIconConfig(type: ThreatType, severity?: ThreatSeverity) {
    const iconMap = {
      [ThreatType.IP]: "fas fa-server",
      [ThreatType.DOMAIN]: "fas fa-globe",
      [ThreatType.URL]: "fas fa-link",
      [ThreatType.HASH]: "fas fa-file-code",
    };

    const colorMap = {
      [ThreatSeverity.CRITICAL]: "text-red-400",
      [ThreatSeverity.HIGH]: "text-orange-400",
      [ThreatSeverity.MEDIUM]: "text-yellow-400",
      [ThreatSeverity.LOW]: "text-blue-400",
    };

    return {
      icon: iconMap[type] || "fas fa-exclamation-triangle",
      color: colorMap[severity || ThreatSeverity.MEDIUM],
    };
  }

  private getTimeThreshold(timeRange: string): Date {
    const now = new Date();
    switch (timeRange) {
      case "24h":
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case "7d":
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case "30d":
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case "90d":
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      default:
        return new Date(0); // Beginning of time
    }
  }

  private formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) {
      return `${diffSeconds}s ago`;
    } else if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  }

  private guessIndicatorType(indicator: string): ThreatType {
    // Simple heuristics to guess indicator type
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(indicator)) {
      return ThreatType.IP;
    } else if (/^https?:\/\//.test(indicator)) {
      return ThreatType.URL;
    } else if (/^[a-fA-F0-9]{32,}$/.test(indicator)) {
      return ThreatType.HASH;
    } else {
      return ThreatType.DOMAIN;
    }
  }
}
