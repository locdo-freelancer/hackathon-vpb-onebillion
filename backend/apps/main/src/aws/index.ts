// AWS Configuration
export { AwsConfigService } from "./config/aws-config.service";

// AWS Services
export { SqsService } from "./services/sqs.service";
export { S3Service } from "./services/s3.service";
export { EventBridgeService } from "./services/eventbridge.service";
export { LambdaService } from "./services/lambda.service";
export { WorkflowService } from "./services/workflow.service";
export { SecretsManagerService } from "./services/secrets-manager.service";

// AWS Module
export { AwsModule } from "./aws.module";

// Controllers
export { AwsWorkflowController } from "./controllers/aws-workflow.controller";

// Types and Interfaces
export type { QueueMessage, SQSEventMessage } from "./services/sqs.service";

export type { S3UploadOptions, S3Object } from "./services/s3.service";

export type {
  LambdaInvokeOptions,
  EnrichmentRequest,
  AITriageRequest,
  NotificationRequest,
} from "./services/lambda.service";

export type {
  LogIngestionWorkflow,
  IncidentCreationWorkflow,
  ThreatDetectionWorkflow,
} from "./services/workflow.service";
