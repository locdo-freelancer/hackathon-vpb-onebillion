import {
  Entity,
  Column,
  ManyToOne,
  OneToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { BaseEntity } from "../../shared/src/base.entity";
import { User } from "./user.entity";
import { RemediationAction } from "./remediation-action.entity";
import { SiteVulnerability } from "./site-vulnerability.entity";
import { Threat } from "./threat.entity";
import { AgentEntity } from "./agent.entity";
import { Incident } from "./incident.entity";
import { SecurityMetric } from "./security-metric.entity";
import { Notification } from "./notification.entity";
import { SiteStatus } from "../../constant/src";

@Entity("sites")
export class Site extends BaseEntity {
  @Column({ type: "text" })
  name: string;

  @Column({ type: "text", nullable: true })
  ip_address: string;

  @Column({ type: "text", nullable: true })
  domain_name: string;

  @Column({ type: "text", nullable: true })
  server_type: string;

  @Column({
    type: "enum",
    enum: SiteStatus,
    default: SiteStatus.PENDING,
  })
  status: SiteStatus;

  @Column({ type: "text", unique: true })
  entity_token: string;

  @ManyToOne(() => User, (user) => user.sites, { onDelete: "CASCADE" })
  @JoinColumn()
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

  @OneToMany(() => SecurityMetric, (metric) => metric.site)
  securityMetrics: SecurityMetric[];

  @OneToMany(() => Notification, (notification) => notification.site)
  notifications: Notification[];
}
