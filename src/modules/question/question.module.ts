import { Module } from '@nestjs/common';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Question } from 'src/models/question.model';
import { AutomapperModule } from '@automapper/nestjs';
import { QuestionProfile } from 'src/common/auto-mapper/auto-mapper-profiles';

@Module({
  imports: [
    SequelizeModule.forFeature([Question]),
    AutomapperModule
  ],
  controllers: [QuestionController],
  providers: [QuestionService, QuestionProfile]
})
export class QuestionModule {}
