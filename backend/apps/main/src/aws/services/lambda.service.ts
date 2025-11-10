import { Injectable, Logger } from "@nestjs/common";
import {
  LambdaClient,
  InvokeCommand,
  InvocationType,
} from "@aws-sdk/client-lambda";
import { AwsConfigService } from "../config/aws-config.service";

export interface LambdaInvokeOptions {
  invocationType?: InvocationType;
  logType?: "None" | "Tail";
  qualifier?: string;
}

export interface EnrichmentRequest {
  indicator: string;
  type: "ip" | "domain" | "url" | "hash";
  sources: string[];
  requestId: string;
  callbackUrl?: string;
}

export interface AITriageRequest {
  eventId: string;
  eventType: "log" | "alert" | "incident";
  content: string;
  context?: any;
  requestId: string;
}

export interface NotificationRequest {
  userId: string;
  type: string;
  title: string;
  message: string;
  priority: "low" | "medium" | "high" | "critical";
  channels: string[];
  data?: any;
}

@Injectable()
export class LambdaService {
  private readonly logger = new Logger(LambdaService.name);
  private readonly lambdaClient: LambdaClient;

  constructor(private awsConfigService: AwsConfigService) {
    this.lambdaClient = this.awsConfigService.createLambdaClient();
  }

  /**
   * Generic Lambda function invocation
   */
  async invokeFunction(
    functionName: string,
    payload: any,
    options: LambdaInvokeOptions = {}
  ): Promise<any> {
    try {
      const command = new InvokeCommand({
        FunctionName: functionName,
        InvocationType:
          options.invocationType || InvocationType.RequestResponse,
        LogType: options.logType || "None",
        Payload: JSON.stringify(payload),
        Qualifier: options.qualifier,
      });

      const result = await this.lambdaClient.send(command);

      if (result.FunctionError) {
        throw new Error(`Lambda function error: ${result.FunctionError}`);
      }

      if (result.Payload) {
        const payloadString = Buffer.from(result.Payload).toString();

        // Handle empty or whitespace-only payloads
        if (!payloadString || payloadString.trim().length === 0) {
          this.logger.warn(
            `Lambda function ${functionName} returned empty payload`
          );
          return null;
        }

        try {
          const responsePayload = JSON.parse(payloadString);

          if (responsePayload.errorMessage) {
            throw new Error(
              `Lambda execution error: ${responsePayload.errorMessage}`
            );
          }

          return responsePayload;
        } catch (parseError) {
          // If payload is not valid JSON, log warning and return null
          this.logger.warn(
            `Lambda function ${functionName} returned non-JSON payload: ${payloadString.substring(0, 100)}`
          );
          return null;
        }
      }

      return null;
    } catch (error) {
      this.logger.error(
        `Failed to invoke Lambda function ${functionName}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Invoke function asynchronously
   */
  async invokeFunctionAsync(functionName: string, payload: any): Promise<void> {
    await this.invokeFunction(functionName, payload, {
      invocationType: InvocationType.Event,
    });
  }

  /**
   * Invoke enrichment worker
   */
  async invokeEnrichmentWorker(request: EnrichmentRequest): Promise<any> {
    const functionName = this.awsConfigService.getEnrichmentFunctionName();

    this.logger.log(
      `Invoking enrichment worker for ${request.type}: ${request.indicator}`
    );

    return this.invokeFunction(functionName, {
      ...request,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Invoke enrichment worker asynchronously
   */
  async invokeEnrichmentWorkerAsync(request: EnrichmentRequest): Promise<void> {
    const functionName = this.awsConfigService.getEnrichmentFunctionName();

    this.logger.log(
      `Invoking enrichment worker async for ${request.type}: ${request.indicator}`
    );

    await this.invokeFunctionAsync(functionName, {
      ...request,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Invoke AI triage worker
   */
  async invokeAITriageWorker(request: AITriageRequest): Promise<any> {
    const functionName = this.awsConfigService.getAiTriageFunctionName();

    this.logger.log(
      `Invoking AI triage worker for ${request.eventType}: ${request.eventId}`
    );

    return this.invokeFunction(functionName, {
      ...request,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Invoke AI triage worker asynchronously
   */
  async invokeAITriageWorkerAsync(request: AITriageRequest): Promise<void> {
    const functionName = this.awsConfigService.getAiTriageFunctionName();

    this.logger.log(
      `Invoking AI triage worker async for ${request.eventType}: ${request.eventId}`
    );

    await this.invokeFunctionAsync(functionName, {
      ...request,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Invoke notifier worker
   */
  async invokeNotifierWorker(request: NotificationRequest): Promise<any> {
    const functionName = this.awsConfigService.getNotifierFunctionName();

    this.logger.log(
      `Invoking notifier worker for user ${request.userId}: ${request.type}`
    );

    return this.invokeFunction(functionName, {
      ...request,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Invoke notifier worker asynchronously
   */
  async invokeNotifierWorkerAsync(request: NotificationRequest): Promise<void> {
    const functionName = this.awsConfigService.getNotifierFunctionName();

    this.logger.log(
      `Invoking notifier worker async for user ${request.userId}: ${request.type}`
    );

    await this.invokeFunctionAsync(functionName, {
      ...request,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Batch invoke multiple functions
   */
  async batchInvoke(
    requests: Array<{
      functionName: string;
      payload: any;
      options?: LambdaInvokeOptions;
    }>
  ): Promise<any[]> {
    const promises = requests.map((request) =>
      this.invokeFunction(
        request.functionName,
        request.payload,
        request.options
      )
    );

    return Promise.all(promises);
  }

  /**
   * Invoke enrichment for multiple indicators
   */
  async batchEnrichment(
    indicators: Array<{
      indicator: string;
      type: "ip" | "domain" | "url" | "hash";
      sources: string[];
    }>
  ): Promise<any[]> {
    const functionName = this.awsConfigService.getEnrichmentFunctionName();

    const requests = indicators.map((item, index) => ({
      functionName,
      payload: {
        ...item,
        requestId: `batch-${Date.now()}-${index}`,
        timestamp: new Date().toISOString(),
      },
    }));

    return this.batchInvoke(requests);
  }

  /**
   * Process log analysis workflow
   */
  async processLogAnalysisWorkflow(data: {
    logContent: string;
    logType: string;
    siteId: string;
    agentId: string;
  }): Promise<any> {
    const workflowId = `log-analysis-${Date.now()}`;

    try {
      // Step 1: AI Triage to extract IOCs and classify severity
      const triageResult = await this.invokeAITriageWorker({
        eventId: workflowId,
        eventType: "log",
        content: data.logContent,
        context: {
          logType: data.logType,
          siteId: data.siteId,
          agentId: data.agentId,
        },
        requestId: `${workflowId}-triage`,
      });

      // Step 2: Enrich extracted IOCs if any
      const enrichmentResults = [];
      if (triageResult.indicators && triageResult.indicators.length > 0) {
        for (const indicator of triageResult.indicators) {
          const enrichmentResult = await this.invokeEnrichmentWorker({
            indicator: indicator.value,
            type: indicator.type,
            sources: ["virustotal", "abuseipdb"],
            requestId: `${workflowId}-enrich-${indicator.value}`,
          });
          enrichmentResults.push(enrichmentResult);
        }
      }

      return {
        workflowId,
        triageResult,
        enrichmentResults,
        status: "completed",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Log analysis workflow failed: ${workflowId}`, error);
      throw error;
    }
  }

  /**
   * Process incident response workflow
   */
  async processIncidentResponseWorkflow(data: {
    incidentId: string;
    severity: string;
    type: string;
    description: string;
    affectedSystems: string[];
  }): Promise<any> {
    const workflowId = `incident-response-${data.incidentId}`;

    try {
      // Step 1: AI Triage for incident classification and priority
      const triageResult = await this.invokeAITriageWorker({
        eventId: workflowId,
        eventType: "incident",
        content: data.description,
        context: {
          severity: data.severity,
          type: data.type,
          affectedSystems: data.affectedSystems,
        },
        requestId: `${workflowId}-triage`,
      });

      // Step 2: Send notifications based on severity
      const notificationPromises = [];
      if (data.severity === "critical" || data.severity === "high") {
        // Immediate notification for high/critical incidents
        notificationPromises.push(
          this.invokeNotifierWorkerAsync({
            userId: "security-team",
            type: "incident-alert",
            title: `${data.severity.toUpperCase()} Incident: ${data.type}`,
            message: data.description,
            priority: data.severity as any,
            channels: ["email", "slack", "sms"],
            data: { incidentId: data.incidentId },
          })
        );
      }

      await Promise.all(notificationPromises);

      return {
        workflowId,
        triageResult,
        notificationsSent: notificationPromises.length,
        status: "completed",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(
        `Incident response workflow failed: ${workflowId}`,
        error
      );
      throw error;
    }
  }
}
