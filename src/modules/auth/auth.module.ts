import { AutomapperModule } from "@automapper/nestjs";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ScheduleModule } from "@nestjs/schedule";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "src/models";
import { AuthController } from "./auth.controller";
import { JWTStrategy } from "src/common/stratgies/jwt.strategy";
import { AuthService } from "./auth.service";
import { UserProfile } from "src/common/auto-mapper/auto-mapper-profiles";

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
