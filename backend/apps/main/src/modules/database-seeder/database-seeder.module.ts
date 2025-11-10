import { Module, Logger, OnModuleInit } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseSeederService } from "./database-seeder.service";
import { DatabaseSeederController } from "./database-seeder.controller";
import {
  User,
  Site,
  AgentEntity,
  Incident,
  ThreatIndicator,
  Vulnerability,
  SiteVulnerability,
  RemediationAction,
  SecurityMetric,
  Notification,
} from "@lib/entities";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Site,
      AgentEntity,
      Incident,
      ThreatIndicator,
      Vulnerability,
      SiteVulnerability,
      RemediationAction,
      SecurityMetric,
      Notification,
    ]),
  ],
  controllers: [DatabaseSeederController],
  providers: [DatabaseSeederService],
  exports: [DatabaseSeederService],
})
export class DatabaseSeederModule implements OnModuleInit {
  private readonly logger = new Logger(DatabaseSeederModule.name);

  onModuleInit() {
    this.logger.log("DatabaseSeederModule has been initialized");
    this.logger.log("DatabaseSeederController registered at /api/seeder");
  }
}
