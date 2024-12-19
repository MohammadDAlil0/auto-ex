import { Module } from '@nestjs/common';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Question } from 'src/models/question.model';
import { AutomapperModule } from '@automapper/nestjs';

@Module({
  imports: [
    SequelizeModule.forFeature([Question]),
    AutomapperModule
  ],
  controllers: [QuestionController],
  providers: [QuestionService]
})
export class QuestionModule {}
