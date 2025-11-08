import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { BaseEntity } from "libs/shared/src";
import { Site } from "./site.entity";
import { Notification } from "./notification.entity";

export enum MetricType {
  ATTACK_COUNT = "attack_count",
  VULNERABILITY_COUNT = "vulnerability_count",
  THREAT_LEVEL = "threat_level",
  SECURITY_SCORE = "security_score",
  INCIDENT_COUNT = "incident_count",
  REMEDIATION_RATE = "remediation_rate",
  UPTIME = "uptime",
  DOWNTIME = "downtime",
  RESPONSE_TIME = "response_time",
  COMPLIANCE_SCORE = "compliance_score",
}

export enum MetricCategory {
  SECURITY = "security",
  PERFORMANCE = "performance",
  COMPLIANCE = "compliance",
  OPERATIONAL = "operational",
}

export enum AlertThreshold {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

@Entity("security_metrics")
export class SecurityMetric extends BaseEntity {
  @Column({ type: "text" })
  site_id: string;

  @Column({ type: "text" })
  metric_name: string;

  @Column({
    type: "enum",
    enum: MetricType,
    default: MetricType.SECURITY_SCORE,
  })
  metric_type: MetricType;

  @Column({
    type: "enum",
    enum: MetricCategory,
    default: MetricCategory.SECURITY,
  })
  category: MetricCategory;

  @Column({ type: "decimal", precision: 15, scale: 6 })
  metric_value: number;

  @Column({ type: "text", nullable: true })
  unit: string;

  @Column({
    type: "bigint",
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseInt(value, 10),
    },
  })
  recorded_at: number;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "decimal", precision: 15, scale: 6, nullable: true })
  threshold_low: number;

  @Column({ type: "decimal", precision: 15, scale: 6, nullable: true })
  threshold_medium: number;

  @Column({ type: "decimal", precision: 15, scale: 6, nullable: true })
  threshold_high: number;

  @Column({ type: "decimal", precision: 15, scale: 6, nullable: true })
  threshold_critical: number;

  @Column({
    type: "enum",
    enum: AlertThreshold,
    nullable: true,
  })
  current_alert_level: AlertThreshold;

  // Previous value for trend analysis
  @Column({ type: "decimal", precision: 15, scale: 6, nullable: true })
  previous_value: number;

  @Column({ type: "decimal", precision: 5, scale: 2, nullable: true })
  change_percentage: number;

  // Historical and aggregated data
  @Column({ type: "json", nullable: true })
  historical_data: Record<string, any>;

  @Column({ type: "json", nullable: true })
  metadata: Record<string, any>;

  @Column({ type: "boolean", default: true })
  is_active: boolean;

  @Column({ type: "text", nullable: true })
  source: string; // Data source identifier

  // Relationships
  @ManyToOne(() => Site, (site) => site.securityMetrics, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "site_id" })
  site: Site;

  @OneToMany(() => Notification, (notification) => notification.securityMetric)
  notifications: Notification[];
}
