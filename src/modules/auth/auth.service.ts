import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/models/user.model';
import { CreateUserDto } from './dto/create-user.dto';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User) private readonly UserModel: typeof User,
        private readonly config: ConfigService,
        @InjectMapper() private readonly mapper: Mapper,
        private readonly jwt: JwtService
    ) {}

    async signup(createUserDto: CreateUserDto) {
      const hash = await argon.hash(createUserDto.password);
      // TO COMPLETE
      // const doc = this.mapper.map(createUserDto, CreateUserDto, User);
      // doc.hash = hash;
      // console.log('Test Auto Mapper');
      const user = await this.UserModel.create<User>({
          username: createUserDto.username,
          email: createUserDto.email,
          role: createUserDto.role,
          hash,
      });
      return this.signToken(user.id, user.email);
    }
    
    async signToken(userId: string, email: string): Promise<{accessToken: string}> {
      const payload = {
        sub: userId,
        email
      }
      const token = await this.jwt.signAsync(payload, {
        expiresIn: this.config.getOrThrow<string>('JWT_EXPIRES_IN'),
        secret: this.config.getOrThrow<string>('JWT_SECRET')
      });
      return {
        accessToken: token
      }
  }

}
