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
import { BlogsDto } from './blogs.dto';
import { BlogsService } from './blogs.service';
import { ParseFilterPipe } from 'src/common/pipes/parse-filter.pipe';
import { FindOptions, CountOptions } from 'sequelize';

@Controller('blogs')
export class BlogsController { 
    constructor(private blogsService: BlogsService) {}

    @Post()
    async create(@Body(ValidationPipe) blogsDto: BlogsDto) {
        return this.blogsService.create(blogsDto);
    }

    @Get()
    async findAll(@Query('filter', ParseFilterPipe) filter: FindOptions) {
        return this.blogsService.findAll(filter);
    }

    @Get('count')
    async count(@Query('filter', ParseFilterPipe) filter: CountOptions) {
        return this.blogsService.count(filter);
    }

    @Get(':id')
    async findById(@Param('id', ParseIntPipe) id: number) {
        return this.blogsService.findById(id);
    }

    @Patch(':id')
    async updateById(
        @Param('id', ParseIntPipe) id: number,
        @Body(new ValidationPipe({ skipMissingProperties: true })) blogsDto: BlogsDto,
    ) {
        return this.blogsService.updateById(id, blogsDto);
    }
}