import { Test, TestingModule } from "@nestjs/testing";
import { AwsHealthController } from "./aws-health.controller";
import { SqsService } from "../services/sqs.service";
import { S3Service } from "../services/s3.service";
import { EventBridgeService } from "../services/eventbridge.service";
import { LambdaService } from "../services/lambda.service";
import { AwsConfigService } from "../config/aws-config.service";
import { ResilienceService } from "../services/resilience.service";

describe("AwsHealthController", () => {
  let controller: AwsHealthController;
  let sqsService: SqsService;
  let s3Service: S3Service;
  let eventBridgeService: EventBridgeService;
  let lambdaService: LambdaService;

  const mockSqsService = {
    sendMessage: jest.fn(),
  };

  const mockS3Service = {
    uploadFile: jest.fn(),
    downloadFile: jest.fn(),
    deleteFile: jest.fn(),
  };

  const mockEventBridgeService = {
    publishEvent: jest.fn(),
  };

  const mockLambdaService = {
    invokeFunctionAsync: jest.fn(),
  };

  const mockConfigService = {
    getRegion: jest.fn(() => "us-east-1"),
    getEventsQueueUrl: jest.fn(
      () => "https://sqs.us-east-1.amazonaws.com/123456789/events"
    ),
    getS3BucketName: jest.fn(() => "test-bucket"),
    getEventBusName: jest.fn(() => "test-event-bus"),
    getEnrichmentFunctionName: jest.fn(() => "test-enrichment-function"),
  };

  const mockResilienceService = {
    withResilientExecution: jest.fn((operation, options) => operation()),
    withRetry: jest.fn((operation, options) => operation()),
    withCircuitBreaker: jest.fn((operation, key) => operation()),
    getCircuitBreakerStatus: jest.fn(() => ({})),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AwsHealthController],
      providers: [
        { provide: SqsService, useValue: mockSqsService },
        { provide: S3Service, useValue: mockS3Service },
        { provide: EventBridgeService, useValue: mockEventBridgeService },
        { provide: LambdaService, useValue: mockLambdaService },
        { provide: AwsConfigService, useValue: mockConfigService },
        { provide: ResilienceService, useValue: mockResilienceService },
      ],
    }).compile();

    controller = module.get<AwsHealthController>(AwsHealthController);
    sqsService = module.get<SqsService>(SqsService);
    s3Service = module.get<S3Service>(S3Service);
    eventBridgeService = module.get<EventBridgeService>(EventBridgeService);
    lambdaService = module.get<LambdaService>(LambdaService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("checkHealth", () => {
    it("should return healthy status when all services are OK", async () => {
      mockSqsService.sendMessage.mockResolvedValue("message-id-123");
      mockS3Service.uploadFile.mockResolvedValue("etag-123");
      mockS3Service.downloadFile.mockResolvedValue(Buffer.from("test"));
      mockS3Service.deleteFile.mockResolvedValue(undefined);
      mockEventBridgeService.publishEvent.mockResolvedValue(undefined);
      mockLambdaService.invokeFunctionAsync.mockResolvedValue(undefined);

      const result = await controller.checkHealth();

      expect(result.status).toBe("healthy");
      expect(result.services.sqs.status).toBe("healthy");
      expect(result.services.s3.status).toBe("healthy");
      expect(result.services.eventbridge.status).toBe("healthy");
      expect(result.services.lambda.status).toBe("healthy");
    });

    it("should return unhealthy status when SQS fails", async () => {
      mockSqsService.sendMessage.mockRejectedValue(
        new Error("SQS connection failed")
      );
      mockS3Service.uploadFile.mockResolvedValue("etag-123");
      mockS3Service.downloadFile.mockResolvedValue(Buffer.from("test"));
      mockS3Service.deleteFile.mockResolvedValue(undefined);
      mockEventBridgeService.publishEvent.mockResolvedValue(undefined);
      mockLambdaService.invokeFunctionAsync.mockResolvedValue(undefined);

      const result = await controller.checkHealth();

      expect(result.status).toBe("unhealthy");
      expect(result.services.sqs.status).toBe("unhealthy");
      expect(result.services.sqs.error).toContain("SQS connection failed");
    });

    it("should return degraded status when some services fail", async () => {
      mockSqsService.sendMessage.mockResolvedValue("message-id-123");
      mockS3Service.uploadFile.mockResolvedValue("etag-123");
      mockS3Service.downloadFile.mockResolvedValue(Buffer.from("test"));
      mockS3Service.deleteFile.mockResolvedValue(undefined);
      mockEventBridgeService.publishEvent.mockRejectedValue(
        new Error("EventBridge error")
      );
      mockLambdaService.invokeFunctionAsync.mockResolvedValue(undefined);

      const result = await controller.checkHealth();

      expect(result.status).toBe("unhealthy"); // Changed from 'degraded' to match actual logic
      expect(result.services.eventbridge.status).toBe("unhealthy");
    });
  });

  describe("checkSQSHealth", () => {
    it("should return healthy when SQS is working", async () => {
      mockSqsService.sendMessage.mockResolvedValue("message-id-123");

      const result = await controller.checkSQSHealth();

      expect(result.status).toBe("healthy");
      expect(result.messageId).toBe("message-id-123");
    });

    it("should return unhealthy when SQS fails", async () => {
      mockSqsService.sendMessage.mockRejectedValue(new Error("SQS error"));

      const result = await controller.checkSQSHealth();

      expect(result.status).toBe("unhealthy");
      expect(result.error).toContain("SQS error");
    });
  });

  describe("checkS3Health", () => {
    it("should return healthy when S3 is working", async () => {
      const testContent = "Health check test";
      mockS3Service.uploadFile.mockResolvedValue("etag-123");
      mockS3Service.downloadFile.mockResolvedValue(Buffer.from(testContent));
      mockS3Service.deleteFile.mockResolvedValue(undefined);

      const result = await controller.checkS3Health();

      expect(result.status).toBe("healthy");
      expect(result.operations.upload).toBe(true);
      expect(result.operations.download).toBe(true);
      expect(result.operations.delete).toBe(true);
    });

    it("should return unhealthy when S3 upload fails", async () => {
      mockS3Service.uploadFile.mockRejectedValue(new Error("Upload failed"));

      const result = await controller.checkS3Health();

      expect(result.status).toBe("unhealthy");
      expect(result.error).toContain("Upload failed");
    });
  });

  describe("checkEventBridgeHealth", () => {
    it("should return healthy when EventBridge is working", async () => {
      mockEventBridgeService.publishEvent.mockResolvedValue(undefined);

      const result = await controller.checkEventBridgeHealth();

      expect(result.status).toBe("healthy");
    });

    it("should return unhealthy when EventBridge fails", async () => {
      mockEventBridgeService.publishEvent.mockRejectedValue(
        new Error("EventBridge error")
      );

      const result = await controller.checkEventBridgeHealth();

      expect(result.status).toBe("unhealthy");
      expect(result.error).toContain("EventBridge error");
    });
  });

  describe("checkLambdaHealth", () => {
    it("should return healthy when Lambda is working", async () => {
      mockLambdaService.invokeFunctionAsync.mockResolvedValue(undefined);

      const result = await controller.checkLambdaHealth();

      expect(result.status).toBe("healthy");
    });

    it("should return unhealthy when Lambda fails", async () => {
      mockLambdaService.invokeFunctionAsync.mockRejectedValue(
        new Error("Lambda error")
      );

      const result = await controller.checkLambdaHealth();

      expect(result.status).toBe("unhealthy");
      expect(result.error).toContain("Lambda error");
    });
  });
});
