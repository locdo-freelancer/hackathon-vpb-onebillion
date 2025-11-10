import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseModule } from "./config/database.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { SitesModule } from "./modules/sites/sites.module";
import { AgentsModule } from "./modules/agents/agents.module";
import { AgentCommModule } from "./modules/agent-comm/agent-comm.module";
import { AgentInstallModule } from "./modules/agent-install/agent-install.module";
import { OnboardingModule } from "./modules/onboarding/onboarding.module";
import { TasksModule } from "./modules/tasks/tasks.module";
import { IncidentsModule } from "./modules/incidents/incidents.module";
import { ThreatsModule } from "./modules/threats/threats.module";
import { VulnerabilitiesModule } from "./modules/vulnerabilities/vulnerabilities.module";
import { RemediationActionsModule } from "./modules/remediation-actions/remediation-actions.module";
import { SecurityMetricsModule } from "./modules/security-metrics/security-metrics.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { AwsModule } from "./aws/aws.module";
// import { AiServiceModule } from "../../ai-cron/src/ai-service.module";
import { APP_PROVIDERS } from "./app.provider";
import { LoggingMiddleware } from "../../../libs/middlewares/src";
import { RedisModule } from "./modules/redis/redis.module";
import { DatabaseSeederModule } from "./modules/database-seeder/database-seeder.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    DatabaseModule,
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    SitesModule,
    AgentsModule,
    AgentCommModule,
    AgentInstallModule,
    OnboardingModule,
    TasksModule,
    IncidentsModule,
    ThreatsModule,
    VulnerabilitiesModule,
    RemediationActionsModule,
    SecurityMetricsModule,
    NotificationsModule,
    AwsModule,
    RedisModule,
    DatabaseSeederModule,
    // AiServiceModule,
  ],
  controllers: [AppController],
  providers: [AppService, ...APP_PROVIDERS],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes("*");
  }
}
