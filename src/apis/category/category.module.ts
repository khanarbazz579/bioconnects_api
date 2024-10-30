import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryRepository } from './category.repository';
import { CategoryService } from './category.service';

@Module({
    imports: [],
    controllers: [CategoryController],
    providers: [CategoryRepository, CategoryService],
    exports: [CategoryService]
})
export class CategoryModule { }
