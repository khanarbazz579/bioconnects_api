import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';
import { USER_BRAND_FILTER } from '../constants/user-brands.constant';
import { UserBrandsInterceptor } from '../interceptors/user-brands.interceptor';

export function UserBrandFilter(key: any): any {
  return applyDecorators(
    SetMetadata(USER_BRAND_FILTER, key),
    UseInterceptors(UserBrandsInterceptor),
  );
}
