import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CategoryDto {

    
@IsOptional()
@IsNumber()
@ApiProperty()
readonly createdById: number;

@IsOptional()
@IsNumber()
@ApiProperty()
readonly updatedById: number;
}