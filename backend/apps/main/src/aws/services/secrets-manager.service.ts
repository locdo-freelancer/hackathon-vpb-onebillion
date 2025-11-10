import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  SecretsManagerClient,
  GetSecretValueCommand,
  DescribeSecretCommand,
  UpdateSecretCommand,
} from '@aws-sdk/client-secrets-manager';

interface AIAPIKeys {
  openai: string;
  virustotal: string;
  abuseipdb: string;
  shodan: string;
  slack_webhook: string;
}

interface DatabaseCredentials {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

interface RedisCredentials {
  host: string;
  port: number;
  password: string;
  db: number;
}

@Injectable()
export class SecretsManagerService implements OnModuleInit {
  private readonly logger = new Logger(SecretsManagerService.name);
  private readonly client: SecretsManagerClient;
  private readonly region: string;

  // Cache secrets in memory to reduce API calls
  private secretsCache: Map<string, { value: any; expiresAt: number }> = new Map();
  private readonly CACHE_TTL = 300000; // 5 minutes

  constructor(private readonly configService: ConfigService) {
    this.region = this.configService.get('AWS_SECRETS_REGION', 'ap-northeast-1');

    this.client = new SecretsManagerClient({
      region: this.region,
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  async onModuleInit() {
    this.logger.log('🔐 Secrets Manager Service initialized');
    
    // Pre-warm cache with critical secrets
    try {
      await this.getAIAPIKeys();
      this.logger.log('✅ AI API keys pre-loaded');
    } catch (error) {
      this.logger.warn('⚠️  Failed to pre-load AI API keys', error.message);
    }
  }

  /**
   * Get secret value from AWS Secrets Manager
   */
  private async getSecret<T = string>(secretName: string): Promise<T> {
    // Check cache first
    const cached = this.secretsCache.get(secretName);
    if (cached && Date.now() < cached.expiresAt) {
      this.logger.debug(`Cache hit for secret: ${secretName}`);
      return cached.value as T;
    }

    try {
      this.logger.debug(`Fetching secret from AWS: ${secretName}`);

      const command = new GetSecretValueCommand({
        SecretId: secretName,
      });

      const response = await this.client.send(command);
      
      let secretValue: any;
      
      if (response.SecretString) {
        // Try to parse as JSON
        try {
          secretValue = JSON.parse(response.SecretString) as T;
        } catch {
          // Not JSON, return as string
          secretValue = response.SecretString as T;
        }
      } else if (response.SecretBinary) {
        // Binary secret (rare case)
        secretValue = Buffer.from(response.SecretBinary).toString('utf-8') as T;
      } else {
        throw new Error('Secret has no value');
      }

      // Cache the secret
      this.secretsCache.set(secretName, {
        value: secretValue,
        expiresAt: Date.now() + this.CACHE_TTL,
      });

      this.logger.log(`✅ Secret retrieved: ${secretName}`);
      return secretValue;
    } catch (error) {
      this.logger.error(`❌ Failed to get secret: ${secretName}`, error.stack);
      throw new Error(`Failed to retrieve secret: ${secretName}`);
    }
  }

  /**
   * Get consolidated AI API keys
   */
  async getAIAPIKeys(): Promise<AIAPIKeys> {
    const secretName = this.configService.get(
      'AWS_AI_SECRETS_NAME',
      'onebillion/ai-api-keys'
    );

    return this.getSecret<AIAPIKeys>(secretName);
  }

  /**
   * Get specific AI API key
   */
  async getOpenAIKey(): Promise<string> {
    try {
      const keys = await this.getAIAPIKeys();
      return keys.openai;
    } catch (error) {
      // Fallback to individual secret
      return this.getSecret<string>('securevault/openai-api-key');
    }
  }

  async getVirusTotalKey(): Promise<string> {
    try {
      const keys = await this.getAIAPIKeys();
      return keys.virustotal;
    } catch (error) {
      return this.getSecret<string>('securevault/virustotal-api-key');
    }
  }

  async getAbuseIPDBKey(): Promise<string> {
    try {
      const keys = await this.getAIAPIKeys();
      return keys.abuseipdb;
    } catch (error) {
      return this.getSecret<string>('securevault/abuseipdb-api-key');
    }
  }

  async getShodanKey(): Promise<string> {
    try {
      const keys = await this.getAIAPIKeys();
      return keys.shodan;
    } catch (error) {
      return this.getSecret<string>('securevault/shodan-api-key');
    }
  }

  async getSlackWebhook(): Promise<string> {
    try {
      const keys = await this.getAIAPIKeys();
      return keys.slack_webhook;
    } catch (error) {
      return this.getSecret<string>('securevault/slack-webhook-url');
    }
  }

  /**
   * Get database credentials
   */
  async getDatabaseCredentials(): Promise<DatabaseCredentials> {
    return this.getSecret<DatabaseCredentials>('securevault/database-credentials');
  }

  /**
   * Get Redis credentials
   */
  async getRedisCredentials(): Promise<RedisCredentials> {
    return this.getSecret<RedisCredentials>('securevault/redis-credentials');
  }

  /**
   * Get JWT secret
   */
  async getJWTSecret(): Promise<string> {
    return this.getSecret<string>('securevault/jwt-secret');
  }

  /**
   * Clear secrets cache (useful for testing or force refresh)
   */
  clearCache(secretName?: string): void {
    if (secretName) {
      this.secretsCache.delete(secretName);
      this.logger.log(`Cache cleared for: ${secretName}`);
    } else {
      this.secretsCache.clear();
      this.logger.log('All secrets cache cleared');
    }
  }

  /**
   * Update secret value (admin operation)
   */
  async updateSecret(secretName: string, secretValue: string | object): Promise<void> {
    try {
      const command = new UpdateSecretCommand({
        SecretId: secretName,
        SecretString: typeof secretValue === 'string' 
          ? secretValue 
          : JSON.stringify(secretValue),
      });

      await this.client.send(command);
      
      // Clear cache for this secret
      this.clearCache(secretName);
      
      this.logger.log(`✅ Secret updated: ${secretName}`);
    } catch (error) {
      this.logger.error(`❌ Failed to update secret: ${secretName}`, error.stack);
      throw error;
    }
  }

  /**
   * Get secret metadata
   */
  async getSecretMetadata(secretName: string): Promise<any> {
    try {
      const command = new DescribeSecretCommand({
        SecretId: secretName,
      });

      const response = await this.client.send(command);
      
      return {
        name: response.Name,
        arn: response.ARN,
        description: response.Description,
        lastChanged: response.LastChangedDate,
        lastAccessed: response.LastAccessedDate,
        tags: response.Tags,
      };
    } catch (error) {
      this.logger.error(`Failed to get metadata for: ${secretName}`, error.stack);
      throw error;
    }
  }
}