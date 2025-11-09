import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ThreatsService } from "./threats.service";
import { ThreatsController } from "./threats.controller";
import { ThreatIndicator, Site } from "../../../libs/entities";

@Module({
  imports: [TypeOrmModule.forFeature([ThreatIndicator, Site])],
  controllers: [ThreatsController],
  providers: [ThreatsService],
  exports: [ThreatsService],
})
export class ThreatsModule {}
