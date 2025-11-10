import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsConfigService {
  private readonly logger = new Logger(AwsConfigService.name);

  constructor(private readonly configService: ConfigService) {}

  get region(): string {
    return this.configService.get('AWS_REGION', 'ap-southeast-1');
  }

  get accessKeyId(): string {
    return this.configService.get('AWS_ACCESS_KEY_ID');
  }

  get secretAccessKey(): string {
    return this.configService.get('AWS_SECRET_ACCESS_KEY');
  }

  get credentials() {
    const accessKeyId = this.accessKeyId;
    const secretAccessKey = this.secretAccessKey;

    if (!accessKeyId || !secretAccessKey) {
      this.logger.warn('AWS credentials not found, using default credential chain');
      return undefined; // Use default AWS credential chain
    }

    return {
      accessKeyId,
      secretAccessKey,
    };
  }

  // SQS Configuration
  get sqsQueueUrls() {
    return {
      events: this.configService.get('AWS_SQS_QUEUE_URL_EVENTS'),
      notifications: this.configService.get('AWS_SQS_QUEUE_URL_NOTIFICATIONS'),
      enrichment: this.configService.get('AWS_SQS_QUEUE_URL_ENRICHMENT'),
    };
  }

  // S3 Configuration
  get s3Config() {
    return {
      logsBucket: this.configService.get('AWS_S3_BUCKET_LOGS'),
      attachmentsBucket: this.configService.get('AWS_S3_BUCKET_ATTACHMENTS'),
      region: this.configService.get('AWS_S3_REGION', this.region),
    };
  }

  // Lambda Configuration
  get lambdaFunctions() {
    return {
      enrichmentWorker: this.configService.get('AWS_LAMBDA_ENRICHMENT_FUNCTION'),
      aiTriageWorker: this.configService.get('AWS_LAMBDA_AI_TRIAGE_FUNCTION'),
      notifierWorker: this.configService.get('AWS_LAMBDA_NOTIFIER_FUNCTION'),
    };
  }

  // EventBridge Configuration
  get eventBridgeConfig() {
    return {
      busName: this.configService.get('AWS_EVENTBRIDGE_BUS_NAME'),
      source: this.configService.get('AWS_EVENTBRIDGE_SOURCE'),
    };
  }

  // Redis Configuration
  get redisConfig() {
    return {
      host: this.configService.get('REDIS_HOST'),
      port: parseInt(this.configService.get('REDIS_PORT', '6379')),
      password: this.configService.get('REDIS_PASSWORD'),
      db: parseInt(this.configService.get('REDIS_DB', '0')),
      ttl: parseInt(this.configService.get('REDIS_TTL', '3600')),
    };
  }

  // Secrets Manager Configuration
  get secretsConfig() {
    return {
      region: this.configService.get('AWS_SECRETS_REGION', this.region),
      secrets: {
        virusTotalApi: this.configService.get('AWS_SECRET_VIRUSTOTAL_API'),
        abuseIpDbApi: this.configService.get('AWS_SECRET_ABUSEIPDB_API'),
        openAiApi: this.configService.get('AWS_SECRET_OPENAI_API'),
        slackWebhook: this.configService.get('AWS_SECRET_SLACK_WEBHOOK'),
      },
    };
  }

  // CloudWatch Configuration
  get cloudWatchConfig() {
    return {
      logGroup: this.configService.get('AWS_CLOUDWATCH_LOG_GROUP'),
      namespace: this.configService.get('AWS_CLOUDWATCH_NAMESPACE'),
    };
  }

  // Socket.IO Configuration
  get socketConfig() {
    return {
      port: parseInt(this.configService.get('SOCKET_IO_PORT', '3002')),
      corsOrigin: this.configService.get('SOCKET_IO_CORS_ORIGIN', 'http://localhost:3000'),
    };
  }

  // Validate required configurations
  validateConfig(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check AWS region
    if (!this.region) {
      errors.push('AWS_REGION is required');
    }

    // Check SQS queues
    const sqsUrls = this.sqsQueueUrls;
    if (!sqsUrls.events) errors.push('AWS_SQS_QUEUE_URL_EVENTS is required');
    if (!sqsUrls.notifications) errors.push('AWS_SQS_QUEUE_URL_NOTIFICATIONS is required');
    if (!sqsUrls.enrichment) errors.push('AWS_SQS_QUEUE_URL_ENRICHMENT is required');

    // Check S3 buckets
    const s3Config = this.s3Config;
    if (!s3Config.logsBucket) errors.push('AWS_S3_BUCKET_LOGS is required');
    if (!s3Config.attachmentsBucket) errors.push('AWS_S3_BUCKET_ATTACHMENTS is required');

    // Check Lambda functions
    const lambdaFunctions = this.lambdaFunctions;
    if (!lambdaFunctions.enrichmentWorker) errors.push('AWS_LAMBDA_ENRICHMENT_FUNCTION is required');
    if (!lambdaFunctions.aiTriageWorker) errors.push('AWS_LAMBDA_AI_TRIAGE_FUNCTION is required');
    if (!lambdaFunctions.notifierWorker) errors.push('AWS_LAMBDA_NOTIFIER_FUNCTION is required');

    // Check Redis
    const redisConfig = this.redisConfig;
    if (!redisConfig.host) errors.push('REDIS_HOST is required');

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}