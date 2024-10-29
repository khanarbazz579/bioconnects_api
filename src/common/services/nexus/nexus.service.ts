import { BadRequestException, Injectable } from '@nestjs/common';
import { ApiService } from 'src/common/services/api/api.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NexusService {
  constructor(
    private apiService: ApiService,
    private configService: ConfigService,
  ) {}

  async callNexusApi(
    serviceName: string,
    actionName: string,
    payload: any,
    nexusType: string,
  ) {
    try {
      const data = {
        serviceName,
        actionName,
        nexusType,
        dataForService: {
          ...payload,
        },
      };
      const headers = {
        Authorization: `Bearer ${this.configService.get('NEXUS_API_TOKEN')}`,
        'x-app-id': this.configService.get('NEXUS_APP_ID'),
      };
      const url = this.configService.get('NEXUS_API_HOST') + '/v1/nexus';

      //console.log('Nexus api call - ', JSON.stringify(data));

      const response = (await this.apiService.request({
        method: 'POST',
        url,
        data,
        headers,
      })) as any;

      return response;
    } catch (error) {
       console.error('NEXUS API CALL ERROR', JSON.stringify(error));
       if(error?.response?.data?.message){
        throw new BadRequestException('Request failed with status code 403');
       }
    }
  }
}
