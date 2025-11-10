import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PassportModule } from "@nestjs/passport";
import { AgentCommService } from "./agent-comm.service";
import { AgentCommController } from "./agent-comm.controller";
import { Site, AgentEntity, ThreatIndicator } from "../../../libs/entities";
import { AgentBearerStrategy } from "./strategies/agent-bearer.strategy";

@Module({
  imports: [
    TypeOrmModule.forFeature([Site, AgentEntity, ThreatIndicator]),
    PassportModule,
  ],
  controllers: [AgentCommController],
  providers: [AgentCommService, AgentBearerStrategy],
  exports: [AgentCommService],
})
export class AgentCommModule {}
