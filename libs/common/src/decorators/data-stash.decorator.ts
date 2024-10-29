import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';
import { DATA_STASH, config } from '../constants';
import { DataStashInterceptor } from '../interceptors/data-stash.interceptor';

export function DataStash(data): any {
  return applyDecorators(
    SetMetadata(config, data),
    UseInterceptors(DataStashInterceptor),
  );
}
