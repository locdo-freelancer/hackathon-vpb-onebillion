import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "libs/shared/src";
import { Site } from "./site.entity";
import { Incident } from "./incident.entity";
import { ThreatIndicator } from "./threat-indicator.entity";
import { SiteVulnerability } from "./site-vulnerability.entity";

export enum RemediationStatus {
  PENDING = "Pending",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
  FAILED = "Failed",
  CANCELLED = "Cancelled",
}

export enum RemediationPriority {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
  CRITICAL = "Critical",
}

export enum RemediationType {
  MANUAL = "Manual",
  AUTOMATED = "Automated",
  SEMI_AUTOMATED = "Semi-Automated",
}

@Entity("remediation_actions")
export class RemediationAction extends BaseEntity {
  @Column({ type: "text" })
  site_id: string;

  @Column({ type: "text" })
  action_type: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({
    type: "bigint",
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseInt(value, 10),
    },
  })
  executed_at: number;

  @Column({
    type: "enum",
    enum: RemediationStatus,
    default: RemediationStatus.PENDING,
  })
  status: RemediationStatus;

  @Column({ type: "text", nullable: true })
  result: string;

  @Column({ type: "text", nullable: true })
  incident_id: string;

  @Column({ type: "text", nullable: true })
  threat_indicator_id: string;

  @Column({ type: "text", nullable: true })
  site_vulnerability_id: string;

  @Column({
    type: "enum",
    enum: RemediationPriority,
    default: RemediationPriority.MEDIUM,
  })
  priority: RemediationPriority;

  @Column({
    type: "enum",
    enum: RemediationType,
    default: RemediationType.MANUAL,
  })
  remediation_type: RemediationType;

  @Column({ type: "text", nullable: true })
  assigned_to: string;

  @Column({
    type: "bigint",
    nullable: true,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseInt(value, 10),
    },
  })
  due_date: number;

  @Column({
    type: "bigint",
    nullable: true,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseInt(value, 10),
    },
  })
  completed_at: number;

  @Column({ type: "int", default: 0 })
  progress_percentage: number;

  @Column({ type: "decimal", precision: 5, scale: 2, default: 0.0 })
  cost_estimate: number;

  @Column({ type: "decimal", precision: 5, scale: 2, default: 0.0 })
  actual_cost: number;

  @Column({ type: "int", default: 0 })
  effectiveness_score: number;

  @Column({ type: "text", nullable: true })
  notes: string;

  @Column({ type: "json", nullable: true })
  metadata: Record<string, any>;

  @ManyToOne(() => Site, (site) => site.remediationActions, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "site_id" })
  site: Site;

  @ManyToOne(() => Incident, (incident) => incident.remediationActions, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "incident_id" })
  incident: Incident;

  @ManyToOne(() => ThreatIndicator, (threat) => threat.remediationActions, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "threat_indicator_id" })
  threatIndicator: ThreatIndicator;

  @ManyToOne(
    () => SiteVulnerability,
    (vulnerability) => vulnerability.remediationActions,
    {
      onDelete: "CASCADE",
    }
  )
  @JoinColumn({ name: "site_vulnerability_id" })
  siteVulnerability: SiteVulnerability;
}
