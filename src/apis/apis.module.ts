import { Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { FileUploadModule } from './file-upload/file-upload.module';import { BlogsModule } from 'src/apis/blogs/blogs.module';import { CommentsModule } from 'src/apis/comments/comments.module';import { CategoryModule } from 'src/apis/category/category.module';import { SubscriptionsModule } from 'src/apis/subscriptions/subscriptions.module';






@Module({
  imports: [
    SharedModule,
    FileUploadModule, BlogsModule, CommentsModule, CategoryModule, SubscriptionsModule],
})
export class ApisModule {}
