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
import { SubscriptionsDto } from './subscriptions.dto';
import { SubscriptionsService } from './subscriptions.service';
import { ParseFilterPipe } from 'src/common/pipes/parse-filter.pipe';
import { FindOptions, CountOptions } from 'sequelize';

@Controller('subscriptions')
export class SubscriptionsController { 
    constructor(private subscriptionsService: SubscriptionsService) {}

    @Post()
    async create(@Body(ValidationPipe) subscriptionsDto: SubscriptionsDto) {
        return this.subscriptionsService.create(subscriptionsDto);
    }

    @Get()
    async findAll(@Query('filter', ParseFilterPipe) filter: FindOptions) {
        return this.subscriptionsService.findAll(filter);
    }

    @Get('count')
    async count(@Query('filter', ParseFilterPipe) filter: CountOptions) {
        return this.subscriptionsService.count(filter);
    }

    @Get(':id')
    async findById(@Param('id', ParseIntPipe) id: number) {
        return this.subscriptionsService.findById(id);
    }

    @Patch(':id')
    async updateById(
        @Param('id', ParseIntPipe) id: number,
        @Body(new ValidationPipe({ skipMissingProperties: true })) subscriptionsDto: SubscriptionsDto,
    ) {
        return this.subscriptionsService.updateById(id, subscriptionsDto);
    }
}