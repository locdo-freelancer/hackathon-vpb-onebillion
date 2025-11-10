import { Controller, Get, UseGuards } from "@nestjs/common";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "@lib/guards";
import { AwsConfigService } from "../config/aws-config.service";
import { ResilienceService } from "../services/resilience.service";
import { SqsService } from "../services/sqs.service";
import { S3Service } from "../services/s3.service";
import { EventBridgeService } from "../services/eventbridge.service";
import { LambdaService } from "../services/lambda.service";

@ApiTags("aws-health")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("aws/health")
export class AwsHealthController {
  constructor(
    private awsConfigService: AwsConfigService,
    private resilienceService: ResilienceService,
    private sqsService: SqsService,
    private s3Service: S3Service,
    private eventBridgeService: EventBridgeService,
    private lambdaService: LambdaService
  ) {}

  @Get()
  @ApiOperation({
    summary: "AWS services health check",
    description: "Check the health and status of all AWS services",
  })
  @ApiResponse({
    status: 200,
    description: "AWS services health status",
    schema: {
      type: "object",
      properties: {
        status: { type: "string" },
        timestamp: { type: "string" },
        services: {
          type: "object",
          properties: {
            circuitBreakers: { type: "object" },
            configuration: { type: "object" },
          },
        },
      },
    },
  })
  async checkHealth() {
    const timestamp = new Date().toISOString();

    try {
      // Test SQS
      const sqsHealth = await this.checkSQSHealth();

      // Test S3
      const s3Health = await this.checkS3Health();

      // Test EventBridge
      const eventBridgeHealth = await this.checkEventBridgeHealth();

      // Test Lambda
      const lambdaHealth = await this.checkLambdaHealth();

      const services = {
        sqs: sqsHealth,
        s3: s3Health,
        eventbridge: eventBridgeHealth,
        lambda: lambdaHealth,
      };

      const allHealthy = Object.values(services).every(
        (s: any) => s.status === "healthy"
      );
      const anyUnhealthy = Object.values(services).some(
        (s: any) => s.status === "unhealthy"
      );

      return {
        status: allHealthy
          ? "healthy"
          : anyUnhealthy
            ? "unhealthy"
            : "degraded",
        timestamp,
        services,
      };
    } catch (error) {
      return {
        status: "unhealthy",
        timestamp,
        error: error.message,
      };
    }
  }

  @Get("sqs")
  @ApiOperation({ summary: "Check SQS health" })
  async checkSQSHealth() {
    const startTime = Date.now();
    try {
      const queueUrl = this.awsConfigService.getEventsQueueUrl();
      if (!queueUrl) {
        return {
          status: "unhealthy",
          error: "SQS queue URL not configured",
        };
      }

      const messageId = await this.sqsService.sendMessage(queueUrl, {
        body: {
          type: "health-check",
          timestamp: new Date().toISOString(),
        },
      });

      return {
        status: "healthy",
        latency: Date.now() - startTime,
        messageId,
      };
    } catch (error) {
      return {
        status: "unhealthy",
        latency: Date.now() - startTime,
        error: error.message,
      };
    }
  }

  @Get("s3")
  @ApiOperation({ summary: "Check S3 health" })
  async checkS3Health() {
    const startTime = Date.now();
    try {
      const bucket = this.awsConfigService.getS3BucketName();
      if (!bucket) {
        return {
          status: "unhealthy",
          error: "S3 bucket not configured",
        };
      }

      const testKey = `health-check/${Date.now()}.txt`;
      const testContent = "Health check test";

      // Upload
      await this.s3Service.uploadFile(testKey, testContent, {
        contentType: "text/plain",
      });

      // Download
      const downloaded = await this.s3Service.downloadFile(testKey);
      const contentMatches = downloaded.toString() === testContent;

      // Delete
      await this.s3Service.deleteFile(testKey);

      return {
        status: "healthy",
        latency: Date.now() - startTime,
        operations: {
          upload: true,
          download: contentMatches,
          delete: true,
        },
      };
    } catch (error) {
      return {
        status: "unhealthy",
        latency: Date.now() - startTime,
        error: error.message,
      };
    }
  }

  @Get("eventbridge")
  @ApiOperation({ summary: "Check EventBridge health" })
  async checkEventBridgeHealth() {
    const startTime = Date.now();
    try {
      const busName = this.awsConfigService.getEventBusName();
      if (!busName) {
        return {
          status: "unhealthy",
          error: "EventBridge bus not configured",
        };
      }

      await this.eventBridgeService.publishEvent("HealthCheck", {
        timestamp: new Date().toISOString(),
        type: "health-check",
      });

      return {
        status: "healthy",
        latency: Date.now() - startTime,
      };
    } catch (error) {
      return {
        status: "unhealthy",
        latency: Date.now() - startTime,
        error: error.message,
      };
    }
  }

  @Get("lambda")
  @ApiOperation({ summary: "Check Lambda health" })
  async checkLambdaHealth() {
    const startTime = Date.now();
    try {
      const functionName = this.awsConfigService.getEnrichmentFunctionName();
      if (!functionName) {
        return {
          status: "unhealthy",
          error: "Lambda function not configured",
        };
      }

      await this.lambdaService.invokeFunctionAsync(functionName, {
        type: "health-check",
        timestamp: new Date().toISOString(),
      });

      return {
        status: "healthy",
        latency: Date.now() - startTime,
      };
    } catch (error) {
      return {
        status: "unhealthy",
        latency: Date.now() - startTime,
        error: error.message,
      };
    }
  }

  @Get("legacy")
  @ApiOperation({
    summary: "Legacy health check (deprecated)",
    description: "Use /aws/health instead",
  })
  async healthCheck() {
    const timestamp = new Date().toISOString();

    // Get circuit breaker status
    const circuitBreakers = this.resilienceService.getCircuitBreakerStatus();

    // Check AWS configuration
    const awsConfig = this.checkAwsConfiguration();

    const allHealthy =
      Object.values(circuitBreakers).every((cb) => cb.state !== "open") &&
      awsConfig.status === "configured";

    return {
      status: allHealthy ? "healthy" : "degraded",
      timestamp,
      services: {
        circuitBreakers: {
          status: Object.values(circuitBreakers).some(
            (cb) => cb.state === "open"
          )
            ? "degraded"
            : "healthy",
          breakers: circuitBreakers,
        },
        configuration: awsConfig,
      },
    };
  }

  @Get("circuit-breakers")
  @ApiOperation({
    summary: "Circuit breakers status",
    description: "Get status of all circuit breakers",
  })
  async getCircuitBreakers() {
    return {
      timestamp: new Date().toISOString(),
      circuitBreakers: this.resilienceService.getCircuitBreakerStatus(),
    };
  }

  @Get("configuration")
  @ApiOperation({
    summary: "AWS configuration status",
    description: "Check AWS services configuration",
  })
  async getConfiguration() {
    return this.checkAwsConfiguration();
  }

  private checkAwsConfiguration() {
    const region = this.awsConfigService.getRegion();

    // Check if essential configurations are present
    const requiredConfigs = {
      region: !!region,
      sqsQueues: {
        events: !!this.awsConfigService.getEventsQueueUrl(),
        notifications: !!this.awsConfigService.getNotificationsQueueUrl(),
        enrichment: !!this.awsConfigService.getEnrichmentQueueUrl(),
      },
      s3: {
        bucket: !!this.awsConfigService.getS3BucketName(),
        logsBucket: !!this.awsConfigService.getLogsBucket(),
        attachmentsBucket: !!this.awsConfigService.getAttachmentsBucket(),
      },
      lambda: {
        enrichment: !!this.awsConfigService.getEnrichmentFunctionName(),
        aiTriage: !!this.awsConfigService.getAiTriageFunctionName(),
        notifier: !!this.awsConfigService.getNotifierFunctionName(),
      },
      eventBridge: {
        busName: !!this.awsConfigService.getEventBusName(),
        source: !!this.awsConfigService.getEventBridgeSource(),
      },
    };

    const allConfigured =
      requiredConfigs.region &&
      Object.values(requiredConfigs.sqsQueues).every(Boolean) &&
      Object.values(requiredConfigs.s3).every(Boolean) &&
      Object.values(requiredConfigs.lambda).every(Boolean) &&
      Object.values(requiredConfigs.eventBridge).every(Boolean);

    return {
      status: allConfigured ? "configured" : "incomplete",
      region,
      configurations: requiredConfigs,
      timestamp: new Date().toISOString(),
    };
  }
}
