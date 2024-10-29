import { Blogs } from './blogs.model';

export const BLOGS_REPOSITORY = 'BLOGS_REPOSITORY';

export const BlogsRepository = {
  provide: BLOGS_REPOSITORY,
  useValue: Blogs,
};
