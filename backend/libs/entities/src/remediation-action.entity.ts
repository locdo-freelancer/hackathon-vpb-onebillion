import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "../../shared/src/base.entity";
import { Site } from "./site.entity";
import { Incident } from "./incident.entity";
import { ThreatIndicator } from "./threat-indicator.entity";
import { SiteVulnerability } from "./site-vulnerability.entity";
import {
  RemediationStatus,
  RemediationPriority,
  RemediationType,
} from "../../constant/src";

@Entity("remediation_actions")
export class RemediationAction extends BaseEntity {
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
  @JoinColumn()
  site: Site;

  @ManyToOne(() => Incident, (incident) => incident.remediationActions, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  incident: Incident;

  @ManyToOne(() => ThreatIndicator, (threat) => threat.remediationActions, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  threatIndicator: ThreatIndicator;

  @ManyToOne(
    () => SiteVulnerability,
    (vulnerability) => vulnerability.remediationActions,
    {
      onDelete: "CASCADE",
    }
  )
  @JoinColumn()
  siteVulnerability: SiteVulnerability;
}
