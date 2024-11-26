import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/models/user.model';
import { CreateUserDto } from './dto/create-user.dto';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User) private readonly UserModel: typeof User,
        private readonly config: ConfigService
    ) {}

    async signup(createUserDto: CreateUserDto) {
        const hash = await argon.hash(createUserDto.password);
        const user = await this.UserModel.create<User>({
            username: createUserDto.username,
            email: createUserDto.email,
            hash,
            role: createUserDto.role
        });
        return this.signToken(user.id, user.email);
    }
    
    async signToken(userId: string, email: string): Promise<{accessToken: string}> {
        const payload = {
          sub: userId,
          email
        }
        const token = await this.jwt.signAsync(payload, {
          expiresIn: '15d',
          secret: this.config.getOrThrow<string>('JWT_SECRET')
        });
        return {
          accessToken: token
        }
    }

}
