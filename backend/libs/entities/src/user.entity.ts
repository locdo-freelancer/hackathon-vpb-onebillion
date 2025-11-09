import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "../../shared/src";
import { Notification, Site } from "..";

@Entity("users")
export class User extends BaseEntity {
  @Column({ type: "text", unique: true })
  email: string;

  @Column({ type: "text" })
  password_hash: string;

  @Column({ type: "text" })
  full_name: string;

  @Column({ type: "text", nullable: true })
  company_name: string;

  @Column({
    type: "bigint",
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseInt(value, 10),
    },
  })
  last_login: number;

  @OneToMany(() => Site, (site) => site.user)
  sites: Site[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];
}
