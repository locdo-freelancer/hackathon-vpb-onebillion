import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SQSClient } from '@aws-sdk/client-sqs';
import { S3Client as S3ClientSDK } from '@aws-sdk/client-s3';
import { SecretsManagerClient as SecretsManagerClientSDK } from '@aws-sdk/client-secrets-manager';
import { EventBridgeClient as EventBridgeClientSDK } from '@aws-sdk/client-eventbridge';
import { LambdaClient as LambdaClientSDK } from '@aws-sdk/client-lambda';
// CloudWatch services - to be implemented when packages are available
// import { CloudWatchClient as CloudWatchClientSDK } from '@aws-sdk/client-cloudwatch';
// import { CloudWatchLogsClient as CloudWatchLogsClientSDK } from '@aws-sdk/client-cloudwatch-logs';

@Injectable()
export class AwsConfigService {
  private readonly region: string;
  private readonly accessKeyId: string;
  private readonly secretAccessKey: string;

  constructor(private configService: ConfigService) {
    this.region = this.configService.get<string>('AWS_REGION', 'ap-southeast-1');
    this.accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    this.secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
  }

  private getClientConfig() {
    const config: any = {
      region: this.region,
    };

    // Only add credentials if they are provided (for local development)
    if (this.accessKeyId && this.secretAccessKey) {
      config.credentials = {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey,
      };
    }
    // In production, ECS tasks will use IAM roles

    return config;
  }

  createSQSClient(): SQSClient {
    return new SQSClient(this.getClientConfig());
  }

  createS3Client(): S3ClientSDK {
    return new S3ClientSDK(this.getClientConfig());
  }

  createSecretsManagerClient(): SecretsManagerClientSDK {
    return new SecretsManagerClientSDK(this.getClientConfig());
  }

  createEventBridgeClient(): EventBridgeClientSDK {
    return new EventBridgeClientSDK(this.getClientConfig());
  }

  createLambdaClient(): LambdaClientSDK {
    return new LambdaClientSDK(this.getClientConfig());
  }

  // CloudWatch methods - to be implemented when packages are available
  // createCloudWatchClient(): CloudWatchClientSDK {
  //   return new CloudWatchClientSDK(this.getClientConfig());
  // }

  // createCloudWatchLogsClient(): CloudWatchLogsClientSDK {
  //   return new CloudWatchLogsClientSDK(this.getClientConfig());
  // }

  getRegion(): string {
    return this.region;
  }

  // Queue URLs
  getEventsQueueUrl(): string {
    return this.configService.get<string>('AWS_SQS_QUEUE_URL_EVENTS');
  }

  getNotificationsQueueUrl(): string {
    return this.configService.get<string>('AWS_SQS_QUEUE_URL_NOTIFICATIONS');
  }

  getEnrichmentQueueUrl(): string {
    return this.configService.get<string>('AWS_SQS_QUEUE_URL_ENRICHMENT');
  }

  // S3 Buckets
  getS3BucketName(): string {
    return this.configService.get<string>('AWS_S3_BUCKET_NAME');
  }

  getLogsBucket(): string {
    return this.configService.get<string>('AWS_S3_BUCKET_LOGS');
  }

  getAttachmentsBucket(): string {
    return this.configService.get<string>('AWS_S3_BUCKET_ATTACHMENTS');
  }

  // Lambda Functions
  getEnrichmentFunctionName(): string {
    return this.configService.get<string>('AWS_LAMBDA_ENRICHMENT_FUNCTION');
  }

  getAiTriageFunctionName(): string {
    return this.configService.get<string>('AWS_LAMBDA_AI_TRIAGE_FUNCTION');
  }

  getNotifierFunctionName(): string {
    return this.configService.get<string>('AWS_LAMBDA_NOTIFIER_FUNCTION');
  }

  // EventBridge
  getEventBusName(): string {
    return this.configService.get<string>('AWS_EVENTBRIDGE_BUS_NAME');
  }

  getEventBridgeSource(): string {
    return this.configService.get<string>('AWS_EVENTBRIDGE_SOURCE');
  }

  // Secrets Manager
  getSecretsRegion(): string {
    return this.configService.get<string>('AWS_SECRETS_REGION', this.region);
  }

  getVirusTotalSecretName(): string {
    return this.configService.get<string>('AWS_SECRET_VIRUSTOTAL_API');
  }

  getAbuseIPDBSecretName(): string {
    return this.configService.get<string>('AWS_SECRET_ABUSEIPDB_API');
  }

  getOpenAiSecretName(): string {
    return this.configService.get<string>('AWS_SECRET_OPENAI_API');
  }

  getSlackWebhookSecretName(): string {
    return this.configService.get<string>('AWS_SECRET_SLACK_WEBHOOK');
  }

  // CloudWatch
  getCloudWatchLogGroup(): string {
    return this.configService.get<string>('AWS_CLOUDWATCH_LOG_GROUP');
  }

  getCloudWatchNamespace(): string {
    return this.configService.get<string>('AWS_CLOUDWATCH_NAMESPACE');
  }
}