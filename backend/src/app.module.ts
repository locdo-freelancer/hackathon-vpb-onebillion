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
import { DownloadsModule } from "./modules/downloads/downloads.module";
import { TasksModule } from "./modules/tasks/tasks.module";
import { IncidentsModule } from "./modules/incidents/incidents.module";
import { ThreatsModule } from "./modules/threats/threats.module";
import { VulnerabilitiesModule } from "./modules/vulnerabilities/vulnerabilities.module";
import { RemediationActionsModule } from "./modules/remediation-actions/remediation-actions.module";
import { SecurityMetricsModule } from "./modules/security-metrics/security-metrics.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { APP_PROVIDERS } from "./app.provider";
import { LoggingMiddleware } from "../libs/middlewares/src";

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
    DownloadsModule,
    TasksModule,
    IncidentsModule,
    ThreatsModule,
    VulnerabilitiesModule,
    RemediationActionsModule,
    SecurityMetricsModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService, ...APP_PROVIDERS],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes("*");
  }
}
