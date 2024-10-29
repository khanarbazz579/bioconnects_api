import { Module } from '@nestjs/common';
import { CanConfigModule } from '../core/config/config.module';
import { AuthModule } from './auth/auth.module';
import { CanLoggerModule } from './logger/logger.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    CanConfigModule,
    CanLoggerModule,
    AuthModule,
    // UserModule,
  ],
  providers: [],
  exports: [
    CanConfigModule,
    CanLoggerModule,
    AuthModule,
    // UserModule,
  ],
})
export class CoreModule {}
