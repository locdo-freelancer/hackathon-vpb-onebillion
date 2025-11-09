import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AgentsController } from "./agents.controller";
import { AgentsService } from "./agents.service";
import { AgentEntity, Site } from "../../../libs/entities";

@Module({
  imports: [TypeOrmModule.forFeature([AgentEntity, Site])],
  controllers: [AgentsController],
  providers: [AgentsService],
  exports: [AgentsService],
})
export class AgentsModule {}
