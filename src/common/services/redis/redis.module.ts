import { Module } from '@nestjs/common';
import { CanRedisKeysService } from './redis-keys.service';
import { CanRedisService } from './redis.service';

@Module({
  providers: [CanRedisService, CanRedisKeysService],
  exports: [CanRedisService, CanRedisKeysService],
})
export class RedisModule {}
