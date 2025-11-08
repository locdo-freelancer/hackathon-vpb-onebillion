import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IncidentsService } from "./incidents.service";
import { IncidentsController } from "./incidents.controller";
import { Incident, User, Site } from "@lib/entities";

@Module({
  imports: [TypeOrmModule.forFeature([Incident, User, Site])],
  controllers: [IncidentsController],
  providers: [IncidentsService],
  exports: [IncidentsService],
})
export class IncidentsModule {}
