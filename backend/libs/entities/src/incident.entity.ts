import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { BaseEntity } from "../../shared/src/base.entity";
import { Site } from "./site.entity";
import { User } from "./user.entity";
import { RemediationAction } from "./remediation-action.entity";
import { Notification } from "./notification.entity";
import {
  IncidentSeverity,
  IncidentStatus,
  IncidentType,
} from "../../constant/src";

@Entity("incidents")
export class Incident extends BaseEntity {
  @Column({ type: "text", unique: true })
  incident_id: string;

  @Column({ type: "text" })
  title: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "text", nullable: true })
  ai_summary: string;

  @Column({
    type: "enum",
    enum: IncidentSeverity,
    default: IncidentSeverity.MEDIUM,
  })
  severity: IncidentSeverity;

  @Column({
    type: "enum",
    enum: IncidentStatus,
    default: IncidentStatus.OPEN,
  })
  status: IncidentStatus;

  @Column({
    type: "enum",
    enum: IncidentType,
  })
  type: IncidentType;

  @Column({ type: "simple-array", nullable: true })
  affected_systems: string[];

  @Column({ type: "simple-array", nullable: true })
  tags: string[];

  @Column({ type: "text", nullable: true })
  source_ip: string;

  @Column({ type: "text", nullable: true })
  destination_ip: string;

  @Column({ type: "text", nullable: true })
  protocol: string;

  @Column({ type: "json", nullable: true })
  mitre_attack: object[];

  @Column({ type: "json", nullable: true })
  timeline: object[];

  @Column({ type: "simple-array", nullable: true })
  raw_logs: string[];

  @Column({ type: "json", nullable: true })
  ai_recommendations: object[];

  @Column({ type: "json", nullable: true })
  file_hash: object;

  @Column({ type: "json", nullable: true })
  ip_reputation: object;

  @Column({ type: "json", nullable: true })
  related_incidents: object[];

  @Column({ type: "json", nullable: true })
  external_references: object[];

  @Column({ type: "simple-array", nullable: true })
  related_indicators: string[];

  @Column({ type: "simple-array", nullable: true })
  recommendations: string[];

  @Column({ type: "json", nullable: true })
  evidence: object[];

  @ManyToOne(() => Site, (site) => site.incidents, { onDelete: "CASCADE" })
  @JoinColumn()
  site: Site;

  @ManyToOne(() => User, { onDelete: "SET NULL" })
  @JoinColumn()
  assignee: User;

  @OneToMany(() => RemediationAction, (action) => action.incident)
  remediationActions: RemediationAction[];

  @OneToMany(() => Notification, (notification) => notification.incident)
  notifications: Notification[];
}
