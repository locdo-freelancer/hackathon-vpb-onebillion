import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PassportModule } from "@nestjs/passport";
import { AgentCommService } from "./agent-comm.service";
import { AgentCommController } from "./agent-comm.controller";
import { Site, AgentEntity, ThreatIndicator, Incident, User } from "../../../libs/entities";
import { AgentBearerStrategy } from "./strategies/agent-bearer.strategy";
import { IncidentsModule } from "../incidents/incidents.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Site, AgentEntity, ThreatIndicator, Incident, User]),
    PassportModule,
    IncidentsModule, // Import để sử dụng AIService
import { Site, AgentEntity } from "../../../../../libs/entities";
import { AgentBearerStrategy } from "./strategies/agent-bearer.strategy";
import { AwsModule } from "../../aws/aws.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Site, AgentEntity]),
    PassportModule,
    AwsModule,
  ],
  controllers: [AgentCommController],
  providers: [AgentCommService, AgentBearerStrategy],
  exports: [AgentCommService],
})
export class AgentCommModule {}
