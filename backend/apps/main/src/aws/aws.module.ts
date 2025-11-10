import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AwsConfigService } from "./config/aws-config.service";
import { SqsService } from "./services/sqs.service";
import { S3Service } from "./services/s3.service";
import { EventBridgeService } from "./services/eventbridge.service";
import { LambdaService } from "./services/lambda.service";
import { WorkflowService } from "./services/workflow.service";
import { SecretsManagerService } from "./services/secrets-manager.service";
import { ResilienceService } from "./services/resilience.service";
import { AwsWorkflowController } from "./controllers/aws-workflow.controller";
import { AwsHealthController } from "./controllers/aws-health.controller";

@Module({
  imports: [ConfigModule],
  controllers: [AwsWorkflowController, AwsHealthController],
  providers: [
    AwsConfigService,
    ResilienceService,
    SqsService,
    S3Service,
    EventBridgeService,
    LambdaService,
    WorkflowService,
    SecretsManagerService,
  ],
  exports: [
    AwsConfigService,
    ResilienceService,
    SqsService,
    S3Service,
    EventBridgeService,
    LambdaService,
    WorkflowService,
    SecretsManagerService,
  ],
})
export class AwsModule {}
