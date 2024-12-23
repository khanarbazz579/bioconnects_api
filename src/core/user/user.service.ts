import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { USER_REPOSITORY } from './user.repository';
import { User } from './user.model';
import { UserDto } from './user.dto';
import { FindOptions, CountOptions, Optional } from 'sequelize';
import { CanLogger } from '../logger/logger.service';
import {
  excludePropertyFromFind,
  excludePropertyFromModel,
} from '../../common/utils/exclude';
import { hashPassword } from '../../common/utils/bcrypt';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
    private canLogger: CanLogger,
  ) {
    // Initialize Logger
    // this.canLogger.setContext('UserService');
  }

  async create(user: UserDto): Promise<UserDto> {
    if (user.name) {
      user.firstName = user.name.split(' ')[0];
      user.middleName =
        user.name.split(' ').length > 2 ? user.name.split(' ')[1] : '';
      user.lastName =
        user.name.split(' ').length > 1
          ? user.name.split(' ').length > 2
            ? user.name.split(' ')[2]
            : user.name.split(' ')[1]
          : '';
    }
    return excludePropertyFromModel<User, UserDto>(
      await this.userRepository.create(<any>user),
      ['password', 'loginOtp', 'resetPasswordOtpExpiresIn', 'resetPasswordOtp'],
    );
  }

  async findAll(filter: FindOptions) {
    return this.userRepository.findAll(
      excludePropertyFromFind(filter, [
        'loginInfo',
        'password',
        'loginOtp',
        'resetPasswordOtpExpiresIn',
        'resetPasswordOtp',
      ]),
    );
  }

  async findOne(filter: FindOptions) {
    return this.userRepository.findOne(filter);
  }

  async findById(id: number): Promise<UserDto> {
    return excludePropertyFromModel<User, UserDto>(
      await this.userRepository.findByPk(id),
      ['password', 'resetPasswordExpiresIn', 'resetPasswordToken'],
    );
  }

  async count(filter: CountOptions) {
    const totalCount = await this.userRepository.count(filter);
    return { count: totalCount };
  }

  async updateById(id: number, userDto: Partial<UserDto>): Promise<UserDto> {
    const user = await this.findOne({ where: { id: id } });
    if (!user) {
      throw new NotFoundException();
    }
    const clonedUserDto = { ...userDto };
    if (clonedUserDto.password) {
      clonedUserDto.password = await hashPassword(userDto.password);
    }
    return excludePropertyFromModel<User, UserDto>(
      await user.update(<any>clonedUserDto, { where: { id } }),
      ['password', 'resetPasswordExpiresIn', 'resetPasswordToken'],
    );
  }

  async upsert(userDto: UserDto) {
    return this.userRepository.upsert(<any>userDto);
  }
}
