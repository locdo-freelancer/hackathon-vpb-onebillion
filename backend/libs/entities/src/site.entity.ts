import {
  Entity,
  Column,
  ManyToOne,
  OneToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { BaseEntity } from "libs/shared/src";
import { User } from "./user.entity";
import { RemediationAction } from "./remediation-action.entity";
import { SiteVulnerability } from "./site-vulnerability.entity";
import { Threat } from "./threat.entity";
import { AgentEntity } from "./agent.entity";
import { Incident } from "./incident.entity";

@Entity("sites")
export class Site extends BaseEntity {
  @Column({ type: "text" })
  user_id: string;

  @Column({ type: "text" })
  name: string;

  @Column({ type: "text", nullable: true })
  ip_address: string;

  @Column({ type: "text", nullable: true })
  domain_name: string;

  @Column({ type: "text", nullable: true })
  server_type: string;

  @Column({ type: "text", default: "Pending" })
  status: string;

  @Column({ type: "text", unique: true })
  entity_token: string;

  @ManyToOne(() => User, (user) => user.sites, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @OneToOne(() => AgentEntity, (agent) => agent.site)
  agent: AgentEntity;

  @OneToMany(() => SiteVulnerability, (sv) => sv.site)
  siteVulnerabilities: SiteVulnerability[];

  @OneToMany(() => Threat, (threat) => threat.site)
  threats: Threat[];

  @OneToMany(() => RemediationAction, (action) => action.site)
  remediationActions: RemediationAction[];

  @OneToMany(() => Incident, (incident) => incident.site)
  incidents: Incident[];
}
