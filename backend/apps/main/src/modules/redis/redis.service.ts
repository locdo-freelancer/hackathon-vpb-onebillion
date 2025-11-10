import { Injectable, Logger, Inject, OnModuleInit } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";

@Injectable()
export class RedisService implements OnModuleInit {
  private readonly logger = new Logger(RedisService.name);
  private redisClient: Redis;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService
  ) {
    // Create direct Redis client for advanced operations
    this.redisClient = new Redis({
      host: this.configService.get("REDIS_HOST"),
      port: this.configService.get("REDIS_PORT", 6379),
      password: this.configService.get("REDIS_PASSWORD") || undefined,
      db: this.configService.get("REDIS_DB", 0),
      retryStrategy: (times) => {
        if (times > 3) return null;
        return Math.min(times * 1000, 3000);
      },
      lazyConnect: true,
    });

    this.redisClient.on("connect", () => {
      this.logger.log("✅ Redis connected");
    });

    this.redisClient.on("error", (error) => {
      this.logger.error("❌ Redis connection error:", error.message);
    });

    this.redisClient.on("ready", () => {
      this.logger.log("🚀 Redis ready to accept commands");
    });
  }

  async onModuleInit() {
    try {
      await this.redisClient.connect();
      const ping = await this.redisClient.ping();
      this.logger.log(`Redis PING: ${ping}`);
    } catch (error) {
      this.logger.error("Failed to connect to Redis:", error.message);
    }
  }

  /**
   * Basic cache operations via CacheManager
   */
  async get<T = any>(key: string): Promise<T | null> {
    try {
      return await this.cacheManager.get<T>(key);
    } catch (error) {
      this.logger.error(`Failed to get key ${key}:`, error.message);
      return null;
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      await this.cacheManager.set(key, value, ttl);
    } catch (error) {
      this.logger.error(`Failed to set key ${key}:`, error.message);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.cacheManager.del(key);
    } catch (error) {
      this.logger.error(`Failed to delete key ${key}:`, error.message);
    }
  }

  async reset(): Promise<void> {
    try {
      // Clear all keys using Redis client directly
      await this.redisClient.flushdb();
      this.logger.log("Cache cleared");
    } catch (error) {
      this.logger.error("Failed to clear cache:", error.message);
    }
  }

  /**
   * Advanced Redis operations
   */
  async setWithExpiry(key: string, value: any, seconds: number): Promise<void> {
    try {
      await this.redisClient.setex(
        key,
        seconds,
        typeof value === "string" ? value : JSON.stringify(value)
      );
    } catch (error) {
      this.logger.error(`Failed to setex key ${key}:`, error.message);
    }
  }

  async increment(key: string, by: number = 1): Promise<number> {
    try {
      return await this.redisClient.incrby(key, by);
    } catch (error) {
      this.logger.error(`Failed to increment key ${key}:`, error.message);
      return 0;
    }
  }

  async decrement(key: string, by: number = 1): Promise<number> {
    try {
      return await this.redisClient.decrby(key, by);
    } catch (error) {
      this.logger.error(`Failed to decrement key ${key}:`, error.message);
      return 0;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.redisClient.exists(key);
      return result === 1;
    } catch (error) {
      this.logger.error(
        `Failed to check existence of key ${key}:`,
        error.message
      );
      return false;
    }
  }

  async expire(key: string, seconds: number): Promise<boolean> {
    try {
      const result = await this.redisClient.expire(key, seconds);
      return result === 1;
    } catch (error) {
      this.logger.error(`Failed to set expiry for key ${key}:`, error.message);
      return false;
    }
  }

  async ttl(key: string): Promise<number> {
    try {
      return await this.redisClient.ttl(key);
    } catch (error) {
      this.logger.error(`Failed to get TTL for key ${key}:`, error.message);
      return -1;
    }
  }

  /**
   * Hash operations
   */
  async hset(key: string, field: string, value: any): Promise<void> {
    try {
      await this.redisClient.hset(
        key,
        field,
        typeof value === "string" ? value : JSON.stringify(value)
      );
    } catch (error) {
      this.logger.error(`Failed to hset ${key}.${field}:`, error.message);
    }
  }

  async hget(key: string, field: string): Promise<any> {
    try {
      const value = await this.redisClient.hget(key, field);
      if (!value) return null;

      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    } catch (error) {
      this.logger.error(`Failed to hget ${key}.${field}:`, error.message);
      return null;
    }
  }

  async hgetall(key: string): Promise<Record<string, any>> {
    try {
      const data = await this.redisClient.hgetall(key);
      const parsed: Record<string, any> = {};

      for (const [field, value] of Object.entries(data)) {
        try {
          parsed[field] = JSON.parse(value);
        } catch {
          parsed[field] = value;
        }
      }

      return parsed;
    } catch (error) {
      this.logger.error(`Failed to hgetall ${key}:`, error.message);
      return {};
    }
  }

  async hdel(key: string, ...fields: string[]): Promise<number> {
    try {
      return await this.redisClient.hdel(key, ...fields);
    } catch (error) {
      this.logger.error(`Failed to hdel ${key}:`, error.message);
      return 0;
    }
  }

  /**
   * List operations
   */
  async lpush(key: string, ...values: any[]): Promise<number> {
    try {
      const stringValues = values.map((v) =>
        typeof v === "string" ? v : JSON.stringify(v)
      );
      return await this.redisClient.lpush(key, ...stringValues);
    } catch (error) {
      this.logger.error(`Failed to lpush to ${key}:`, error.message);
      return 0;
    }
  }

  async rpush(key: string, ...values: any[]): Promise<number> {
    try {
      const stringValues = values.map((v) =>
        typeof v === "string" ? v : JSON.stringify(v)
      );
      return await this.redisClient.rpush(key, ...stringValues);
    } catch (error) {
      this.logger.error(`Failed to rpush to ${key}:`, error.message);
      return 0;
    }
  }

  async lrange(key: string, start: number, stop: number): Promise<any[]> {
    try {
      const values = await this.redisClient.lrange(key, start, stop);
      return values.map((v) => {
        try {
          return JSON.parse(v);
        } catch {
          return v;
        }
      });
    } catch (error) {
      this.logger.error(`Failed to lrange ${key}:`, error.message);
      return [];
    }
  }

  /**
   * Set operations
   */
  async sadd(key: string, ...members: any[]): Promise<number> {
    try {
      const stringMembers = members.map((m) =>
        typeof m === "string" ? m : JSON.stringify(m)
      );
      return await this.redisClient.sadd(key, ...stringMembers);
    } catch (error) {
      this.logger.error(`Failed to sadd to ${key}:`, error.message);
      return 0;
    }
  }

  async smembers(key: string): Promise<any[]> {
    try {
      const members = await this.redisClient.smembers(key);
      return members.map((m) => {
        try {
          return JSON.parse(m);
        } catch {
          return m;
        }
      });
    } catch (error) {
      this.logger.error(`Failed to smembers ${key}:`, error.message);
      return [];
    }
  }

  async sismember(key: string, member: any): Promise<boolean> {
    try {
      const stringMember =
        typeof member === "string" ? member : JSON.stringify(member);
      const result = await this.redisClient.sismember(key, stringMember);
      return result === 1;
    } catch (error) {
      this.logger.error(`Failed to sismember ${key}:`, error.message);
      return false;
    }
  }

  /**
   * Rate limiting helper
   */
  async rateLimit(
    key: string,
    maxRequests: number,
    windowSeconds: number
  ): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
    try {
      const current = await this.increment(key);

      if (current === 1) {
        await this.expire(key, windowSeconds);
      }

      const ttl = await this.ttl(key);
      const resetAt = new Date(Date.now() + ttl * 1000);

      return {
        allowed: current <= maxRequests,
        remaining: Math.max(0, maxRequests - current),
        resetAt,
      };
    } catch (error) {
      this.logger.error(`Failed to rate limit ${key}:`, error.message);
      return { allowed: true, remaining: maxRequests, resetAt: new Date() };
    }
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<{ status: string; latency: number }> {
    try {
      const start = Date.now();
      await this.redisClient.ping();
      const latency = Date.now() - start;

      return { status: "healthy", latency };
    } catch (error) {
      return { status: "unhealthy", latency: -1 };
    }
  }

  /**
   * Get Redis info
   */
  async info(section?: string): Promise<string> {
    try {
      return await this.redisClient.info(section);
    } catch (error) {
      this.logger.error("Failed to get Redis info:", error.message);
      return "";
    }
  }

  /**
   * Pub/Sub operations for real-time updates
   */
  async publish(channel: string, message: any): Promise<number> {
    try {
      const messageString =
        typeof message === "string" ? message : JSON.stringify(message);
      return await this.redisClient.publish(channel, messageString);
    } catch (error) {
      this.logger.error(
        `Failed to publish to channel ${channel}:`,
        error.message
      );
      return 0;
    }
  }

  async subscribe(
    channel: string,
    callback: (message: any) => void
  ): Promise<void> {
    try {
      const subscriber = this.redisClient.duplicate();
      await subscriber.connect();

      subscriber.on("message", (ch: string, msg: string) => {
        if (ch === channel) {
          try {
            const parsed = JSON.parse(msg);
            callback(parsed);
          } catch {
            callback(msg);
          }
        }
      });

      await subscriber.subscribe(channel);
      this.logger.log(`Subscribed to channel: ${channel}`);
    } catch (error) {
      this.logger.error(
        `Failed to subscribe to channel ${channel}:`,
        error.message
      );
    }
  }

  async unsubscribe(channel: string): Promise<void> {
    try {
      await this.redisClient.unsubscribe(channel);
      this.logger.log(`Unsubscribed from channel: ${channel}`);
    } catch (error) {
      this.logger.error(
        `Failed to unsubscribe from channel ${channel}:`,
        error.message
      );
    }
  }

  /**
   * Pattern-based pub/sub
   */
  async psubscribe(
    pattern: string,
    callback: (channel: string, message: any) => void
  ): Promise<void> {
    try {
      const subscriber = this.redisClient.duplicate();
      await subscriber.connect();

      subscriber.on("pmessage", (pat: string, ch: string, msg: string) => {
        if (pat === pattern) {
          try {
            const parsed = JSON.parse(msg);
            callback(ch, parsed);
          } catch {
            callback(ch, msg);
          }
        }
      });

      await subscriber.psubscribe(pattern);
      this.logger.log(`Pattern subscribed: ${pattern}`);
    } catch (error) {
      this.logger.error(
        `Failed to pattern subscribe ${pattern}:`,
        error.message
      );
    }
  }
}
