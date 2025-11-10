import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  AgentEntity,
  Site,
  SiteStatus,
  ThreatIndicator,
} from "../../../libs/entities";
import { Repository } from "typeorm";
import { ReportThreatDto } from "./dto/report-threat.dto";
import { ThreatStatus } from "../../../libs/constant/src";

@Injectable()
export class AgentCommService {
  private readonly logger = new Logger(AgentCommService.name);

  constructor(
    @InjectRepository(AgentEntity)
    private agentRepository: Repository<AgentEntity>,
    @InjectRepository(Site)
    private siteRepository: Repository<Site>,
    @InjectRepository(ThreatIndicator)
    private threatRepository: Repository<ThreatIndicator>
  ) {}

  async handleCheckIn(site: Site) {
    const now = Date.now();

    // Update agent record
    await this.agentRepository.update(
      { site_id: site.id },
      {
        last_checkin: now,
        is_connected: 1,
      }
    );

    // Update site status
    await this.siteRepository.update(site.id, {
      status: SiteStatus.CONNECTED,
    });

    return {
      success: true,
      message: "Check-in successful",
      timestamp: now,
    };
  }

  async handleReportThreat(site: Site, reportThreatDto: ReportThreatDto) {
    try {
      const {
        indicator,
        type,
        severity,
        description,
        confidence = 75,
        tags = [],
        raw_logs = [],
        metadata = {},
      } = reportThreatDto;

      // Check if threat already exists
      let threat = await this.threatRepository.findOne({
        where: { indicator },
      });

      if (threat) {
        // Update existing threat
        threat.last_seen = new Date();
        threat.severity = severity;
        threat.description = description;
        threat.confidence = confidence;
        threat.tags = [...new Set([...(threat.tags || []), ...tags])];

        // Add to intelligence data
        const intelligenceEntry = {
          timestamp: new Date().toISOString(),
          source: "agent",
          site_name: site.name,
          description,
          metadata,
          raw_logs: raw_logs.slice(0, 5), // Keep last 5 logs
        };

        threat.intelligence = [
          ...(threat.intelligence || []),
          intelligenceEntry,
        ].slice(-10); // Keep last 10 intelligence entries

        await this.threatRepository.save(threat);

        this.logger.log(
          `Updated existing threat: ${indicator} from site ${site.name}`
        );

        return {
          success: true,
          message: "Threat updated successfully",
          threat_id: threat.id,
          is_new: false,
        };
      } else {
        // Create new threat
        threat = this.threatRepository.create({
          indicator,
          type,
          severity,
          description,
          confidence,
          tags,
          status: ThreatStatus.ACTIVE,
          first_seen: new Date(),
          last_seen: new Date(),
          site,
          intelligence: [
            {
              timestamp: new Date().toISOString(),
              source: "agent",
              site_name: site.name,
              description,
              metadata,
              raw_logs: raw_logs.slice(0, 5),
            },
          ],
        });

        await this.threatRepository.save(threat);

        this.logger.log(
          `New threat reported: ${indicator} (${type}) from site ${site.name}`
        );

        return {
          success: true,
          message: "Threat reported successfully",
          threat_id: threat.id,
          is_new: true,
        };
      }
    } catch (error) {
      this.logger.error(
        `Failed to report threat from site ${site.name}:`,
        error
      );
      throw error;
    }
  }
}
