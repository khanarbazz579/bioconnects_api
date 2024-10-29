import { CanTextParserService } from 'libs/common/src';
import { Inject, Injectable } from '@nestjs/common';
import { CanEmailNotificationService } from './email/email.service';
import { CanEmailOptions } from './email/email.type';
import { CAN_NOTIFICATION_OPTIONS } from './notification.constant';
import {
  CanNotificationOptions,
  CanNotificationOptionsItem,
  CanNotificationSendOptions,
} from './notification.type';
import { CanSmsNotificationService } from './sms/sms.service';
import { CanSmsOptions } from './sms/sms.type';
import { CanWhatsappNotificationService } from './whatsapp/whatsapp.service';
import { CanWhatsappOptions } from './whatsapp/whatsapp.type';

@Injectable()
export class CanNotificationService {
  constructor(
    @Inject(CAN_NOTIFICATION_OPTIONS)
    private notificationOptions: CanNotificationOptions[],
    private smsNotificationService: CanSmsNotificationService,
    private emailNotificationService: CanEmailNotificationService,
    private whatsappNotificationService: CanWhatsappNotificationService,
    private textParserService: CanTextParserService,
  ) {}

  async sendNotification(options: CanNotificationSendOptions) {
    const config = this.findTriggerData<CanNotificationOptionsItem>(
      options.category,
      options.trigger,
    );
    if (options.sms && config.sms) {
      const data = options.data
        ? { ...(config.data ? config.data : {}), ...options.data }
        : {};
      const smsConfig = config.sms;
      const mappedSmsConfig =
        this.textParserService.replaceKeyWithValueInDynamicTextOrJSON<
          CanSmsOptions[]
        >({ ...data }, JSON.stringify(smsConfig));
      mappedSmsConfig.forEach(msc => {
        msc.mobile = options.sms.mobile;
      });
      this.smsNotificationService.sendSms(mappedSmsConfig);
    }
    if (options.email && config.email) {
      const data = options.data
        ? { ...(config.data ? config.data : {}), ...options.data }
        : {};
      const emailConfig = config.email;
      let mappedEmailConfig = [...emailConfig];
      mappedEmailConfig.forEach(mec => {
        mec.to = options.email.to;
        if (mec.template) {
          mec.template.data = {
            ...data,
          };
        }
        if (mec.channel === 'api' && mec.emailApiGateway === 'sendinblue') {
          mec.api.data['to'] = options.email.reciever;
          mec.api.data['subject'] = mec.subject;
          mec.api.data['htmlContent'] = data.body;
        }
        if (mec.channel === 'api' && mec.emailApiGateway === 'default') {
          mec.api.data['toEmails'] = options.email.to;
          mec.api.data['subject'] = mec.subject;
          mec.api.data['params'] = options.data;
        }
      });
      mappedEmailConfig =
        this.textParserService.replaceKeyWithValueInDynamicTextOrJSON<
          CanEmailOptions[]
        >({ ...data }, JSON.stringify(emailConfig));

      this.emailNotificationService.sendEmail(mappedEmailConfig);
    }
    if (options.whatsapp && config.whatsapp) {
      const data = options.data
        ? { ...(config.data ? config.data : {}), ...options.data }
        : {};

      const whatsappConfig = config.whatsapp;
      const mappedWhatsappConfig =
        this.textParserService.replaceKeyWithValueInDynamicTextOrJSON<
          CanWhatsappOptions[]
        >({ ...data }, JSON.stringify(whatsappConfig));
      mappedWhatsappConfig.forEach(msc => {
        msc.mobile = options.whatsapp.mobile;
        msc.data = data;
        msc.triggerName = options.trigger.toLowerCase();
      });
      this.whatsappNotificationService.sendMessage(mappedWhatsappConfig);
    }
  }

  findTriggerData<T>(
    category: string,
    trigger: string,
    type?: 'sms' | 'email' | 'push' | 'whatsapp',
  ): T {
    const categories = this.notificationOptions.find(
      option => option.category === category,
    );
    const config = categories.items.find(item => item.trigger.name === trigger);
    if (type) {
      return config[type] as any;
    }
    return config as any;
  }
}
