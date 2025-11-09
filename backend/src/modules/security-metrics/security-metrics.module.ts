import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SecurityMetric } from "../../../libs/entities/src/security-metric.entity";
import { SecurityMetricsService } from "./security-metrics.service";
import { SecurityMetricsController } from "./security-metrics.controller";

@Module({
  imports: [TypeOrmModule.forFeature([SecurityMetric])],
  controllers: [SecurityMetricsController],
  providers: [SecurityMetricsService],
  exports: [SecurityMetricsService],
})
export class SecurityMetricsModule {}
