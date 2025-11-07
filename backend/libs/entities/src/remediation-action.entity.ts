import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "libs/shared/src";
import { Site } from "./site.entity";

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

  @Column({ type: "text", default: "Pending" })
  status: string;

  @Column({ type: "text", nullable: true })
  result: string;

  @ManyToOne(() => Site, (site) => site.remediationActions, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "site_id" })
  site: Site;
}
