import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEmail,
  MinLength,
  MaxLength,
  IsOptional,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { Status } from 'src/common/enums/status.enum';

enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  UNISEX = 'unisex',
}

export class UserDto {
  @IsNotEmpty()
  @ApiProperty()
   firstName: string;

  @IsOptional()
  @ApiProperty()
   middleName: string;

  @IsNotEmpty()
  @ApiProperty()
   lastName: string;

  @IsOptional()
  readonly name: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  readonly email: string;

  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(10)
  @ApiProperty()
  readonly mobile: string;

  @IsOptional()
  readonly loginInfo: string[];

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  @ApiProperty()
  readonly password: string;

  @IsOptional()
  readonly resetPasswordOtpExpiresIn: string;

  @IsOptional()
  readonly resetPasswordOtp: string;

  @IsOptional()
  readonly loginOtp: string;

  @IsOptional()
  @IsEnum(Gender)
  @ApiProperty()
  readonly gender: string;

  @IsOptional()
  @IsEnum(Status)
  @ApiProperty()
  readonly status: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  readonly createdById: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  readonly updatedById: number;
}
