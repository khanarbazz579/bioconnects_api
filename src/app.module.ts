import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { ApisModule } from './apis/apis.module';
import { CanCommonModule } from '@can/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CommonModule } from './common/common.module';
import { CronModule } from './common/cron/cron.module';
import { CanDatasourceModule } from './core/datasource/datasource.module';

@Module({
  imports: [
    CanDatasourceModule,
    CoreModule,
    ApisModule,
    CanCommonModule,
    CommonModule,
    CronModule,
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 5000,
    })
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [CanDatasourceModule],
})
export class AppModule {}
