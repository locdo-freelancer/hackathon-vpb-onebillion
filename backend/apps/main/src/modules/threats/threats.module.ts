import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ThreatsService } from "./threats.service";
import { ThreatsController } from "./threats.controller";
import { ThreatIndicator, Site } from "@lib/entities";
import { AwsModule } from "../../aws/aws.module";
import { RedisModule } from "../redis/redis.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([ThreatIndicator, Site]),
    AwsModule,
    RedisModule,
  ],
  controllers: [ThreatsController],
  providers: [ThreatsService],
  exports: [ThreatsService],
})
export class ThreatsModule {}
