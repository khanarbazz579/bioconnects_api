import { BadRequestException, Injectable } from '@nestjs/common';
import { ApiService } from 'src/common/services/api/api.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MollyService {
  constructor(
    private apiService: ApiService,
    private configService: ConfigService,
  ) {}

  async callMollyApi(
    payload: any,
    path: string,
  ) {
    try {
      const data = {
          ...payload
      };
      const headers = {
        Authorization: `Bearer ${this.configService.get('MOLLY_API_TOKEN')}`,
        'x-app-id': this.configService.get('MOLLY_APP_ID'),
      };
      const url = `${this.configService.get('MOLLY_API_HOST')}/${path}`;

      const response = (await this.apiService.request({
        method: 'POST',
        url,
        data,
        headers,
      })) as any;

      return response;
    } catch (error) {
       console.error('MOLLY API CALL ERROR', JSON.stringify(error));
       if(error?.response?.data?.message){
        throw new BadRequestException('Request failed with status code 403');
       }
    }
  }
}
