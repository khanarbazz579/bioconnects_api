import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { CanContextService } from '@can/common';
import { USER_BRAND_FILTER } from '../constants/user-brands.constant';

@Injectable()
export class UserBrandsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Get Entity Master Type
    const userBrandType: any = this.extractUserBrandType(context);
    const request = context.switchToHttp().getRequest<Request>();
    if (request && request['user'] && !request['user']['allBrandsAccess']) {
      if (request['user']['user_brands']) {
        const brandFilter = [];

        for (
          let index = 0;
          index < request['user']['user_brands'].length;
          index++
        ) {
          const userBrand = request['user']['user_brands'][index];
          const userBrandFilter = {};
          if (userBrand[userBrandType.ObjKey]) {
            userBrandFilter[userBrandType.dbKey] =
              userBrand[userBrandType.ObjKey];
            brandFilter.push(userBrandFilter);
          }
        }
        if (brandFilter.length) {
          if (request && request['query'] && request['query']['filter']) {
            const reqFilter = JSON.parse(request['query']['filter']);
            if (
              reqFilter &&
              reqFilter.where &&
              reqFilter['where']['and'] &&
              reqFilter['where']['and']['or']
            ) {
              reqFilter['where']['and']['or'] = [
                ...reqFilter['where']['and']['or'],
                ...brandFilter,
              ];
              request['query']['filter'] = JSON.stringify(reqFilter);
            } else if (
              reqFilter &&
              reqFilter.where &&
              reqFilter['where']['and']
            ) {
              reqFilter['where']['or'] = reqFilter['where']['or']
                ? [...reqFilter['where']['or'], ...brandFilter]
                : brandFilter;
              // delete reqFilter['where']['or']
              request['query']['filter'] = JSON.stringify(reqFilter);
              // //console.log("test ",request['query']['filter']);
            } else if (reqFilter && reqFilter.where) {
              reqFilter['where']['or'] = brandFilter;
              request['query']['filter'] = JSON.stringify(reqFilter);
            }
          } else if (request && request['query']) {
            request['query']['filter'] = JSON.stringify({
              where: { or: brandFilter },
            });
          }
        }
      }
    }

    // Return Response
    return next.handle();
  }

  private extractUserBrandType(context: ExecutionContext) {
    const reflector = CanContextService.getAppContext().get(Reflector);
    return reflector.get<any>(USER_BRAND_FILTER, context.getHandler());
  }
}
