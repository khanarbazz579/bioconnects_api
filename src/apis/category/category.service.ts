import { Injectable, Inject } from '@nestjs/common';
import { CATEGORY_REPOSITORY } from './category.repository';
import { Category } from './category.model';
import { CategoryDto } from './category.dto';
import { FindOptions, CountOptions } from 'sequelize/types';

@Injectable()
export class CategoryService {
  constructor(
    @Inject(CATEGORY_REPOSITORY) private readonly categoryRepository: typeof Category
  ) {}

  async create(category: CategoryDto): Promise<Category> {
    return this.categoryRepository.create<Category>(category);
  }

  async findAll(filter: FindOptions) {
    return this.categoryRepository.findAll(filter);
  }

  async findById(id: number): Promise<Category> {
    return this.categoryRepository.findByPk(id);
  }

  async count(filter: CountOptions) {
    const totalCount = await this.categoryRepository.count(filter);
    return { count: totalCount };
  }

  async updateById(id: number, data: any) {
    return this.categoryRepository.update(data, { where: { id } });
  }

  async upsert(data: object) {
    return this.categoryRepository.upsert(data);
  }
}
