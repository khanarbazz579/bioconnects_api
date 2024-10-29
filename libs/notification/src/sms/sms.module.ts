import { CanAwsModule } from 'libs/aws/src';
import { DynamicModule, Module } from '@nestjs/common';
import { CAN_SMS_NOTIFICATION_OPTIONS } from './sms.constant';
import { CanSmsNotificationService } from './sms.service';
import { CanSmsNotificationOptions } from './sms.type';
import { HttpModule } from '@nestjs/axios';

@Module({})
export class CanSmsNotificationModule {
  static forRoot(options: CanSmsNotificationOptions): DynamicModule {
    return {
      imports: [CanAwsModule.forRoot(options.aws), HttpModule],
      module: CanSmsNotificationModule,
      providers: [
        {
          provide: CAN_SMS_NOTIFICATION_OPTIONS,
          useValue: options ? options : {},
        },
        CanSmsNotificationService,
      ],
      exports: [CanSmsNotificationService],
    };
  }
}
