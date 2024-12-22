import { Module } from '@nestjs/common';
import { ExamController } from './exam.controller';
import { ExamService } from './exam.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { AutomapperModule } from '@automapper/nestjs';
import { Exam } from 'src/models/exam.model';
import { ExamProfile } from 'src/common/auto-mapper/auto-mapper-profiles';
import { ExamQuestion } from 'src/models/exam-question.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Exam, ExamQuestion]),
    AutomapperModule,
  ],
  controllers: [ExamController],
  providers: [ExamService, ExamProfile]
})
export class ExamModule {}
