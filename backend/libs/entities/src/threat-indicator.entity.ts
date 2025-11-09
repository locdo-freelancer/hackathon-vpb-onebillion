import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { BaseEntity } from "../../shared/src/base.entity";
import { Site } from "./site.entity";
import { RemediationAction } from "./remediation-action.entity";
import { Notification } from "./notification.entity";
import { ThreatSeverity, ThreatType, ThreatStatus } from "../../constant/src";

@Entity("threat_indicators")
export class ThreatIndicator extends BaseEntity {
  @Column({ type: "text", unique: true })
  indicator: string; // IP, domain, URL, hash value

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({
    type: "enum",
    enum: ThreatType,
  })
  type: ThreatType;

  @Column({
    type: "enum",
    enum: ThreatSeverity,
    default: ThreatSeverity.MEDIUM,
  })
  severity: ThreatSeverity;

  @Column({ type: "int", default: 50 })
  confidence: number; // 0-100

  @Column({ type: "text", nullable: true })
  country: string;

  @Column({ type: "text", nullable: true })
  country_code: string;

  @Column({ type: "text", nullable: true })
  country_flag: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  first_seen: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  last_seen: Date;

  @Column({
    type: "enum",
    enum: ThreatStatus,
    default: ThreatStatus.MONITORING,
  })
  status: ThreatStatus;

  @Column({ type: "text", nullable: true })
  icon: string;

  @Column({ type: "text", nullable: true })
  icon_color: string;

  @Column({ type: "text", nullable: true })
  isp: string;

  @Column({ type: "text", nullable: true })
  asn: string;

  @Column({ type: "text", nullable: true })
  organization: string;

  @Column({ type: "simple-array", nullable: true })
  tags: string[];

  @Column({ type: "text", nullable: true })
  malware_family: string;

  // Intelligence data
  @Column({ type: "json", nullable: true })
  intelligence: object[];

  @Column({ type: "simple-array", nullable: true })
  related_indicators: string[];

  // Optional site association
  @ManyToOne(() => Site, { onDelete: "SET NULL" })
  @JoinColumn()
  site: Site;

  @OneToMany(
    () => RemediationAction,
    (remediation) => remediation.threatIndicator
  )
  remediationActions: RemediationAction[];

  @OneToMany(() => Notification, (notification) => notification.threatIndicator)
  notifications: Notification[];
}
