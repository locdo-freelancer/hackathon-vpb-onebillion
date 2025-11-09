/**
 * Services Index
 * Centralized export for all API services
 */

// Authentication & Authorization
export { AuthService } from "./auth.service";
export type { LoginCredentials, SignupCredentials, AuthResponse } from "@/types/auth.types";

// Onboarding
export { OnboardingService } from "./onboarding.service";
export type { SiteConfigData } from "@/types/onboarding.types";

// Sites Management
export { SitesService } from "./sites.service";
export type {
  Site,
  SiteStats,
  SitesResponse,
  CreateSiteDto,
  UpdateSiteDto,
} from "./sites.service";

// Agents Management
export { AgentsService } from "./agents.service";
export type {
  Agent,
  AgentStatus,
  OSType,
  AgentStats,
  AgentMetrics,
  AgentQueryParams,
} from "./agents.service";

// Agent Installation
export { AgentInstallService } from "./agent-install.service";
export type {
  Platform,
  InstallCommands,
  InstallStatus,
} from "./agent-install.service";

// Incidents Management
export { IncidentsService } from "./incidents.service";
export type {
  Incident,
  IncidentSeverity,
  IncidentStatus,
  IncidentType,
  Assignee,
  TimelineEvent,
  IncidentStats,
  IncidentsResponse,
  CreateIncidentDto,
  UpdateIncidentDto,
  BulkActionDto,
} from "./incidents.service";

// Threats Intelligence
export { ThreatsService } from "./threats.service";
export type {
  Threat,
  ThreatSeverity,
  ThreatType,
  ThreatStatus,
  ThreatStats,
  ThreatsResponse,
  CreateThreatDto,
  UpdateThreatDto,
  ThreatEnrichment,
} from "./threats.service";

// Vulnerabilities Management
export { VulnerabilitiesService } from "./vulnerabilities.service";
export type {
  Vulnerability,
  VulnerabilitySeverity,
  VulnerabilityStatus,
  SiteVulnerability,
  VulnerabilityStats,
  VulnerabilitiesResponse,
  CreateVulnerabilityDto,
  UpdateVulnerabilityDto,
  AssignVulnerabilityDto,
} from "./vulnerabilities.service";

// Remediation Actions
export { RemediationActionsService } from "./remediation-actions.service";
export type {
  RemediationAction,
  RemediationPriority,
  RemediationStatus,
  RemediationType,
  SourceType as RemediationSourceType,
  RemediationStats,
  RemediationActionsResponse,
  CreateRemediationActionDto,
  UpdateRemediationActionDto,
} from "./remediation-actions.service";

// Security Metrics
export { SecurityMetricsService } from "./security-metrics.service";
export type {
  SecurityMetric,
  MetricCategory,
  MetricType,
  AlertLevel,
  MetricStats,
  MetricsResponse,
  CreateMetricDto,
  UpdateMetricDto,
  AlertCount,
  HistoricalData,
} from "./security-metrics.service";

// Notifications
export { NotificationsService } from "./notifications.service";
export type {
  Notification,
  NotificationPriority,
  NotificationType,
  DeliveryChannel,
  SourceType as NotificationSourceType,
  NotificationStats,
  NotificationsResponse,
  CreateNotificationDto,
  UpdateNotificationDto,
} from "./notifications.service";

// Password Utilities
export { PasswordService } from "./password.service";

// Dashboard Aggregation
export { DashboardService } from "./dashboard.service";
export type {
  DashboardStats,
  DashboardOverview,
  RiskScoreData,
  SeverityDistribution,
  TrendData,
} from "./dashboard.service";
