import {
  ExecutionContext,
  Injectable,
  NestInterceptor,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as Sentry from '@sentry/core';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const environment = this.configService.get('NODE_ENV');
    if (environment === 'production') {
      return next.handle().pipe(
        tap(null, exception => {
          // CAPTURE ERROR IN SENTRY
          Sentry.captureException(exception);
        }),
      );
    } else {
      return next.handle();
    }
  }
}
