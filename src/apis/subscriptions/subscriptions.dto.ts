import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class SubscriptionsDto {

@IsOptional()
@IsString()
@ApiProperty()
readonly startDate: string;

@IsOptional()
@IsString()
@ApiProperty()
readonly endDate: string;

@IsOptional()
@IsString()
@ApiProperty()
readonly email: string;
    
@IsOptional()
@IsNumber()
@ApiProperty()
readonly createdById: number;

@IsOptional()
@IsNumber()
@ApiProperty()
readonly updatedById: number;
}