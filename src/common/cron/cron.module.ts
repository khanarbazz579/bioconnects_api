import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { ScheduleModule } from '@nestjs/schedule';
import { QueryModule } from 'src/core/query/query.module';
import { CommonModule } from '../common.module';
import { CanCommonModule } from '@can/common';
import { RedisModule } from '../services/redis/redis.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    CommonModule,
    CanCommonModule,
    QueryModule,
    RedisModule
  ],
  providers: [CronService],
  exports: [ScheduleModule, CronService],
})
export class CronModule {}
