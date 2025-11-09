import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AgentInstallController } from "./agent-install.controller";
import { AgentInstallService } from "./agent-install.service";
import { AgentEntity, Site } from "../../../libs/entities";

@Module({
  imports: [TypeOrmModule.forFeature([AgentEntity, Site])],
  controllers: [AgentInstallController],
  providers: [AgentInstallService],
  exports: [AgentInstallService],
})
export class AgentInstallModule {}
