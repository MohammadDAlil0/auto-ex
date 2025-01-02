import { AutomapperModule } from "@automapper/nestjs";
import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "src/models";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserProfile } from "src/common/auto-mapper/auto-mapper-profiles";

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    AutomapperModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserProfile]
})
export class UserModule {}
