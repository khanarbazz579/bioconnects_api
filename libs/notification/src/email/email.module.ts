import { CanAwsModule } from 'libs/aws/src';
import { DynamicModule, Module } from '@nestjs/common';
import { CAN_EMAIL_NOTIFICATION_OPTIONS } from './email.constant';
import { CanEmailNotificationService } from './email.service';
import { CanEmailNotificationOptions } from './email.type';
import { HttpModule } from '@nestjs/axios';

@Module({})
export class CanEmailNotificationModule {
  static forRoot(options: CanEmailNotificationOptions): DynamicModule {
    return {
      imports: [CanAwsModule.forRoot(options.aws), HttpModule],
      module: CanEmailNotificationModule,
      providers: [
        {
          provide: CAN_EMAIL_NOTIFICATION_OPTIONS,
          useValue: options ? options : {},
        },
        CanEmailNotificationService,
      ],
      exports: [CanEmailNotificationService],
    };
  }
}
