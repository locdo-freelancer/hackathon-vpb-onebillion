import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "libs/shared/src";
import { User } from "./user.entity";

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

  @ManyToOne(() => User, (user) => user.notifications, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;
}
