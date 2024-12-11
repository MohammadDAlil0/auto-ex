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
    const [numberOfAffectedRows, affectedRows] = await User.update<User>(
      { role: dto.role, roleChangedBy: curUser.id },
      {
        where: { id: userId },
        returning: true,
      }
    );

    if (!numberOfAffectedRows) {
      throw new NotFoundException('Invalid user ID');
    }

    const user =  this.mapper.map(affectedRows[0], User, CreateUserResponseDto);
    return user;
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
}
