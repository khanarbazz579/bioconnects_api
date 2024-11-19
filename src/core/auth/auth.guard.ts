import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { excludedRoutes } from '../../excluded.routes';
import { Query } from 'src/common/services/query/query';
import { CanContextService } from '@can/common';
import { Request } from 'express';
import { IncomingHttpHeaders } from 'http';
import { ConfigService } from '@nestjs/config';
import { read } from 'fs';
import { HttpService } from '@nestjs/axios';
import { QueryService } from '../query/query.service';

@Injectable()
export class CanAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    try {
      const request = context.switchToHttp().getRequest<Request>();
      if (excludedRoutes.includes(request.url.split('?')[0])) {
        return true;
      }
      const appContext = CanContextService.getAppContext();
      const authService = appContext.get(AuthService);
      const queryService = appContext.get(QueryService);
      const token = this.extractAuthorizationHeader(request.headers);

      if (!token) {
        //console.log('request auth token not found');        
        return false;
      }
      const isBearerToken = await this.validateTokenAndType(
        token,
        'Bearer',
        authService,
      );
      if (!isBearerToken) {
        //console.log('request auth token is not of bearer type'); 
        return false;
      }
      const decodedValue: any = await this.extractTokenValue(
        authService,
        token,
      );
      if (!decodedValue) {
        //console.log('request auth token could not be decoded'); 
        return false;
      }

      // const validateUser: any = await this.validateRequest(
      //   appContext,
      //   token,
      //   appId,
      // );
      const user = await queryService.executeQuery<any[]>(
        Query.getActiveUserAndPermissions(decodedValue.id),
      );
      if (!user.length) {
        return false;
      }
      request['user'] = user[0];
      request['user'] = {
        email: decodedValue.email,
        ...user[0]
        // // ...validateUser,
        // permissions: user[0]['permissions'],
        // roles: user[0]['roles']
      };
      request['token'] = { token: token, type: decodedValue.type };
      /**
       * Add Created By And Updated By to the Request Body
       */
      if (request['user'] && request['user'].userId) {
        if (request.method.toUpperCase() === 'POST') {
          request.body = {
            ...request.body,
            createdBy: request['user'].email,
            updatedBy: request['user'].email,
          };
          return true;
        }
        if (
          request.method.toUpperCase() === 'PATCH' ||
          request.method.toUpperCase() === 'PUT'
        ) {
          request.body = {
            ...request.body,
            updatedBy: request['user'].email,
          };
          return true;
        }
      }
      return true;
    } catch (error) {
      //console.log(`request auth token error-${error.message}`); 
      return false;
    }
  }

  private validateRequest(appContext, token, appId) {
    return new Promise<void>(async (resolve, reject) => {
      const httpService = appContext.get(HttpService);
      const configService = appContext.get(ConfigService);
      const url = `${configService.get(
        'PASSPORT_URL',
      )}/users/validate/${appId}`;
      try {
        const res = await httpService
          .get(url, { headers: { Authorization: `${token}` } })
          .toPromise();
        if (res.data && res.data.data) {
          resolve(res.data && res.data.data);
        } else {
          //console.log('user could not be validated due to missing data'); 
          reject('Forbidden resource');
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  private extractAuthorizationHeader(
    headers: IncomingHttpHeaders,
  ): string | null {
    if ('authorization' in headers) {
      return headers['authorization'];
    }
    return null;
  }

  private async validateTokenAndType(
    token: string,
    type: string,
    authService: AuthService,
  ) {
    if (!token || !type) {
      return false;
    }
    const splittedToken = token.split(' ');
    if (splittedToken.length != 2) {
      return false;
    }
    if (splittedToken[0] !== type) {
      return false;
    }
    // const isValidToken = await authService.validateToken(splittedToken[1]);
    // if (!isValidToken) {
    //   return false;
    // }
    return true;
  }

  private extractTokenValue(authService: AuthService, token: string) {
    const decoded = authService.decodeToken(token.split(' ')[1]);
    return decoded;
  }
}
