import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CommentsDto {

  @IsNotEmpty()
  @IsString()
  comment: string;

@IsOptional()
@IsNumber()
@ApiProperty()
readonly blogId: number;

  
@IsOptional()
@IsNumber()
@ApiProperty()
readonly createdById: number;

@IsOptional()
@IsNumber()
@ApiProperty()
readonly updatedById: number;
}