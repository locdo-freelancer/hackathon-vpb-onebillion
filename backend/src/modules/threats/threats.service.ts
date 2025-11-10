import { Injectable, NotFoundException, Inject, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, MoreThan } from "typeorm";
import {
  ThreatIndicator,
  ThreatSeverity,
  ThreatStatus,
  ThreatType,
  Site,
} from "../../../libs/entities";
import {
  CreateThreatIndicatorDto,
  UpdateThreatIndicatorDto,
  ThreatsFilterDto,
} from "./dto";
import { IncidentsService } from "../incidents/incidents.service";

@Injectable()
export class ThreatsService {
  constructor(
    @InjectRepository(ThreatIndicator)
    private threatIndicatorsRepository: Repository<ThreatIndicator>,
    @InjectRepository(Site)
    private sitesRepository: Repository<Site>,
    @Inject(forwardRef(() => IncidentsService))
    private incidentsService: IncidentsService
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

    const savedThreat = await this.threatIndicatorsRepository.save(threatIndicator);

    // Auto-create incident for critical/high severity threats
    if (savedThreat.severity === ThreatSeverity.CRITICAL || savedThreat.severity === ThreatSeverity.HIGH) {
      await this.autoCreateIncident(savedThreat);
    }

    return savedThreat;
  }

  async findAll(filter: ThreatsFilterDto = {}, userId?: string | number) {
    const queryBuilder = this.threatIndicatorsRepository
      .createQueryBuilder("indicator")
      .leftJoinAndSelect("indicator.site", "site");

    // Filter by user's sites only
    if (userId) {
      queryBuilder.andWhere("site.userId = :userId", { userId });
    }

    queryBuilder.orderBy("indicator.last_seen", "DESC");

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
      queryBuilder.andWhere("site.id = :siteId", {
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
    const stats = await this.getStats(userId);

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

  async getStats(userId?: string | number) {
    const queryBuilder = this.threatIndicatorsRepository
      .createQueryBuilder("indicator")
      .leftJoin("indicator.site", "site");

    // Filter by user if provided
    if (userId) {
      queryBuilder.where("site.userId = :userId", { userId });
    }

    const stats = await queryBuilder
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

  private async autoCreateIncident(threat: ThreatIndicator): Promise<void> {
    try {
      // Map threat type to incident type
      const incidentTypeMap = {
        [ThreatType.IP]: "brute_force",
        [ThreatType.DOMAIN]: "phishing",
        [ThreatType.URL]: "phishing",
        [ThreatType.HASH]: "malware",
      };

      const incidentType = incidentTypeMap[threat.type] || "unauthorized_access";

      // Create incident
      const incidentData = {
        title: `Security Incident: ${threat.indicator}`,
        description: `Automated incident created from threat detection\n\nThreat Details:\n- Type: ${threat.type}\n- Severity: ${threat.severity}\n- Confidence: ${threat.confidence}%\n- Source: ${threat.indicator}\n- Detected: ${threat.first_seen}`,
        ai_summary: `This incident was automatically generated from a ${threat.severity} severity threat detection. The system identified suspicious activity from ${threat.indicator} with ${threat.confidence}% confidence.`,
        severity: threat.severity,
        status: "open" as any,
        type: incidentType as any,
        source_ip: threat.indicator,
        tags: [threat.type, "automated", threat.severity],
        affected_systems: ["Production Server"],
        ai_recommendations: [
          {
            action: "Block IP Address",
            priority: "high",
            description: `Immediately block the source ${threat.indicator} at the firewall level`,
          },
          {
            action: "Review Logs",
            priority: "medium",
            description: "Analyze server logs for any successful authentication attempts",
          },
          {
            action: "Enable Monitoring",
            priority: "high",
            description: "Increase monitoring for similar threats",
          },
        ],
        ip_reputation: {
          score: 95,
          country: threat.country || "Unknown",
          asn: threat.asn || "Unknown",
          threat_level: threat.severity,
          blacklisted: true,
        },
        mitre_attack: [
          {
            tactic: "Initial Access",
            technique: "Valid Accounts",
            id: "T1078",
          },
          {
            tactic: "Credential Access",
            technique: "Brute Force",
            id: "T1110",
          },
        ],
        timeline: [
          {
            timestamp: threat.first_seen,
            event: "Threat Detected",
            description: `Suspicious activity detected: ${threat.indicator}`,
          },
          {
            timestamp: new Date(),
            event: "Incident Created",
            description: "Automated incident creation triggered",
          },
        ],
        recommendations: [
          `Immediately block ${threat.indicator}`,
          "Review authentication logs for the past 24 hours",
          "Enable MFA for all user accounts",
          "Update firewall rules to prevent similar attacks",
          "Monitor for related suspicious activity",
        ],
        evidence: [
          {
            type: "threat_detection",
            description: "Threat indicator that triggered this incident",
            data: {
              id: threat.id,
              indicator: threat.indicator,
              type: threat.type,
              severity: threat.severity,
              confidence: threat.confidence,
            },
          },
        ],
      };

      // Get user ID from threat's site or use system user
      let userId = null;
      if (threat.site) {
        const site = await this.sitesRepository.findOne({
          where: { id: threat.site.id },
          relations: ["user"],
        });
        if (site && site.user) {
          userId = site.user.id;
        }
      }

      await this.incidentsService.create(incidentData as any, userId);
      console.log(`✓ Auto-created incident for threat: ${threat.indicator}`);
    } catch (error) {
      console.error(`Failed to auto-create incident for threat ${threat.indicator}:`, error.message);
    }
  }
}
