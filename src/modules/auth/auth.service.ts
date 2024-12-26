import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/models/user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { LoginDto } from './dto/login.dto';
import { CreateUserResponseDto } from './dto/create-user.response.dto';
import { UUID } from 'crypto';
import { ChangeRoleDto } from './dto/change-role.dto';
import { Role } from 'src/types/enums';
import { Op } from 'sequelize';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User) private readonly UserModel: typeof User,
        private readonly config: ConfigService,
        @InjectMapper() private readonly mapper: Mapper,
        private readonly jwt: JwtService
    ) {}

    async signup(createUserDto: CreateUserDto) {
      const curUser = await this.UserModel.create<User>({ ...createUserDto, hash: createUserDto.password });
      const user =  this.mapper.map(curUser, User, CreateUserResponseDto);
      const access_token = await this.getToken(user.id, user.email);
      return {
        ...user,
        access_token
      }
    }
  
  async login(dto: LoginDto) {
    const curUser = await this.UserModel.findOne({
      where: {
        email: dto.email
      }
    });
    
    if (!curUser) {
      throw new NotFoundException('User not found!');
    }
    
    const userMathPassword = await argon.verify(curUser.hash, dto.password);
    
    if (!userMathPassword) {
      throw new BadRequestException('Invalid Password');
    }
    
    const user =  this.mapper.map(curUser, User, CreateUserResponseDto);
    const access_token = await this.getToken(user.id, user.email); 
    return {
      ...user,
      access_token
    }
  }

  async changeRole(curUser: User, userId: string, dto: ChangeRoleDto) {
    if (curUser.id == userId) {
      throw new BadRequestException("You can't change your role")
    }

    const updatedUser = await User.findByPk(userId);
    if (!updatedUser) {
      throw new NotFoundException('Invalid user ID');
    }
 
    updatedUser.role = dto.role;
    updatedUser.roleChangedBy = userId;
    await updatedUser.save();
    
    return this.mapper.map(updatedUser, User, CreateUserResponseDto);
  }
    
  async getToken(userId: string, email: string): Promise<string> {
    const payload = {
      sub: userId,
      email
    }
    const token = await this.jwt.signAsync(payload, {
      expiresIn: this.config.getOrThrow<string>('JWT_EXPIRES_IN'),
      secret: this.config.getOrThrow<string>('JWT_SECRET')
    });
    return token;
  }

  @Cron('0 0 * * *')
  async deleteOldUnacceptedUser(): Promise<void> {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - parseInt(this.config.getOrThrow<string>('MIN_DAYS_TO_CLEANUP'), 10));

    await this.UserModel.destroy({
        where: {
            role: Role.GHOST,
            createdAt: {
                [Op.lt]: thresholdDate
            }
        }
    });
  }
}
