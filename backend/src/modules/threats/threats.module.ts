import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ThreatsService } from "./threats.service";
import { ThreatsController } from "./threats.controller";
import { ThreatIndicator, Site } from "../../../libs/entities";
import { IncidentsModule } from "../incidents/incidents.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([ThreatIndicator, Site]),
    forwardRef(() => IncidentsModule),
  ],
  controllers: [ThreatsController],
  providers: [ThreatsService],
  exports: [ThreatsService],
})
export class ThreatsModule {}
