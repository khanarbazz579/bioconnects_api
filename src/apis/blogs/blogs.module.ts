import { Module } from '@nestjs/common';
import { BlogsController } from './blogs.controller';
import { BlogsRepository } from './blogs.repository';
import { BlogsService } from './blogs.service';

@Module({
    imports: [],
    controllers: [BlogsController],
    providers: [BlogsRepository, BlogsService],
    exports: [BlogsService]
})
export class BlogsModule { }
