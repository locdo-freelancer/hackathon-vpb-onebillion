import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  AgentEntity,
  Site,
  SiteStatus,
  ThreatIndicator,
  ThreatSeverity,
  Incident,
  User,
} from "../../../libs/entities";
import { Repository } from "typeorm";
import { ReportThreatDto } from "./dto/report-threat.dto";
import { ThreatStatus } from "../../../libs/constant/src";
import { AIService } from "../incidents/ai.service";

@Injectable()
export class AgentCommService {
  private readonly logger = new Logger(AgentCommService.name);

  constructor(
    @InjectRepository(AgentEntity)
    private agentRepository: Repository<AgentEntity>,
    @InjectRepository(Site)
    private siteRepository: Repository<Site>,
    @InjectRepository(ThreatIndicator)
    private threatRepository: Repository<ThreatIndicator>,
    @InjectRepository(Incident)
    private incidentRepository: Repository<Incident>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private aiService: AIService
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

        // Check if should create incident for updated threat (if severity increased to critical/high)
        if ((severity === ThreatSeverity.CRITICAL || severity === ThreatSeverity.HIGH)) {
          // Check if incident already exists for this threat
          const existingIncident = await this.incidentRepository.findOne({
            where: { source_ip: indicator },
          });
          
          if (!existingIncident) {
            await this.autoCreateIncident(threat, site);
          }
        }

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

        // Auto-create incident for critical/high severity threats
        if (severity === ThreatSeverity.CRITICAL || severity === ThreatSeverity.HIGH) {
          await this.autoCreateIncident(threat, site);
        }

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

  private async autoCreateIncident(threat: ThreatIndicator, site: Site): Promise<void> {
    try {
      // Get AI-powered analysis
      const aiAnalysis = await this.aiService.analyzeSecurityThreat({
        indicator: threat.indicator,
        type: threat.type,
        severity: threat.severity,
        confidence: threat.confidence,
        description: threat.description,
        intelligence: threat.intelligence,
        siteName: site.name,
      });

      // Map threat type to incident type (matching IncidentType enum)
      const incidentTypeMap: Record<string, string> = {
        ip: "network_intrusion",
        domain: "phishing",
        url: "phishing",
        hash: "malware",
      };

      const incidentType = incidentTypeMap[threat.type] || "suspicious_activity";

      // Create incident with AI-generated data
      const incidentData = {
        title: `Security Incident: ${threat.indicator}`,
        description: `Automated incident created from threat detection\n\nThreat Details:\n- Type: ${threat.type}\n- Severity: ${threat.severity}\n- Confidence: ${threat.confidence}%\n- Source: ${threat.indicator}\n- Site: ${site.name}\n- Detected: ${threat.first_seen}\n\n**AI Analysis Summary:**\n${aiAnalysis.summary}\n\n**Risk Assessment:**\n${aiAnalysis.risk_assessment}`,
        ai_summary: aiAnalysis.summary,
        severity: threat.severity,
        status: "open" as any,
        type: incidentType as any,
        source_ip: threat.indicator,
        tags: [...(threat.tags || []), "automated", threat.severity, "ai-analyzed"],
        affected_systems: [site.name],
        ai_recommendations: aiAnalysis.recommendations.map(rec => ({
          action: rec.action,
          priority: rec.priority,
          description: rec.description,
        })),
        ip_reputation: {
          score: 95,
          country: threat.country || "Unknown",
          asn: threat.asn || "Unknown",
          threat_level: threat.severity,
          blacklisted: true,
        },
        mitre_attack: aiAnalysis.mitre_techniques.length > 0 
          ? aiAnalysis.mitre_techniques
          : [
              {
                tactic: "Initial Access",
                technique: "Valid Accounts",
                id: "T1078",
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
            event: "AI Analysis Complete",
            description: "Threat analyzed using Google Gemini AI",
          },
          {
            timestamp: new Date(),
            event: "Incident Created",
            description: "Automated incident creation triggered",
          },
        ],
        recommendations: aiAnalysis.recommendations.map(rec => rec.action),
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
          {
            type: "ai_analysis",
            description: "AI-powered security analysis",
            data: {
              model: "Google Gemini AI",
              timestamp: new Date(),
              summary: aiAnalysis.summary,
              risk_assessment: aiAnalysis.risk_assessment,
            },
          },
        ],
      };

      // Get user from site
      const siteWithUser = await this.siteRepository.findOne({
        where: { id: site.id },
        relations: ["user"],
      });

      const userId = siteWithUser?.user?.id || null;
      const userEntity = userId ? await this.userRepository.findOne({ where: { id: userId } }) : undefined;

      // Generate incident ID
      const incidentCount = await this.incidentRepository.count();
      const incident_id = `INC-${String(incidentCount + 1).padStart(6, '0')}`;

      // Create incident directly in database
      const incident = this.incidentRepository.create({
        incident_id,
        title: incidentData.title,
        description: incidentData.description,
        ai_summary: incidentData.ai_summary,
        severity: incidentData.severity as any,
        status: incidentData.status as any,
        type: incidentData.type as any,
        source_ip: incidentData.source_ip,
        tags: incidentData.tags,
        affected_systems: incidentData.affected_systems,
        ai_recommendations: incidentData.ai_recommendations as any,
        ip_reputation: incidentData.ip_reputation as any,
        mitre_attack: incidentData.mitre_attack as any,
        timeline: incidentData.timeline as any,
        recommendations: incidentData.recommendations,
        evidence: incidentData.evidence as any,
        assignee: userEntity,
        site: site,
      });

      await this.incidentRepository.save(incident);
      this.logger.log(`✓ Auto-created incident ${incident_id} for threat: ${threat.indicator}`);
    } catch (error) {
      this.logger.error(
        `Failed to auto-create incident for threat ${threat.indicator}:`,
        error.message
      );
    }
  }
}
