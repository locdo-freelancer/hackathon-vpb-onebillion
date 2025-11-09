import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between } from "typeorm";
import { Vulnerability, SiteVulnerability, Site } from "../../../libs/entities";
import {
  CreateVulnerabilityDto,
  CreateSiteVulnerabilityDto,
  UpdateVulnerabilityDto,
  UpdateSiteVulnerabilityDto,
  VulnerabilitiesFilterDto,
} from "./dto";

@Injectable()
export class VulnerabilitiesService {
  constructor(
    @InjectRepository(Vulnerability)
    private vulnerabilitiesRepository: Repository<Vulnerability>,
    @InjectRepository(SiteVulnerability)
    private siteVulnerabilitiesRepository: Repository<SiteVulnerability>,
    @InjectRepository(Site)
    private sitesRepository: Repository<Site>
  ) {}

  // Vulnerability CRUD operations
  async createVulnerability(
    createVulnerabilityDto: CreateVulnerabilityDto
  ): Promise<Vulnerability> {
    // Check if CVE already exists
    const existingVuln = await this.vulnerabilitiesRepository.findOne({
      where: { cve_id: createVulnerabilityDto.cve_id },
    });

    if (existingVuln) {
      throw new BadRequestException(
        `Vulnerability ${createVulnerabilityDto.cve_id} already exists`
      );
    }

    const vulnerability = this.vulnerabilitiesRepository.create(
      createVulnerabilityDto
    );
    return await this.vulnerabilitiesRepository.save(vulnerability);
  }

  async findAllVulnerabilities(filter: VulnerabilitiesFilterDto = {}) {
    const queryBuilder = this.vulnerabilitiesRepository
      .createQueryBuilder("vulnerability")
      .leftJoinAndSelect("vulnerability.siteVulnerabilities", "siteVuln")
      .leftJoinAndSelect("siteVuln.site", "site")
      .orderBy("vulnerability.published_date", "DESC");

    // Apply filters
    if (filter.severity) {
      queryBuilder.andWhere("vulnerability.severity = :severity", {
        severity: filter.severity,
      });
    }

    if (filter.searchQuery) {
      queryBuilder.andWhere(
        "(vulnerability.cve_id ILIKE :search OR vulnerability.title ILIKE :search OR vulnerability.description ILIKE :search)",
        { search: `%${filter.searchQuery}%` }
      );
    }

    if (filter.dateFrom && filter.dateTo) {
      const fromTimestamp = new Date(filter.dateFrom).getTime();
      const toTimestamp = new Date(filter.dateTo).getTime();
      queryBuilder.andWhere(
        "vulnerability.published_date BETWEEN :fromDate AND :toDate",
        {
          fromDate: fromTimestamp,
          toDate: toTimestamp,
        }
      );
    }

    if (filter.cvssRange) {
      const [minScore, maxScore] = filter.cvssRange
        .split("-")
        .map((s) => parseFloat(s));
      if (!isNaN(minScore) && !isNaN(maxScore)) {
        queryBuilder.andWhere(
          "CAST(vulnerability.cvss_score AS FLOAT) BETWEEN :minScore AND :maxScore",
          {
            minScore,
            maxScore,
          }
        );
      }
    }

    const vulnerabilities = await queryBuilder.getMany();
    const stats = await this.getVulnerabilityStats();

    return {
      vulnerabilities: vulnerabilities.map((vuln) =>
        this.transformVulnerabilityForFrontend(vuln)
      ),
      stats,
    };
  }

  async findOneVulnerability(id: string): Promise<Vulnerability> {
    const vulnerability = await this.vulnerabilitiesRepository.findOne({
      where: { id },
      relations: ["siteVulnerabilities", "siteVulnerabilities.site"],
    });

    if (!vulnerability) {
      throw new NotFoundException(`Vulnerability with ID ${id} not found`);
    }

    return vulnerability;
  }

  async updateVulnerability(
    id: string,
    updateVulnerabilityDto: UpdateVulnerabilityDto
  ): Promise<Vulnerability> {
    const vulnerability = await this.findOneVulnerability(id);
    Object.assign(vulnerability, updateVulnerabilityDto);
    return await this.vulnerabilitiesRepository.save(vulnerability);
  }

  async removeVulnerability(id: string): Promise<void> {
    const result = await this.vulnerabilitiesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Vulnerability with ID ${id} not found`);
    }
  }

  // Site Vulnerability operations
  async assignVulnerabilityToSite(
    createSiteVulnerabilityDto: CreateSiteVulnerabilityDto
  ): Promise<SiteVulnerability> {
    // Check if vulnerability exists
    const vulnerability = await this.vulnerabilitiesRepository.findOne({
      where: { id: createSiteVulnerabilityDto.vulnerability_id },
    });
    if (!vulnerability) {
      throw new NotFoundException("Vulnerability not found");
    }

    // Check if site exists
    const site = await this.sitesRepository.findOne({
      where: { id: createSiteVulnerabilityDto.site_id },
    });
    if (!site) {
      throw new NotFoundException("Site not found");
    }

    // Check if assignment already exists
    const existing = await this.siteVulnerabilitiesRepository.findOne({
      where: {
        site_id: createSiteVulnerabilityDto.site_id,
        vulnerability_id: createSiteVulnerabilityDto.vulnerability_id,
      },
    });

    if (existing) {
      throw new BadRequestException(
        "Vulnerability already assigned to this site"
      );
    }

    const siteVulnerability = this.siteVulnerabilitiesRepository.create({
      ...createSiteVulnerabilityDto,
      status: createSiteVulnerabilityDto.status || "Active",
      last_scanned: createSiteVulnerabilityDto.last_scanned || Date.now(),
    });

    return await this.siteVulnerabilitiesRepository.save(siteVulnerability);
  }

  async findSiteVulnerabilities(
    siteId: string,
    filter: VulnerabilitiesFilterDto = {}
  ) {
    const queryBuilder = this.siteVulnerabilitiesRepository
      .createQueryBuilder("siteVuln")
      .leftJoinAndSelect("siteVuln.vulnerability", "vulnerability")
      .leftJoinAndSelect("siteVuln.site", "site")
      .where("siteVuln.site_id = :siteId", { siteId })
      .orderBy("siteVuln.detected_at", "DESC");

    // Apply filters
    if (filter.status) {
      queryBuilder.andWhere("siteVuln.status = :status", {
        status: filter.status,
      });
    }

    if (filter.severity) {
      queryBuilder.andWhere("vulnerability.severity = :severity", {
        severity: filter.severity,
      });
    }

    if (filter.searchQuery) {
      queryBuilder.andWhere(
        "(vulnerability.cve_id ILIKE :search OR vulnerability.title ILIKE :search)",
        { search: `%${filter.searchQuery}%` }
      );
    }

    const siteVulnerabilities = await queryBuilder.getMany();

    return {
      siteVulnerabilities: siteVulnerabilities.map((sv) =>
        this.transformSiteVulnerabilityForFrontend(sv)
      ),
      total: siteVulnerabilities.length,
    };
  }

  async updateSiteVulnerability(
    siteId: string,
    vulnerabilityId: string,
    updateDto: UpdateSiteVulnerabilityDto
  ): Promise<SiteVulnerability> {
    const siteVulnerability = await this.siteVulnerabilitiesRepository.findOne({
      where: { site_id: siteId, vulnerability_id: vulnerabilityId },
    });

    if (!siteVulnerability) {
      throw new NotFoundException("Site vulnerability not found");
    }

    Object.assign(siteVulnerability, updateDto);
    if (updateDto.status) {
      siteVulnerability.last_scanned = Date.now();
    }

    return await this.siteVulnerabilitiesRepository.save(siteVulnerability);
  }

  async removeSiteVulnerability(
    siteId: string,
    vulnerabilityId: string
  ): Promise<void> {
    const result = await this.siteVulnerabilitiesRepository.delete({
      site_id: siteId,
      vulnerability_id: vulnerabilityId,
    });

    if (result.affected === 0) {
      throw new NotFoundException("Site vulnerability not found");
    }
  }

  async getVulnerabilityStats() {
    const totalVulns = await this.vulnerabilitiesRepository.count();

    const severityStats = await this.vulnerabilitiesRepository
      .createQueryBuilder("vulnerability")
      .select(["vulnerability.severity as severity", "COUNT(*) as count"])
      .groupBy("vulnerability.severity")
      .getRawMany();

    const siteVulnStats = await this.siteVulnerabilitiesRepository
      .createQueryBuilder("siteVuln")
      .select(["siteVuln.status as status", "COUNT(*) as count"])
      .groupBy("siteVuln.status")
      .getRawMany();

    return {
      total: totalVulns,
      bySeverity: severityStats.reduce((acc, stat) => {
        acc[stat.severity?.toLowerCase() || "unknown"] = parseInt(stat.count);
        return acc;
      }, {}),
      byStatus: siteVulnStats.reduce((acc, stat) => {
        acc[stat.status?.toLowerCase() || "unknown"] = parseInt(stat.count);
        return acc;
      }, {}),
    };
  }

  async getTopVulnerabilities(limit: number = 10) {
    const vulnerabilities = await this.vulnerabilitiesRepository
      .createQueryBuilder("vulnerability")
      .leftJoin("vulnerability.siteVulnerabilities", "siteVuln")
      .select([
        "vulnerability.id",
        "vulnerability.cve_id",
        "vulnerability.title",
        "vulnerability.severity",
        "vulnerability.cvss_score",
        "COUNT(siteVuln.id) as affected_sites",
      ])
      .groupBy("vulnerability.id")
      .orderBy("affected_sites", "DESC")
      .addOrderBy("CAST(vulnerability.cvss_score AS FLOAT)", "DESC")
      .limit(limit)
      .getRawMany();

    return vulnerabilities.map((vuln) => ({
      id: vuln.vulnerability_id,
      cveId: vuln.vulnerability_cve_id,
      title: vuln.vulnerability_title,
      severity: vuln.vulnerability_severity,
      cvssScore: vuln.vulnerability_cvss_score,
      affectedSites: parseInt(vuln.affected_sites) || 0,
    }));
  }

  async scanSiteForVulnerabilities(siteId: string): Promise<any> {
    // Mock vulnerability scanning - in real implementation this would
    // integrate with vulnerability scanners like Nessus, OpenVAS, etc.
    const site = await this.sitesRepository.findOne({ where: { id: siteId } });
    if (!site) {
      throw new NotFoundException("Site not found");
    }

    // Simulate finding some vulnerabilities
    const mockVulnerabilities = [
      "CVE-2023-12345",
      "CVE-2023-54321",
      "CVE-2023-67890",
    ];

    const results = [];
    for (const cveId of mockVulnerabilities) {
      let vulnerability = await this.vulnerabilitiesRepository.findOne({
        where: { cve_id: cveId },
      });

      if (!vulnerability) {
        // Create vulnerability if it doesn't exist
        vulnerability = await this.createVulnerability({
          cve_id: cveId,
          title: `Mock Vulnerability ${cveId}`,
          severity: "High",
          cvss_score: "7.5",
          published_date: Date.now(),
        });
      }

      // Assign to site if not already assigned
      try {
        await this.assignVulnerabilityToSite({
          site_id: siteId,
          vulnerability_id: vulnerability.id,
          detected_at: Date.now(),
        });
        results.push({ cve_id: cveId, status: "newly_detected" });
      } catch (error) {
        results.push({ cve_id: cveId, status: "already_exists" });
      }
    }

    return {
      message: "Vulnerability scan completed",
      scannedAt: new Date().toISOString(),
      results,
    };
  }

  private transformVulnerabilityForFrontend(vulnerability: Vulnerability): any {
    return {
      id: vulnerability.id,
      cveId: vulnerability.cve_id,
      title: vulnerability.title,
      description: vulnerability.description || "",
      severity: vulnerability.severity || "Unknown",
      cvssScore: vulnerability.cvss_score || "N/A",
      publishedDate: new Date(vulnerability.published_date).toISOString(),
      remediationInfo: vulnerability.remediation_info || "",
      affectedSites: vulnerability.siteVulnerabilities?.length || 0,
      sites:
        vulnerability.siteVulnerabilities?.map((sv) => ({
          id: sv.site?.id,
          name: sv.site?.name,
          status: sv.status,
          detectedAt: new Date(sv.detected_at).toISOString(),
          lastScanned: sv.last_scanned
            ? new Date(sv.last_scanned).toISOString()
            : null,
        })) || [],
    };
  }

  private transformSiteVulnerabilityForFrontend(
    siteVulnerability: SiteVulnerability
  ): any {
    return {
      vulnerability: {
        id: siteVulnerability.vulnerability.id,
        cveId: siteVulnerability.vulnerability.cve_id,
        title: siteVulnerability.vulnerability.title,
        severity: siteVulnerability.vulnerability.severity,
        cvssScore: siteVulnerability.vulnerability.cvss_score,
      },
      site: {
        id: siteVulnerability.site?.id,
        name: siteVulnerability.site?.name,
      },
      status: siteVulnerability.status,
      detectedAt: new Date(siteVulnerability.detected_at).toISOString(),
      lastScanned: siteVulnerability.last_scanned
        ? new Date(siteVulnerability.last_scanned).toISOString()
        : null,
      context: siteVulnerability.context,
    };
  }
}
