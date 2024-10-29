import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class BlogsDto {

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  body: string;

  @IsNotEmpty()
  @IsString()
  status: string;
    
@IsOptional()
@IsNumber()
@ApiProperty()
readonly createdById: number;

@IsOptional()
@IsNumber()
@ApiProperty()
readonly updatedById: number;
}