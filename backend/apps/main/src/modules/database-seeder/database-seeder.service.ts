import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  User,
  Site,
  AgentEntity,
  Incident,
  ThreatIndicator,
  Vulnerability,
  SiteVulnerability,
  RemediationAction,
  SecurityMetric,
  Notification,
} from "@lib/entities";
import {
  IncidentSeverity,
  IncidentStatus,
  IncidentType,
  ThreatSeverity,
  ThreatType,
  ThreatStatus,
  RemediationStatus,
  RemediationPriority,
  RemediationType,
  NotificationType,
  NotificationPriority,
  NotificationChannel,
  MetricType,
  MetricCategory,
  AlertThreshold,
  SiteStatus,
  VulnerabilityStatus,
  VulnerabilitySeverity,
} from "@lib/constant";
import { Role } from "@lib/constant";
import { hashPasswordHelper } from "../../utils/hasPassword";

@Injectable()
export class DatabaseSeederService {
  private readonly logger = new Logger(DatabaseSeederService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Site)
    private siteRepository: Repository<Site>,
    @InjectRepository(AgentEntity)
    private agentRepository: Repository<AgentEntity>,
    @InjectRepository(Incident)
    private incidentRepository: Repository<Incident>,
    @InjectRepository(ThreatIndicator)
    private threatRepository: Repository<ThreatIndicator>,
    @InjectRepository(Vulnerability)
    private vulnerabilityRepository: Repository<Vulnerability>,
    @InjectRepository(SiteVulnerability)
    private siteVulnerabilityRepository: Repository<SiteVulnerability>,
    @InjectRepository(RemediationAction)
    private remediationRepository: Repository<RemediationAction>,
    @InjectRepository(SecurityMetric)
    private securityMetricRepository: Repository<SecurityMetric>,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>
  ) {}

  async seedAll() {
    this.logger.log("Starting database seeding...");

    try {
      // Clear existing data
      await this.clearDatabase();

      // Seed in order of dependencies
      const users = await this.seedUsers();
      const sites = await this.seedSites(users);
      const agents = await this.seedAgents(sites);
      const incidents = await this.seedIncidents(sites, users);
      const threats = await this.seedThreats(sites);
      const vulnerabilities = await this.seedVulnerabilities();
      const siteVulnerabilities = await this.seedSiteVulnerabilities(
        sites,
        vulnerabilities
      );
      const remediationActions = await this.seedRemediationActions(
        incidents,
        threats,
        siteVulnerabilities,
        sites
      );
      await this.seedSecurityMetrics(sites);
      await this.seedNotifications(users, sites, incidents, threats);

      this.logger.log("Database seeding completed successfully!");
      return {
        success: true,
        message: "Database seeded successfully",
        counts: {
          users: users.length,
          sites: sites.length,
          agents: agents.length,
          incidents: incidents.length,
          threats: threats.length,
          vulnerabilities: vulnerabilities.length,
          siteVulnerabilities: siteVulnerabilities.length,
          remediationActions: remediationActions.length,
        },
      };
    } catch (error) {
      this.logger.error("Database seeding failed:", error);
      throw error;
    }
  }

  private async clearDatabase() {
    this.logger.log("Clearing existing data...");

    // Use query builder to clear all data (supports truncate-like behavior)
    await this.notificationRepository.createQueryBuilder().delete().execute();
    await this.securityMetricRepository.createQueryBuilder().delete().execute();
    await this.remediationRepository.createQueryBuilder().delete().execute();
    await this.siteVulnerabilityRepository
      .createQueryBuilder()
      .delete()
      .execute();
    await this.incidentRepository.createQueryBuilder().delete().execute();
    await this.threatRepository.createQueryBuilder().delete().execute();
    await this.agentRepository.createQueryBuilder().delete().execute();
    await this.siteRepository.createQueryBuilder().delete().execute();
    await this.vulnerabilityRepository.createQueryBuilder().delete().execute();
    await this.userRepository.createQueryBuilder().delete().execute();

    this.logger.log("Database cleared");
  }

  private async seedUsers(): Promise<User[]> {
    this.logger.log("Seeding users...");

    const hashedPassword = await hashPasswordHelper("Password123!");

    const usersData = [
      {
        email: "admin@gmail.com",
        password: hashedPassword,
        full_name: "Admin User",
        role: Role.ADMIN,
        company: "SecureVault Inc",
        last_login: new Date().getTime(),
        phone: "+1234567890",
        is_active: true,
      },
      {
        email: "manager@gmail.com",
        password: hashedPassword,
        full_name: "Security Manager",
        role: Role.USER,
        company: "SecureVault Inc",
        last_login: new Date().getTime(),
        phone: "+1234567891",
        is_active: true,
      },
      {
        email: "analyst@gmail.com",
        password: hashedPassword,
        full_name: "Security Analyst",
        role: Role.USER,
        company: "SecureVault Inc",
        last_login: new Date().getTime(),
        phone: "+1234567892",
        is_active: true,
      },
      {
        email: "engineer@gmail.com",
        password: hashedPassword,
        full_name: "DevOps Engineer",
        role: Role.USER,
        company: "SecureVault Inc",
        last_login: new Date().getTime(),
        phone: "+1234567893",
        is_active: true,
      },
    ];

    const users = this.userRepository.create(usersData);
    return await this.userRepository.save(users);
  }

  private async seedSites(users: User[]): Promise<Site[]> {
    this.logger.log("Seeding sites...");

    const crypto = require("crypto");

    const sitesData = [
      {
        name: "Production Environment",
        status: SiteStatus.ACTIVE,
        ip_address: "192.168.1.100",
        domain_name: "prod.example.com",
        server_type: "Ubuntu 22.04 LTS",
        entity_token: crypto.randomBytes(32).toString("hex"),
        user: users[0],
      },
      {
        name: "Development Environment",
        status: SiteStatus.ACTIVE,
        ip_address: "192.168.1.101",
        domain_name: "dev.example.com",
        server_type: "CentOS 8",
        entity_token: crypto.randomBytes(32).toString("hex"),
        user: users[1],
      },
      {
        name: "Staging Environment",
        status: SiteStatus.ACTIVE,
        ip_address: "192.168.1.102",
        domain_name: "staging.example.com",
        server_type: "Windows Server 2022",
        entity_token: crypto.randomBytes(32).toString("hex"),
        user: users[0],
      },
      {
        name: "Customer Portal",
        status: SiteStatus.ACTIVE,
        ip_address: "192.168.1.103",
        domain_name: "portal.example.com",
        server_type: "Debian 11",
        entity_token: crypto.randomBytes(32).toString("hex"),
        user: users[1],
      },
    ];

    const sites = this.siteRepository.create(sitesData);
    return await this.siteRepository.save(sites);
  }

  private async seedAgents(sites: Site[]): Promise<AgentEntity[]> {
    this.logger.log("Seeding agents...");

    const agentsData = [
      {
        site: sites[0],
        is_connected: 1,
        last_checkin: Date.now(),
        agent_version: "1.5.2",
        os_info: "Ubuntu 22.04 LTS",
      },
      {
        site: sites[1],
        is_connected: 1,
        last_checkin: Date.now() - 60000,
        agent_version: "1.5.2",
        os_info: "CentOS 8",
      },
      {
        site: sites[2],
        is_connected: 1,
        last_checkin: Date.now() - 120000,
        agent_version: "1.5.1",
        os_info: "Windows Server 2022",
      },
      {
        site: sites[3],
        is_connected: 0,
        last_checkin: Date.now() - 3600000,
        agent_version: "1.5.2",
        os_info: "Debian 11",
      },
    ];

    const agents = this.agentRepository.create(agentsData);
    return await this.agentRepository.save(agents);
  }

  private async seedIncidents(
    sites: Site[],
    users: User[]
  ): Promise<Incident[]> {
    this.logger.log("Seeding incidents...");

    const incidentsData = [
      {
        incident_id: "INC-" + Date.now() + "-001",
        title: "Suspicious Login Attempts Detected",
        description:
          "Multiple failed login attempts from unknown IP addresses detected on production server",
        severity: IncidentSeverity.HIGH,
        status: IncidentStatus.OPEN,
        type: IncidentType.NETWORK_INTRUSION,
        site: sites[0],
        assignee: users[2],
        affected_systems: ["prod-web-01", "prod-auth-service"],
        tags: ["authentication", "brute-force"],
        source_ip: "185.220.101.45",
        ai_summary:
          "Detected brute force attack pattern from known malicious IP. Recommend immediate IP blocking.",
      },
      {
        incident_id: "INC-" + Date.now() + "-002",
        title: "Malware Detection - Trojan.Win32",
        description:
          "Trojan malware detected on development workstation during routine scan",
        severity: IncidentSeverity.CRITICAL,
        status: IncidentStatus.INVESTIGATING,
        type: IncidentType.MALWARE,
        site: sites[1],
        assignee: users[2],
        affected_systems: ["dev-workstation-05"],
        tags: ["malware", "trojan", "endpoint"],
        ai_summary:
          "Critical malware requiring immediate quarantine and forensic analysis.",
      },
      {
        incident_id: "INC-" + Date.now() + "-003",
        title: "Data Exfiltration Attempt",
        description:
          "Unusual outbound data transfer detected from database server",
        severity: IncidentSeverity.CRITICAL,
        status: IncidentStatus.RESOLVED,
        type: IncidentType.DATA_BREACH,
        site: sites[0],
        assignee: users[2],
        affected_systems: ["prod-db-01"],
        tags: ["data-leak", "exfiltration"],
        source_ip: "192.168.1.11",
        destination_ip: "203.0.113.45",
      },
      {
        incident_id: "INC-" + Date.now() + "-004",
        title: "DDoS Attack in Progress",
        description: "High volume of requests overwhelming web server",
        severity: IncidentSeverity.HIGH,
        status: IncidentStatus.OPEN,
        type: IncidentType.DDOS,
        site: sites[3],
        affected_systems: ["portal-web-01", "portal-lb-01"],
        tags: ["ddos", "availability"],
        ai_summary:
          "Coordinated DDoS attack from multiple sources. Recommend enabling WAF rules.",
      },
      {
        incident_id: "INC-" + Date.now() + "-005",
        title: "Unauthorized Configuration Change",
        description: "Firewall rules modified without proper authorization",
        severity: IncidentSeverity.MEDIUM,
        status: IncidentStatus.INVESTIGATING,
        type: IncidentType.POLICY_VIOLATION,
        site: sites[2],
        assignee: users[1],
        affected_systems: ["staging-firewall-01"],
        tags: ["configuration", "unauthorized"],
      },
    ];

    const incidents = this.incidentRepository.create(incidentsData);
    return await this.incidentRepository.save(incidents);
  }

  private async seedThreats(sites: Site[]): Promise<ThreatIndicator[]> {
    this.logger.log("Seeding threat indicators...");

    const threatsData = [
      {
        indicator: "185.220.101.45",
        type: ThreatType.IP,
        severity: ThreatSeverity.HIGH,
        confidence: 95,
        status: ThreatStatus.ACTIVE,
        description: "Known malicious IP associated with brute force attacks",
        country: "Russia",
        country_code: "RU",
        country_flag: "🇷🇺",
        tags: ["brute-force", "ssh", "malicious"],
        malware_family: "Mirai",
        site: sites[0],
      },
      {
        indicator: "malware-download.xyz",
        type: ThreatType.DOMAIN,
        severity: ThreatSeverity.CRITICAL,
        confidence: 98,
        status: ThreatStatus.ACTIVE,
        description: "Domain hosting malware payloads",
        tags: ["malware", "c2", "trojan"],
        malware_family: "Emotet",
        site: sites[1],
      },
      {
        indicator: "http://phishing-site.com/login",
        type: ThreatType.URL,
        severity: ThreatSeverity.HIGH,
        confidence: 90,
        status: ThreatStatus.MONITORING,
        description: "Phishing page mimicking company login portal",
        tags: ["phishing", "credential-theft"],
        site: sites[3],
      },
      {
        indicator: "a1b2c3d4e5f6789012345678901234567890abcd",
        type: ThreatType.HASH,
        severity: ThreatSeverity.CRITICAL,
        confidence: 100,
        status: ThreatStatus.BLOCKED,
        description: "Known ransomware file hash",
        tags: ["ransomware", "malware"],
        malware_family: "Ryuk",
        site: sites[0],
      },
      {
        indicator: "203.0.113.45",
        type: ThreatType.IP,
        severity: ThreatSeverity.MEDIUM,
        confidence: 75,
        status: ThreatStatus.MONITORING,
        description: "Suspicious IP with multiple failed connection attempts",
        country: "China",
        country_code: "CN",
        country_flag: "🇨🇳",
        tags: ["scanning", "reconnaissance"],
        site: sites[2],
      },
    ];

    const threats = this.threatRepository.create(threatsData);
    return await this.threatRepository.save(threats);
  }

  private async seedVulnerabilities(): Promise<Vulnerability[]> {
    this.logger.log("Seeding vulnerabilities...");

    const vulnerabilitiesData = [
      {
        cve_id: "CVE-2023-12345",
        title: "Remote Code Execution in Apache Log4j",
        description:
          "Critical vulnerability allowing remote code execution through JNDI lookup",
        severity: VulnerabilitySeverity.CRITICAL,
        cvss_score: "10.0",
        published_date: new Date("2023-12-01").getTime(),
        remediation_info: "Upgrade to Log4j 2.15.0 or later",
      },
      {
        cve_id: "CVE-2023-23456",
        title: "SQL Injection in MySQL",
        description: "SQL injection vulnerability in MySQL server",
        severity: VulnerabilitySeverity.HIGH,
        cvss_score: "8.5",
        published_date: new Date("2023-11-15").getTime(),
        remediation_info: "Apply MySQL security patch 8.0.31",
      },
      {
        cve_id: "CVE-2023-34567",
        title: "Cross-Site Scripting in React",
        description: "XSS vulnerability in React component rendering",
        severity: VulnerabilitySeverity.MEDIUM,
        cvss_score: "6.5",
        published_date: new Date("2023-10-20").getTime(),
        remediation_info: "Update to React 17.0.3 or later",
      },
      {
        cve_id: "CVE-2023-45678",
        title: "Buffer Overflow in OpenSSL",
        description: "Buffer overflow vulnerability in SSL/TLS implementation",
        severity: VulnerabilitySeverity.HIGH,
        cvss_score: "8.0",
        published_date: new Date("2023-09-10").getTime(),
        remediation_info: "Upgrade OpenSSL to version 1.1.1x",
      },
    ];

    const vulnerabilities =
      this.vulnerabilityRepository.create(vulnerabilitiesData);
    return await this.vulnerabilityRepository.save(vulnerabilities);
  }

  private async seedSiteVulnerabilities(
    sites: Site[],
    vulnerabilities: Vulnerability[]
  ): Promise<SiteVulnerability[]> {
    this.logger.log("Seeding site vulnerabilities...");

    const siteVulnerabilitiesData = [
      {
        site: sites[0],
        vulnerability: vulnerabilities[0],
        status: VulnerabilityStatus.IDENTIFIED,
        detected_at: Date.now() - 86400000 * 2,
        context: "Detected in prod-app-server-01, prod-app-server-02",
      },
      {
        site: sites[0],
        vulnerability: vulnerabilities[1],
        status: VulnerabilityStatus.IN_PROGRESS,
        detected_at: Date.now() - 86400000 * 5,
        context: "Affected system: prod-db-01",
      },
      {
        site: sites[1],
        vulnerability: vulnerabilities[2],
        status: VulnerabilityStatus.PATCHED,
        detected_at: Date.now() - 86400000 * 10,
        resolved_at: Date.now() - 86400000 * 3,
        context: "Fixed in dev-web-01",
      },
      {
        site: sites[2],
        vulnerability: vulnerabilities[3],
        status: VulnerabilityStatus.IDENTIFIED,
        detected_at: Date.now() - 86400000 * 1,
        context: "Found in staging-web-01, staging-api-01",
      },
    ];

    const siteVulnerabilities = this.siteVulnerabilityRepository.create(
      siteVulnerabilitiesData
    );
    return await this.siteVulnerabilityRepository.save(siteVulnerabilities);
  }

  private async seedRemediationActions(
    incidents: Incident[],
    threats: ThreatIndicator[],
    siteVulnerabilities: SiteVulnerability[],
    sites: Site[]
  ): Promise<RemediationAction[]> {
    this.logger.log("Seeding remediation actions...");

    const remediationActionsData = [
      {
        site: sites[0],
        action_type: "block",
        description: "Add IP to firewall blocklist",
        executed_at: Date.now(),
        status: RemediationStatus.COMPLETED,
        priority: RemediationPriority.CRITICAL,
        remediation_type: RemediationType.AUTOMATED,
        incident: incidents[0],
        threatIndicator: threats[0],
        assigned_to: "security-team",
        completed_at: Date.now(),
        progress_percentage: 100,
        effectiveness_score: 95,
        cost_estimate: 0,
      },
      {
        site: sites[0],
        action_type: "patch",
        description: "Update all affected systems to latest Log4j version",
        executed_at: Date.now(),
        status: RemediationStatus.IN_PROGRESS,
        priority: RemediationPriority.CRITICAL,
        remediation_type: RemediationType.SEMI_AUTOMATED,
        incident: incidents[1],
        siteVulnerability: siteVulnerabilities[0],
        assigned_to: "devops-team",
        progress_percentage: 60,
        cost_estimate: 500.0,
      },
      {
        site: sites[1],
        action_type: "isolate",
        description: "Disconnect workstation from network for malware analysis",
        executed_at: Date.now() - 3600000,
        status: RemediationStatus.COMPLETED,
        priority: RemediationPriority.HIGH,
        remediation_type: RemediationType.MANUAL,
        incident: incidents[1],
        assigned_to: "security-analyst",
        completed_at: Date.now() - 3600000,
        progress_percentage: 100,
        effectiveness_score: 100,
      },
      {
        site: sites[2],
        action_type: "configure",
        description:
          "Audit and revert unauthorized firewall rule modifications",
        executed_at: Date.now(),
        status: RemediationStatus.PENDING,
        priority: RemediationPriority.MEDIUM,
        remediation_type: RemediationType.MANUAL,
        incident: incidents[4],
        assigned_to: "network-team",
        progress_percentage: 0,
        cost_estimate: 100.0,
      },
      {
        site: sites[3],
        action_type: "monitor",
        description: "Activate advanced DDoS mitigation rules",
        executed_at: Date.now(),
        status: RemediationStatus.IN_PROGRESS,
        priority: RemediationPriority.HIGH,
        remediation_type: RemediationType.AUTOMATED,
        incident: incidents[3],
        assigned_to: "security-team",
        progress_percentage: 30,
        cost_estimate: 200.0,
      },
    ];

    const remediationActions = this.remediationRepository.create(
      remediationActionsData
    );
    return await this.remediationRepository.save(remediationActions);
  }

  private async seedSecurityMetrics(sites: Site[]): Promise<void> {
    this.logger.log("Seeding security metrics...");

    const now = Date.now();
    const metricsData = [];

    // Generate metrics for the last 7 days for each site
    for (const site of sites.slice(0, 2)) {
      for (let i = 6; i >= 0; i--) {
        const recordedAt = now - i * 24 * 60 * 60 * 1000;

        metricsData.push({
          metric_name: "Daily Incident Count",
          metric_value: Math.floor(Math.random() * 10) + 1,
          metric_type: MetricType.INCIDENT_COUNT,
          category: MetricCategory.SECURITY,
          recorded_at: recordedAt,
          site: site,
          threshold_high: 15,
          current_alert_level: AlertThreshold.LOW,
          is_active: true,
        });

        metricsData.push({
          metric_name: "Threat Detection Count",
          metric_value: Math.floor(Math.random() * 20) + 5,
          metric_type: MetricType.THREAT_COUNT,
          category: MetricCategory.SECURITY,
          recorded_at: recordedAt,
          site: site,
          threshold_high: 50,
          current_alert_level:
            i < 2 ? AlertThreshold.MEDIUM : AlertThreshold.LOW,
          is_active: true,
        });

        metricsData.push({
          metric_name: "Overall Security Score",
          metric_value: Math.floor(Math.random() * 30) + 60,
          metric_type: MetricType.SECURITY_SCORE,
          category: MetricCategory.SECURITY,
          recorded_at: recordedAt,
          site: site,
          threshold_critical: 40,
          threshold_high: 60,
          threshold_medium: 80,
          current_alert_level: AlertThreshold.LOW,
          is_active: true,
        });
      }
    }

    const metrics = this.securityMetricRepository.create(metricsData);
    await this.securityMetricRepository.save(metrics);
  }

  private async seedNotifications(
    users: User[],
    sites: Site[],
    incidents: Incident[],
    threats: ThreatIndicator[]
  ): Promise<void> {
    this.logger.log("Seeding notifications...");

    const notificationsData = [
      {
        user: users[1],
        notification_type: NotificationType.ALERT,
        title: "Critical Incident Detected",
        message:
          "A critical security incident has been detected on Production Environment",
        priority: NotificationPriority.CRITICAL,
        is_read: false,
        site: sites[0],
        incident: incidents[1],
        channel: NotificationChannel.EMAIL,
      },
      {
        user: users[2],
        notification_type: NotificationType.ALERT,
        title: "Incident Assigned to You",
        message:
          "You have been assigned to investigate: Suspicious Login Attempts Detected",
        priority: NotificationPriority.HIGH,
        is_read: false,
        site: sites[0],
        incident: incidents[0],
        channel: NotificationChannel.IN_APP,
      },
      {
        user: users[0],
        notification_type: NotificationType.SECURITY,
        title: "New Threat Indicator Detected",
        message: "A new high-severity threat indicator has been identified",
        priority: NotificationPriority.HIGH,
        is_read: true,
        site: sites[0],
        threatIndicator: threats[0],
        channel: NotificationChannel.EMAIL,
      },
      {
        user: users[1],
        notification_type: NotificationType.SECURITY,
        title: "Critical Vulnerability Discovered",
        message: "CVE-2023-12345 affects your production systems",
        priority: NotificationPriority.CRITICAL,
        is_read: false,
        site: sites[0],
        channel: NotificationChannel.EMAIL,
      },
      {
        user: users[3],
        notification_type: NotificationType.SYSTEM,
        title: "Security Metric Threshold Exceeded",
        message: "Threat detection rate has exceeded the warning threshold",
        priority: NotificationPriority.MEDIUM,
        is_read: true,
        site: sites[1],
        channel: NotificationChannel.IN_APP,
      },
    ];

    const notifications = this.notificationRepository.create(notificationsData);
    await this.notificationRepository.save(notifications);
  }
}
