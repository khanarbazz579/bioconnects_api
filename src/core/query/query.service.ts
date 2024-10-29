import { Inject, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import {
  SEQUALIZE_DATABASE_PROVIDER,
} from 'src/core/constants/app.constant';

@Injectable()
export class QueryService {
  constructor(
    @Inject(SEQUALIZE_DATABASE_PROVIDER)
    private sequalize: Sequelize
  ) {}

  async executeQuery<T>(
    query: string,
    options?,
  ): Promise<T> {
    if(!options){
      options = { type: 'SELECT', useMaster: false };
    }
    const response: any = await this.sequalize.query(query, options);
    if (options && options.type === 'SELECT' && options.useMaster === false) {
      return response;
    } else {
      return response.length ? response[0] : response;
    }
  }


  async getTransactions() {
    return this.sequalize.transaction();
  }


}
