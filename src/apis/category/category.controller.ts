import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Patch,
  Param,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import { CategoryDto } from './category.dto';
import { CategoryService } from './category.service';
import { ParseFilterPipe } from 'src/common/pipes/parse-filter.pipe';
import { FindOptions, CountOptions } from 'sequelize';

@Controller('categories')
export class CategoryController { 
    constructor(private categoryService: CategoryService) {}

    @Post()
    async create(@Body(ValidationPipe) categoryDto: CategoryDto) {
        return this.categoryService.create(categoryDto);
    }

    @Get()
    async findAll(@Query('filter', ParseFilterPipe) filter: FindOptions) {
        return this.categoryService.findAll(filter);
    }

    @Get('count')
    async count(@Query('filter', ParseFilterPipe) filter: CountOptions) {
        return this.categoryService.count(filter);
    }

    @Get(':id')
    async findById(@Param('id', ParseIntPipe) id: number) {
        return this.categoryService.findById(id);
    }

    @Patch(':id')
    async updateById(
        @Param('id', ParseIntPipe) id: number,
        @Body(new ValidationPipe({ skipMissingProperties: true })) categoryDto: CategoryDto,
    ) {
        return this.categoryService.updateById(id, categoryDto);
    }
}