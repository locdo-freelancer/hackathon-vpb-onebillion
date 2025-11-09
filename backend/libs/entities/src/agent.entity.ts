import { Entity, Column, OneToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "../../shared/src";
import { Site } from "./site.entity";

@Entity("agents")
export class AgentEntity extends BaseEntity {
  @Column({ type: "text", unique: true })
  site_id: string;

  @Column({ type: "int", default: 0 })
  is_connected: number;

  @Column({
    type: "bigint",
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseInt(value, 10),
    },
    default: 0,
  })
  last_checkin: number;

  @Column({ type: "text", nullable: true })
  agent_version: string;

  @Column({ type: "text", nullable: true })
  os_info: string;

  @OneToOne(() => Site, (site) => site.agent, { onDelete: "CASCADE" })
  @JoinColumn({ name: "site_id" })
  site: Site;
}
