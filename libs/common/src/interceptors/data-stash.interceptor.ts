import {
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable, EMPTY } from 'rxjs';
import { CanContextService, config, DATA_STASH } from '..';
import { Reflector } from '@nestjs/core';
import { DataStashService } from '../services/data-stash/data-stash.service';

@Injectable()
export class DataStashInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<any>();
    const config: any = this.extractExportQuery(context);
    const dataStashService =
      CanContextService.getAppContext().get(DataStashService);
    request['dataStashId'] = new Date().getTime().toString();
    request['dataStashConfig'] = config;
    return next.handle().pipe(
      map(async res => {
        try {
          dataStashService.dataStash(request, res, config);
        } catch (error) {
          console.log(error);
        }
        return res;
      }),
    );
  }

  private extractExportQuery(context: ExecutionContext) {
    const reflector = CanContextService.getAppContext().get(Reflector);
    return reflector.get<string>(config, context.getHandler());
  }
}
