import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
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
  bannedImage: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsArray()
  body: string;

  @IsNotEmpty()
  @IsString()
  status: 'pending' | 'accepted' | 'rejected';;
    
@IsOptional()
@IsNumber()
@ApiProperty()
readonly createdById: number;

@IsOptional()
@IsNumber()
@ApiProperty()
readonly updatedById: number;
}