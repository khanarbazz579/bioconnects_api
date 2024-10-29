import { Injectable, Inject } from '@nestjs/common';
import { BLOGS_REPOSITORY } from './blogs.repository';
import { Blogs } from './blogs.model';
import { BlogsDto } from './blogs.dto';
import { FindOptions, CountOptions } from 'sequelize/types';

@Injectable()
export class BlogsService {
  constructor(
    @Inject(BLOGS_REPOSITORY) private readonly blogsRepository: typeof Blogs
  ) {}

  async create(blogs: BlogsDto): Promise<Blogs> {
    return this.blogsRepository.create<Blogs>(blogs);
  }

  async findAll(filter: FindOptions) {
    return this.blogsRepository.findAll(filter);
  }

  async findById(id: number): Promise<Blogs> {
    return this.blogsRepository.findByPk(id);
  }

  async count(filter: CountOptions) {
    const totalCount = await this.blogsRepository.count(filter);
    return { count: totalCount };
  }

  async updateById(id: number, data: any) {
    return this.blogsRepository.update(data, { where: { id } });
  }

  async upsert(data: object) {
    return this.blogsRepository.upsert(data);
  }
}
