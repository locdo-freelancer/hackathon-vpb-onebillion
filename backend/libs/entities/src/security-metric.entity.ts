import { Entity, Column } from "typeorm";
import { BaseEntity } from "libs/shared/src";

@Entity("security_metrics")
export class SecurityMetric extends BaseEntity {
  @Column({ type: "text" })
  site_id: string;

  @Column({ type: "text" })
  metric_name: string;

  @Column({ type: "text" })
  metric_value: string;

  @Column({
    type: "bigint",
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseInt(value, 10),
    },
  })
  recorded_at: number;
}
