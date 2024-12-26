import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AutomapperModule } from '@automapper/nestjs';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/models/user.model';
import { ExamStudent } from 'src/models/exam-student.model';
import { UserProfile } from 'src/common/auto-mapper/auto-mapper-profiles';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    AutomapperModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserProfile]
})
export class UserModule {}
