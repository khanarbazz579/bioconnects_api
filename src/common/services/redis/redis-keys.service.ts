import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CanRedisKeysService {
  private env: string = this.configService.get('REDIS_ENV');
  private app: string = this.configService.get('APP');
  constructor(private configService: ConfigService) {}

  cronRedisKey(cronName: string) {
    return `gb:${this.env}:active-cron:${this.app}:${cronName}`;
  }

  getCredentialKey(entity: string, marketplace: string, channelCode: string) {
    return `gb:prod:entity:${entity}:marketplace:${marketplace}:channel:${channelCode}:credentials`;
  }

  getBrandNamesKey(){
    return `gb:${this.env}:master:brands`
  }
}
