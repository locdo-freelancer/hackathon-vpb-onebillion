import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import {
  User,
  Site,
  AgentEntity,
  Vulnerability,
  SiteVulnerability,
  Threat,
  RemediationAction,
  SecurityMetric,
  Notification,
  Incident,
  ThreatIndicator,
} from "../../libs/entities";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get<string>("DB_HOST"),
        port: configService.get<number>("DB_PORT", 15819),
        username: configService.get<string>("DB_USERNAME"),
        password: configService.get<string>("DB_PASSWORD"),
        database: configService.get<string>("DB_NAME"),
        entities: [
          User,
          Site,
          AgentEntity,
          Vulnerability,
          SiteVulnerability,
          Threat,
          RemediationAction,
          SecurityMetric,
          Notification,
          Incident,
          ThreatIndicator,
        ],
        synchronize: false,
        logging: configService.get<string>("NODE_ENV") === "development",
        ssl: {
          rejectUnauthorized: false,
        },
      }),
    }),
  ],
})
export class DatabaseModule {}
