import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "libs/shared/src";
import { User } from "./user.entity";
import { Incident } from "./incident.entity";

@Entity("notifications")
export class Notification extends BaseEntity {
  @Column({ type: "text" })
  user_id: string;

  @Column({ type: "text" })
  notification_type: string;

  @Column({ type: "text", nullable: true })
  message: string;

  @Column({ type: "int", default: 0 })
  is_read: number;

  @Column({ type: "text", nullable: true })
  incident_id: string;

  @ManyToOne(() => User, (user) => user.notifications, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Incident, (incident) => incident.notifications, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "incident_id" })
  incident: Incident;
}
