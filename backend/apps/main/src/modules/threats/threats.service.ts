import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, MoreThan } from "typeorm";
import { ThreatIndicator, Site } from "@lib/entities";
import {
  CreateThreatIndicatorDto,
  UpdateThreatIndicatorDto,
  ThreatsFilterDto,
} from "./dto";
import { ThreatSeverity, ThreatStatus, ThreatType } from "@lib/constant";
import { SqsService } from "../../aws/services/sqs.service";
import { EventBridgeService } from "../../aws/services/eventbridge.service";
import { S3Service } from "../../aws/services/s3.service";
import { LambdaService } from "../../aws/services/lambda.service";
import { RedisService } from "../redis/redis.service";
import { SecretsManagerService } from "../../aws";

@Injectable()
export class ThreatsService {
  private readonly logger = new Logger(ThreatsService.name);

  constructor(
    @InjectRepository(ThreatIndicator)
    private threatIndicatorsRepository: Repository<ThreatIndicator>,
    @InjectRepository(Site)
    private sitesRepository: Repository<Site>,
    private sqsService: SqsService,
    private eventBridgeService: EventBridgeService,
    private s3Service: S3Service,
    private lambdaService: LambdaService,
    private redisService: RedisService,
    private readonly secretsService: SecretsManagerService
  ) {}

  // async enrichIPAddress(ip: string) {
  //   // Get all AI API keys at once
  //   const apiKeys = await this.secretsService.getAIAPIKeys();

  //   const results = {
  //     virusTotal: null,
  //     abuseIPDB: null,
  //     shodan: null,
  //   };

  //   // VirusTotal
  //   try {
  //     const vtResponse = await axios.get(
  //       `https://www.virustotal.com/api/v3/ip_addresses/${ip}`,
  //       { headers: { "x-apikey": apiKeys.virustotal } }
  //     );
  //     results.virusTotal = vtResponse.data;
  //   } catch (error) {
  //     console.error("VirusTotal error:", error.message);
  //   }

  //   // AbuseIPDB
  //   try {
  //     const abuseResponse = await axios.get(
  //       "https://api.abuseipdb.com/api/v2/check",
  //       {
  //         params: { ipAddress: ip },
  //         headers: { Key: apiKeys.abuseipdb },
  //       }
  //     );
  //     results.abuseIPDB = abuseResponse.data;
  //   } catch (error) {
  //     console.error("AbuseIPDB error:", error.message);
  //   }

  //   // Shodan
  //   try {
  //     const shodanResponse = await axios.get(
  //       `https://api.shodan.io/shodan/host/${ip}`,
  //       { params: { key: apiKeys.shodan } }
  //     );
  //     results.shodan = shodanResponse.data;
  //   } catch (error) {
  //     console.error("Shodan error:", error.message);
  //   }

  //   return results;
  // }

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

    const savedThreat =
      await this.threatIndicatorsRepository.save(threatIndicator);

    // Reload with site relation
    const threatWithSite = await this.threatIndicatorsRepository.findOne({
      where: { id: savedThreat.id },
      relations: ["site"],
    });

    // Push threat event to SQS for enrichment and analysis
    try {
      await this.sqsService.sendThreatEvent({
        threatId: savedThreat.id,
        siteId: threatWithSite?.site?.id || "unknown",
        indicator: savedThreat.indicator,
        type: savedThreat.type,
        severity: savedThreat.severity,
        confidence: savedThreat.confidence || 50,
      });

      // Send enrichment request to dedicated queue
      await this.sqsService.sendEnrichmentRequest({
        type: this.mapThreatTypeToEnrichmentType(savedThreat.type),
        indicator: savedThreat.indicator,
        sources: ["virustotal", "abuseipdb", "shodan"],
        callbackEventId: savedThreat.id,
        priority: this.mapSeverityToPriority(savedThreat.severity),
      });

      // Trigger Lambda enrichment worker asynchronously for immediate enrichment
      await this.lambdaService.invokeEnrichmentWorkerAsync({
        indicator: savedThreat.indicator,
        type: this.mapThreatTypeToEnrichmentType(savedThreat.type),
        sources: ["virustotal", "abuseipdb", "shodan"],
        requestId: savedThreat.id,
      });

      // Trigger EventBridge workflow for orchestration
      await this.eventBridgeService.publishThreatDetected({
        id: savedThreat.id,
        indicator: savedThreat.indicator,
        type: savedThreat.type,
        severity: savedThreat.severity,
        confidence: savedThreat.confidence || 50,
        siteId: threatWithSite?.site?.id || "unknown",
        workflowStep: "detected",
      });

      // Store threat data in S3 for long-term intelligence
      await this.s3Service.storeThreatIntelligence(
        savedThreat.indicator,
        savedThreat.type,
        {
          id: savedThreat.id,
          indicator: savedThreat.indicator,
          type: savedThreat.type,
          severity: savedThreat.severity,
          confidence: savedThreat.confidence,
          description: savedThreat.description,
          tags: savedThreat.tags,
          createdAt: new Date().toISOString(),
        }
      );

      this.logger.log(
        `Threat created and AWS workflows triggered: ${savedThreat.indicator}`
      );
    } catch (error) {
      this.logger.error(
        `Failed to trigger AWS workflows: ${error.message}`,
        error.stack
      );
    }

    return savedThreat;
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

    // Try to get enrichment data from Redis cache first
    const cacheKey = `threat:enrichment:${indicator.indicator}`;
    const cachedEnrichment = await this.redisService.get(cacheKey);

    if (cachedEnrichment) {
      this.logger.log(
        `Retrieved enrichment from cache for ${indicator.indicator}`
      );
      // Update indicator with cached enrichment data
      indicator.intelligence =
        cachedEnrichment.intelligence || indicator.intelligence;
      indicator.isp = cachedEnrichment.isp || indicator.isp;
      indicator.asn = cachedEnrichment.asn || indicator.asn;
      indicator.organization =
        cachedEnrichment.organization || indicator.organization;
      return this.transformIndicatorDetailForFrontend(indicator);
    }

    // If not in cache, trigger enrichment and return basic info
    try {
      await this.enrichThreatIndicator(id);
    } catch (error) {
      this.logger.error(`Failed to trigger enrichment: ${error.message}`);
    }

    return this.transformIndicatorDetailForFrontend(indicator);
  }

  /**
   * Enrich threat indicator using Lambda workers
   */
  async enrichThreatIndicator(id: string): Promise<any> {
    const indicator = await this.threatIndicatorsRepository.findOne({
      where: { id },
    });

    if (!indicator) {
      throw new NotFoundException(`Threat indicator with ID ${id} not found`);
    }

    const cacheKey = `threat:enrichment:${indicator.indicator}`;

    // Check cache first
    const cachedResult = await this.redisService.get(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    try {
      // Call Lambda enrichment worker synchronously
      const enrichmentResult = await this.lambdaService.invokeEnrichmentWorker({
        indicator: indicator.indicator,
        type: this.mapThreatTypeToEnrichmentType(indicator.type),
        sources: ["virustotal", "abuseipdb", "shodan"],
        requestId: indicator.id,
      });

      // Store enrichment result in S3
      await this.s3Service.storeThreatIntelligence(
        indicator.indicator,
        indicator.type,
        enrichmentResult
      );

      // Cache enrichment result in Redis (TTL: 24 hours)
      await this.redisService.set(cacheKey, enrichmentResult, 86400);

      // Update indicator with enrichment data
      await this.threatIndicatorsRepository.update(indicator.id, {
        intelligence: enrichmentResult.intelligence || [],
        isp: enrichmentResult.isp,
        asn: enrichmentResult.asn,
        organization: enrichmentResult.organization,
        malware_family: enrichmentResult.malwareFamily,
        related_indicators: enrichmentResult.relatedIndicators || [],
      });

      this.logger.log(`Enrichment completed for ${indicator.indicator}`);

      return enrichmentResult;
    } catch (error) {
      this.logger.error(
        `Enrichment failed for ${indicator.indicator}: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }

  /**
   * Batch enrich multiple threat indicators
   */
  async batchEnrichThreats(ids: string[]): Promise<any> {
    const indicators = await this.threatIndicatorsRepository.findByIds(ids);

    if (indicators.length === 0) {
      throw new NotFoundException("No threat indicators found");
    }

    const enrichmentRequests = indicators.map((indicator) => ({
      indicator: indicator.indicator,
      type: this.mapThreatTypeToEnrichmentType(indicator.type),
      sources: ["virustotal", "abuseipdb", "shodan"],
    }));

    try {
      // Use Lambda batch enrichment
      const results =
        await this.lambdaService.batchEnrichment(enrichmentRequests);

      // Store results in S3 and cache
      for (let i = 0; i < indicators.length; i++) {
        const indicator = indicators[i];
        const result = results[i];

        if (result && !result.error) {
          // Store in S3
          await this.s3Service.storeThreatIntelligence(
            indicator.indicator,
            indicator.type,
            result
          );

          // Cache in Redis
          const cacheKey = `threat:enrichment:${indicator.indicator}`;
          await this.redisService.set(cacheKey, result, 86400);

          // Update database
          await this.threatIndicatorsRepository.update(indicator.id, {
            intelligence: result.intelligence || [],
            isp: result.isp,
            asn: result.asn,
            organization: result.organization,
          });
        }
      }

      this.logger.log(
        `Batch enrichment completed for ${indicators.length} threats`
      );

      return {
        success: true,
        enriched: results.filter((r) => !r.error).length,
        failed: results.filter((r) => r.error).length,
        results,
      };
    } catch (error) {
      this.logger.error(
        `Batch enrichment failed: ${error.message}`,
        error.stack
      );
      throw error;
    }
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

  private mapThreatTypeToEnrichmentType(
    type: ThreatType
  ): "ip" | "domain" | "url" | "hash" {
    const mapping = {
      [ThreatType.IP]: "ip" as const,
      [ThreatType.DOMAIN]: "domain" as const,
      [ThreatType.URL]: "url" as const,
      [ThreatType.HASH]: "hash" as const,
    };
    return mapping[type] || "ip";
  }

  private mapSeverityToPriority(
    severity: ThreatSeverity
  ): "low" | "medium" | "high" {
    const mapping = {
      [ThreatSeverity.CRITICAL]: "high" as const,
      [ThreatSeverity.HIGH]: "high" as const,
      [ThreatSeverity.MEDIUM]: "medium" as const,
      [ThreatSeverity.LOW]: "low" as const,
    };
    return mapping[severity] || "medium";
  }
}
