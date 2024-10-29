import { DynamicModule, Module } from '@nestjs/common';
import { CAN_WHATSAPP_NOTIFICATION_OPTIONS } from './whatsapp.constant';
import { CanWhatsappNotificationService } from './whatsapp.service';
import { CanWhatsappNotificationOptions } from './whatsapp.type';
import { HttpModule } from '@nestjs/axios';

@Module({})
export class CanWhatsappNotificationModule {
  static forRoot(options: CanWhatsappNotificationOptions): DynamicModule {
    return {
      imports: [HttpModule],
      module: CanWhatsappNotificationModule,
      providers: [
        {
          provide: CAN_WHATSAPP_NOTIFICATION_OPTIONS,
          useValue: options ? options : {},
        },
        CanWhatsappNotificationService,
      ],
      exports: [CanWhatsappNotificationService],
    };
  }
}
