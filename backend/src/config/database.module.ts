import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AgentEntity } from "libs/entities/src/agent.entity";
import { RemediationAction } from "libs/entities/src/remediation-action.entity";
import { SecurityMetric } from "libs/entities/src/security-metric.entity";
import { SiteVulnerability } from "libs/entities/src/site-vulnerability.entity";
import { Site } from "libs/entities/src/site.entity";
import { Threat } from "libs/entities/src/threat.entity";
import { User } from "libs/entities/src/user.entity";
import { Vulnerability } from "libs/entities/src/vulnerability.entity";
import { Notification } from "libs/entities";

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
        ],
        synchronize: true,
        logging: configService.get<string>("NODE_ENV") === "development",
        ssl: {
          rejectUnauthorized: false,
        },
      }),
    }),
  ],
})
export class DatabaseModule {}
