import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "libs/shared/src";
import { User } from "./user.entity";
import { Incident } from "./incident.entity";
import { Site } from "./site.entity";
import { ThreatIndicator } from "./threat-indicator.entity";
import { SecurityMetric } from "./security-metric.entity";

export enum NotificationType {
  INCIDENT = "incident",
  THREAT = "threat",
  VULNERABILITY = "vulnerability",
  SECURITY_METRIC = "security_metric",
  REMEDIATION = "remediation",
  SYSTEM = "system",
  ALERT = "alert",
  WARNING = "warning",
  INFO = "info",
}

export enum NotificationPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

export enum NotificationChannel {
  EMAIL = "email",
  SMS = "sms",
  IN_APP = "in_app",
  WEBHOOK = "webhook",
  SLACK = "slack",
}

@Entity("notifications")
export class Notification extends BaseEntity {
  @Column({ type: "text" })
  user_id: string;

  @Column({
    type: "enum",
    enum: NotificationType,
    default: NotificationType.INFO,
  })
  notification_type: NotificationType;

  @Column({
    type: "enum",
    enum: NotificationPriority,
    default: NotificationPriority.MEDIUM,
  })
  priority: NotificationPriority;

  @Column({ type: "text" })
  title: string;

  @Column({ type: "text", nullable: true })
  message: string;

  @Column({ type: "boolean", default: false })
  is_read: boolean;

  @Column({
    type: "enum",
    enum: NotificationChannel,
    default: NotificationChannel.IN_APP,
  })
  channel: NotificationChannel;

  @Column({ type: "text", nullable: true })
  incident_id: string;

  @Column({ type: "text", nullable: true })
  site_id: string;

  @Column({ type: "text", nullable: true })
  threat_indicator_id: string;

  @Column({ type: "text", nullable: true })
  security_metric_id: string;

  @Column({ type: "text", nullable: true })
  action_url: string;

  @Column({ type: "text", nullable: true })
  action_text: string;

  @Column({
    type: "bigint",
    nullable: true,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseInt(value, 10),
    },
  })
  expires_at: number;

  @Column({
    type: "bigint",
    nullable: true,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseInt(value, 10),
    },
  })
  read_at: number;

  @Column({ type: "json", nullable: true })
  metadata: Record<string, any>;

  @Column({ type: "simple-array", nullable: true })
  tags: string[];

  // Relationships
  @ManyToOne(() => User, (user) => user.notifications, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Incident, (incident) => incident.notifications, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "incident_id" })
  incident: Incident;

  @ManyToOne(() => Site, (site) => site.notifications, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "site_id" })
  site: Site;

  @ManyToOne(() => ThreatIndicator, (threat) => threat.notifications, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "threat_indicator_id" })
  threatIndicator: ThreatIndicator;

  @ManyToOne(() => SecurityMetric, (metric) => metric.notifications, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "security_metric_id" })
  securityMetric: SecurityMetric;
}
