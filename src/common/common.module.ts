import { CanAwsModule } from '@can/aws';
import { Module } from '@nestjs/common';
import { OtpService } from './services/otp/otp.service';
import { SmsService } from './services/sms/sms.service';
import { ApiService } from './services/api/api.service';
import { CsvParserService } from './services/csv-parser/csv-parser.service';
import { HttpModule } from '@nestjs/axios';
import { NexusService } from './services/nexus/nexus.service';
import { ImagenieService } from './services/imagenie/imagenie.service';
import { TriggerEventService } from './services/events/trigger-event.service';
import { MollyService } from './services/molly/molly.service';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    CanAwsModule.forRoot({
      profile: process.env.AWS_PROFILE,
      region: process.env.AWS_REGION,
    }),
    HttpModule,
    EventEmitterModule.forRoot({
      ignoreErrors: false,
    }),
    
  ],
  providers: [OtpService, SmsService, ApiService, CsvParserService,NexusService,ImagenieService, TriggerEventService, MollyService],
  exports: [CanAwsModule, OtpService, SmsService, ApiService, CsvParserService,NexusService,ImagenieService, TriggerEventService, MollyService],
})
export class CommonModule {}
