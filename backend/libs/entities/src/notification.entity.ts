import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "../../shared/src/base.entity";
import { User } from "./user.entity";
import { Incident } from "./incident.entity";
import { Site } from "./site.entity";
import { ThreatIndicator } from "./threat-indicator.entity";
import { SecurityMetric } from "./security-metric.entity";
import {
  NotificationType,
  NotificationPriority,
  NotificationChannel,
} from "../../constant/src";

@Entity("notifications")
export class Notification extends BaseEntity {
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
  @JoinColumn()
  user: User;

  @ManyToOne(() => Incident, (incident) => incident.notifications, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  incident: Incident;

  @ManyToOne(() => Site, (site) => site.notifications, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  site: Site;

  @ManyToOne(() => ThreatIndicator, (threat) => threat.notifications, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  threatIndicator: ThreatIndicator;

  @ManyToOne(() => SecurityMetric, (metric) => metric.notifications, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  securityMetric: SecurityMetric;
}
