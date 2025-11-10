import { Injectable, Logger } from "@nestjs/common";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { AwsConfigService } from "../config/aws-config.service";
import { ResilienceService } from "./resilience.service";
import { Readable } from "stream";

export interface S3UploadOptions {
  contentType?: string;
  metadata?: Record<string, string>;
  tags?: Record<string, string>;
}

export interface S3Object {
  key: string;
  size: number;
  lastModified: Date;
  etag: string;
}

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private readonly s3Client: S3Client;

  constructor(
    private awsConfigService: AwsConfigService,
    private resilienceService: ResilienceService
  ) {
    this.s3Client = this.awsConfigService.createS3Client();
  }

  /**
   * Upload file to S3 bucket
   */
  async uploadFile(
    key: string,
    body: Buffer | Uint8Array | string | Readable,
    options: S3UploadOptions = {}
  ): Promise<string> {
    try {
      const bucket = this.awsConfigService.getS3BucketName();
      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: options.contentType,
        Metadata: options.metadata,
        Tagging: this.formatTags(options.tags),
      });

      const result = await this.s3Client.send(command);
      this.logger.log(`File uploaded to S3: ${bucket}/${key}`);
      return result.ETag || "";
    } catch (error) {
      this.logger.error(`Failed to upload file to S3: ${key}`, error);
      throw error;
    }
  }

  /**
   * Download file from S3 bucket
   */
  async downloadFile(key: string): Promise<Buffer> {
    try {
      const bucket = this.awsConfigService.getS3BucketName();
      const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      });

      const result = await this.s3Client.send(command);

      if (!result.Body) {
        throw new Error("File not found or empty");
      }

      const chunks: Buffer[] = [];
      const stream = result.Body as Readable;

      for await (const chunk of stream) {
        chunks.push(chunk);
      }

      return Buffer.concat(chunks);
    } catch (error) {
      this.logger.error(`Failed to download file from S3: ${key}`, error);
      throw error;
    }
  }

  /**
   * Delete file from S3 bucket
   */
  async deleteFile(key: string): Promise<void> {
    try {
      const bucket = this.awsConfigService.getS3BucketName();
      const command = new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      });

      await this.s3Client.send(command);
      this.logger.log(`File deleted from S3: ${bucket}/${key}`);
    } catch (error) {
      this.logger.error(`Failed to delete file from S3: ${key}`, error);
      throw error;
    }
  }

  /**
   * List files in S3 bucket with prefix
   */
  async listFiles(prefix?: string, maxKeys = 1000): Promise<S3Object[]> {
    try {
      const bucket = this.awsConfigService.getS3BucketName();
      const command = new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix,
        MaxKeys: maxKeys,
      });

      const result = await this.s3Client.send(command);

      return (result.Contents || []).map((obj) => ({
        key: obj.Key || "",
        size: obj.Size || 0,
        lastModified: obj.LastModified || new Date(),
        etag: obj.ETag || "",
      }));
    } catch (error) {
      this.logger.error(
        `Failed to list files in S3 with prefix: ${prefix}`,
        error
      );
      throw error;
    }
  }

  /**
   * Store raw log file
   */
  async storeRawLog(
    siteId: string,
    agentId: string,
    logContent: string,
    logType: string
  ): Promise<string> {
    const timestamp = new Date().toISOString();
    const key = `raw-logs/${siteId}/${agentId}/${logType}/${timestamp}.log`;

    await this.uploadFile(key, logContent, {
      contentType: "text/plain",
      metadata: {
        siteId,
        agentId,
        logType,
        timestamp,
      },
      tags: {
        Type: "RawLog",
        SiteId: siteId,
        AgentId: agentId,
        LogType: logType,
      },
    });

    return key;
  }

  /**
   * Store incident attachment
   */
  async storeIncidentAttachment(
    incidentId: string,
    fileName: string,
    fileContent: Buffer,
    contentType: string
  ): Promise<string> {
    const key = `incidents/${incidentId}/attachments/${fileName}`;

    await this.uploadFile(key, fileContent, {
      contentType,
      metadata: {
        incidentId,
        fileName,
        uploadTime: new Date().toISOString(),
      },
      tags: {
        Type: "IncidentAttachment",
        IncidentId: incidentId,
      },
    });

    return key;
  }

  /**
   * Store AI analysis result
   */
  async storeAIAnalysis(
    analysisId: string,
    analysisType: string,
    result: any
  ): Promise<string> {
    const timestamp = new Date().toISOString();
    const key = `ai-analysis/${analysisType}/${analysisId}/${timestamp}.json`;

    await this.uploadFile(key, JSON.stringify(result, null, 2), {
      contentType: "application/json",
      metadata: {
        analysisId,
        analysisType,
        timestamp,
      },
      tags: {
        Type: "AIAnalysis",
        AnalysisType: analysisType,
        AnalysisId: analysisId,
      },
    });

    return key;
  }

  /**
   * Store threat intelligence data
   */
  async storeThreatIntelligence(
    indicator: string,
    indicatorType: string,
    intelligenceData: any
  ): Promise<string> {
    const timestamp = new Date().toISOString();
    const safeIndicator = indicator.replace(/[\/\\:*?"<>|]/g, "_");
    const key = `threat-intelligence/${indicatorType}/${safeIndicator}/${timestamp}.json`;

    await this.uploadFile(key, JSON.stringify(intelligenceData, null, 2), {
      contentType: "application/json",
      metadata: {
        indicator,
        indicatorType,
        timestamp,
      },
      tags: {
        Type: "ThreatIntelligence",
        IndicatorType: indicatorType,
        Indicator: indicator,
      },
    });

    return key;
  }

  /**
   * Store backup data
   */
  async storeBackup(
    backupType: string,
    data: any,
    metadata?: Record<string, string>
  ): Promise<string> {
    const timestamp = new Date().toISOString();
    const key = `backups/${backupType}/${timestamp}.json`;

    await this.uploadFile(key, JSON.stringify(data, null, 2), {
      contentType: "application/json",
      metadata: {
        backupType,
        timestamp,
        ...metadata,
      },
      tags: {
        Type: "Backup",
        BackupType: backupType,
      },
    });

    return key;
  }

  /**
   * Get signed URL for direct access (for future use)
   */
  getS3Url(key: string): string {
    const bucket = this.awsConfigService.getS3BucketName();
    return `https://${bucket}.s3.amazonaws.com/${key}`;
  }

  private formatTags(tags?: Record<string, string>): string | undefined {
    if (!tags || Object.keys(tags).length === 0) return undefined;

    // AWS S3 tag keys and values must:
    // - Only contain alphanumeric, spaces, and +-.=_:@/ characters
    // - Max 128 chars for key, 256 for value
    const sanitizeTagValue = (value: string): string => {
      return value
        .replace(/[^a-zA-Z0-9 +\-.=_:/@]/g, "_") // Replace invalid chars
        .substring(0, 256); // Max 256 chars
    };

    const sanitizeTagKey = (key: string): string => {
      return key.replace(/[^a-zA-Z0-9 +\-.=_:/@]/g, "_").substring(0, 128); // Max 128 chars
    };

    return Object.entries(tags)
      .map(([key, value]) => {
        const sanitizedKey = sanitizeTagKey(key);
        const sanitizedValue = sanitizeTagValue(value);
        return `${encodeURIComponent(sanitizedKey)}=${encodeURIComponent(sanitizedValue)}`;
      })
      .join("&");
  }
}
