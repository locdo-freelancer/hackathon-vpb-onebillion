import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "../../shared/src";
import { Site } from "./site.entity";

@Entity("threats")
export class Threat extends BaseEntity {
  @Column({ type: "text" })
  site_id: string;

  @Column({ type: "text" })
  threat_type: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "text", nullable: true })
  severity: string;

  @Column({
    type: "bigint",
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseInt(value, 10),
    },
  })
  detected_at: number;

  @Column({ type: "text", default: "Active" })
  status: string;

  @ManyToOne(() => Site, (site) => site.threats, { onDelete: "CASCADE" })
  @JoinColumn({ name: "site_id" })
  site: Site;
}
