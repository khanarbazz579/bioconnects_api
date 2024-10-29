import { Injectable } from '@nestjs/common';
import { map, retry, catchError } from 'rxjs/operators';
import { CanApiOptions } from './api.type';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, throwError } from 'rxjs';

@Injectable()
export class ApiService {
  constructor(private httpService: HttpService) {}

  async request<T>(option: CanApiOptions, retryCount: number = 1): Promise<T> {
    return firstValueFrom(
      this.httpService.request<T>(option).pipe(
        map((res) => res.data),
        retry(retryCount),
        catchError((error) => {
          // Handle the error appropriately
          console.error('Request failed', error);
          return throwError(() => new Error('Request failed' + error?.data?.message));
        }),
      ),
    );
  }
}
