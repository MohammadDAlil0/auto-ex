import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "src/models";
import { ChangeRoleDto, CreateUserDto, CreateUserResponseDto, LoginDto } from "./dto";
import * as argon from "argon2";
import { Cron } from "@nestjs/schedule";
import { Role } from "src/types/enums";
import { Op } from "sequelize";
import { DataBaseService } from "src/providers/database/database.service";

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User) private readonly UserModel: typeof User,
        private readonly config: ConfigService,
        @InjectMapper() private readonly mapper: Mapper,
        private readonly jwt: JwtService,
        private readonly dataBaseService: DataBaseService
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
    const curUser: User = await this.dataBaseService.findOneOrThrow(this.UserModel, {
      where: {
        email: dto.email
      }
    });
    
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

  async changeRole(userId: string, dto: ChangeRoleDto) {
    const updatedUser: User = await this.dataBaseService.findByPkOrThrow(this.UserModel, userId);
 
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
