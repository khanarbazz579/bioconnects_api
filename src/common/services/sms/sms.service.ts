import { CanAwsService } from 'libs/aws/src';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SMSParams } from './sms.type';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class SmsService {
  constructor(
    private awsService: CanAwsService,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async sendSms(params: SMSParams) {
    if (!params.type) {
      params.type = 'sms';
    }
    if (params.type === 'sms') {
      if (params.route === 'aws') {
        return this.awsService.sendSMSThroughSNS({
          PhoneNumber: `+91${params.mobile}`,
          Message: params.message,
        });
      }
      return this.sendSmsUsingApi(params.mobile, params.message);
    }

    if (params.type === 'otp') {
      if (params.route === 'aws') {
        return this.awsService.sendSMSThroughSNS({
          PhoneNumber: `+91${params.mobile}`,
          Message: params.message,
        });
      }
      return this.sendOtpUsingApi(params.mobile, params.message);
    }
  }

  private sendSmsUsingApi(mobile: string, message: string) {
    const params = {
      senderid: this.configService.get('SMS_SENDERID'),
      password: this.configService.get('SMS_PASSWORD'),
      Text: message,
      To: mobile,
      feedid: this.configService.get('SMS_FEEDID'),
      username: this.configService.get('SMS_USERNAME'),
    };
    const url = `${this.configService.get('SMS_URL')}`;
    return this.httpService
      .get(url, { params })
      .toPromise()
      .then(res => {
        //console.log('res');
      })
      .catch(error => {
        //console.log('error');
      });
  }

  private sendOtpUsingApi(mobile: string, message: string) {
    const params = {
      invisible: this.configService.get('OTP_INVISIBLE'),
      authkey: this.configService.get('OTP_AUTH_KEY'),
      otp: message.split(' ')[0].trim(),
      mobile: mobile,
      template_id: this.configService.get('OTP_TEMPLATE_ID'),
      sender: this.configService.get('OTP_SENDER_ID'),
    };
    const url = `${this.configService.get('OTP_BASE_URL')}/api/v5/otp`;
    return this.httpService.get(url, { params }).toPromise();
  }
}
