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

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User) private readonly UserModel: typeof User,
        private readonly config: ConfigService,
        @InjectMapper() private readonly mapper: Mapper,
        private readonly jwt: JwtService
    ) {}

    async signup(createUserDto: CreateUserDto) {
      const user = await this.UserModel.create<User>({ ...createUserDto, hash: createUserDto.password });
      const access_token = await this.getToken(user.id, user.email); 
      return {
        ...user,
        access_token
      }
    }

    
  async login(dto: LoginDto) {
    const user = await this.UserModel.findOne({
      where: {
        email: dto.email
      }
    });

    if (!user) {
      throw new NotFoundException('User not found!');
    }
        
    const userMathPassword = await argon.verify(user.hash, dto.password);

    if (!userMathPassword) {
      throw new BadRequestException('Invalid Password');
    }

    const access_token = await this.getToken(user.id, user.email); 
    return {
      ...user,
      access_token
    }
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
