import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import queryString from 'query-string';
import { ApiService } from 'src/common/services/api/api.service';

@Injectable()
export class FacebookService {
  constructor(
    private configService: ConfigService,
    private apiService: ApiService,
  ) {}

  getLoginUrl() {
    const stringifiedParams = queryString.stringify({
      client_id: this.configService.get('FACEBOOK_APP_ID'),
      redirect_uri: this.configService.get('FACEBOOK_REDIRECT_URL'),
      scope: ['email', 'user_friends'].join(','), // comma seperated string
      response_type: 'code',
      auth_type: 'rerequest',
      display: 'popup',
    });
    const facebookLoginUrl = `https://www.facebook.com/v4.0/dialog/oauth?${stringifiedParams}`;
    return facebookLoginUrl;
  }

  async getLoginResponse(redirectionCode: string) {
    const params = {
      client_id: this.configService.get('FACEBOOK_APP_ID'),
      client_secret: this.configService.get('FACEBOOK_APP_SECRET'),
      redirect_uri: this.configService.get('FACEBOOK_REDIRECT_URL'),
      code: redirectionCode,
    };
    const { data } = await this.apiService.request<any>({
      url: `https://graph.facebook.com/v4.0/oauth/access_token`,
      method: 'GET',
      params,
    });
    return data;
  }

  async getUserProfile(accessToken: string) {
    const params = {
      fields: ['id', 'email', 'first_name', 'last_name'].join(','),
      access_token: accessToken,
    };
    const { data } = await this.apiService.request<any>({
      url: `https://graph.facebook.com/me`,
      method: 'GET',
      params,
    });
    return data;
  }
}
