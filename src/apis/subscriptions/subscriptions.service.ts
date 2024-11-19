import { Injectable, Inject } from '@nestjs/common';
import { SUBSCRIPTIONS_REPOSITORY } from './subscriptions.repository';
import { Subscriptions } from './subscriptions.model';
import { SubscriptionsDto } from './subscriptions.dto';
import { FindOptions, CountOptions } from 'sequelize/types';

@Injectable()
export class SubscriptionsService {
  constructor(
    @Inject(SUBSCRIPTIONS_REPOSITORY) private readonly subscriptionsRepository: typeof Subscriptions
  ) {}

  async create(subscriptions: SubscriptionsDto): Promise<Subscriptions> {
    return this.subscriptionsRepository.create<Subscriptions>(subscriptions);
  }

  async findAll(filter: FindOptions) {
    return this.subscriptionsRepository.findAll(filter);
  }

  async findById(id: number): Promise<Subscriptions> {
    return this.subscriptionsRepository.findByPk(id);
  }

  async count(filter: CountOptions) {
    const totalCount = await this.subscriptionsRepository.count(filter);
    return { count: totalCount };
  }

  async updateById(id: number, data: any) {
    return this.subscriptionsRepository.update(data, { where: { id } });
  }

  async upsert(data: object) {
    return this.subscriptionsRepository.upsert(data);
  }
}
