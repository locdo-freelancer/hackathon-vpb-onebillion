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
      useFactory: async (configService: ConfigService) => {
        const dbHost = configService.get<string>("DB_HOST");
        const isProduction = dbHost?.includes("aivencloud.com");

        return {
          type: "postgres",
          host: dbHost,
          port: configService.get<number>("DB_PORT", 5432),
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
          // Connection pool settings
          extra: {
            max: configService.get<number>("DB_POOL_MAX", 20),
            min: configService.get<number>("DB_POOL_MIN", 5),
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 10000,
          },
          // Only use SSL for production (Aiven), not for localhost
          ssl: isProduction ? {
            rejectUnauthorized: false,
          } : false,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
