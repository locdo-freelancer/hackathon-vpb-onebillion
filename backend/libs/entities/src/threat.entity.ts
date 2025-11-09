import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "../../shared/src/base.entity";
import { Site } from "./site.entity";
import { ThreatType, ThreatSeverity, ThreatStatus } from "../../constant/src";

@Entity("threats")
export class Threat extends BaseEntity {
  @Column({ type: "text" })
  site_id: string;

  @Column({
    type: "enum",
    enum: ThreatType,
  })
  threat_type: ThreatType;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({
    type: "enum",
    enum: ThreatSeverity,
    default: ThreatSeverity.MEDIUM,
  })
  severity: ThreatSeverity;

  @Column({
    type: "bigint",
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseInt(value, 10),
    },
  })
  detected_at: number;

  @Column({
    type: "enum",
    enum: ThreatStatus,
    default: ThreatStatus.ACTIVE,
  })
  status: ThreatStatus;

  @ManyToOne(() => Site, (site) => site.threats, { onDelete: "CASCADE" })
  @JoinColumn({ name: "site_id" })
  site: Site;
}
