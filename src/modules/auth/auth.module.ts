import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/models/user.model';
import { JwtModule } from '@nestjs/jwt';
import { AutomapperModule } from '@automapper/nestjs';
import { UserProfile } from 'src/common/auto-mapper/auto-mapper-profiles';
import { JWTStrategy } from 'src/common/stratgies/jwt.strategy';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    JwtModule.register({}),
    AutomapperModule,
    ScheduleModule.forRoot()
  ],
  controllers: [AuthController],
  providers: [JWTStrategy, AuthService, UserProfile] 
})
export class AuthModule {}
