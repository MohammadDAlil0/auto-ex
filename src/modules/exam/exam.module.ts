import { Module } from '@nestjs/common';
import { ExamController } from './exam.controller';
import { ExamService } from './exam.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { AutomapperModule } from '@automapper/nestjs';
import { Exam } from 'src/models/exam.model';

@Module({
   imports: [
      SequelizeModule.forFeature([Exam]),
      AutomapperModule,
    ],
  controllers: [ExamController],
  providers: [ExamService]
})
export class ExamModule {}
