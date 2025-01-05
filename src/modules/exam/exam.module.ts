import { Module } from '@nestjs/common';
import { ExamController } from './exam.controller';
import { ExamService } from './exam.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { AutomapperModule } from '@automapper/nestjs';
import { ExamProfile } from 'src/common/auto-mapper/auto-mapper-profiles';
import { Exam, Question, ExamQuestion, ExamStudent, QuestionStudent } from 'src/models';

@Module({
  imports: [
    SequelizeModule.forFeature([Exam, Question, ExamQuestion, ExamStudent, QuestionStudent]),
    AutomapperModule,
  ],
  controllers: [ExamController],
  providers: [ExamService, ExamProfile]
})
export class ExamModule {}
