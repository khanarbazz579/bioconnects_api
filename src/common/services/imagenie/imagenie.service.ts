import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiService } from 'src/common/services/api/api.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ImagenieService {
  constructor(
    private apiService: ApiService,
    private configService: ConfigService,
  ) {}

  async callImagenieApi(data: any, header: any, endpoint: string) {
    try {
      const headers = {
        'x-api-key': this.configService.get('IMAGENIE_SECRET_KEY'),
        ...header,
      };
      const url = this.configService.get('IMAGENIE_API_HOST') + `${endpoint}`;

      const response = (await this.apiService.request({
        method: 'POST',
        url,
        data,
        headers,
      })) as any;

      return response;

    } catch (error) {
      throw new InternalServerErrorException(
        'Imagenie API CALL ERROR',
        JSON.stringify(error),
      );
    }
  }
}
