import { Module, Global } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-ioredis';
import { RedisService } from './redis.service';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const host = configService.get('REDIS_HOST');
        const port = configService.get('REDIS_PORT', 6379);
        const password = configService.get('REDIS_PASSWORD', '');
        const db = configService.get('REDIS_DB', 0);
        const ttl = configService.get('REDIS_TTL', 3600);

        return {
          store: redisStore,
          host,
          port,
          password: password || undefined,
          db,
          ttl,
          retryStrategy: (times: number) => {
            if (times > 3) {
              console.error('Redis connection failed after 3 retries');
              return null;
            }
            return Math.min(times * 1000, 3000);
          },
          reconnectOnError: (err: Error) => {
            console.error('Redis reconnect on error:', err.message);
            return true;
          },
        };
      },
    }),
  ],
  providers: [RedisService],
  exports: [CacheModule, RedisService],
})
export class RedisModule {}