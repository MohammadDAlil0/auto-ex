import { Module } from '@nestjs/common';
import { OldExamController } from './old-exam.controller';
import { OldExamService } from './old-exam.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { OldExam } from 'src/models/old-exam.model';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptions } from 'src/config/multer.config';

@Module({
  imports: [
    SequelizeModule.forFeature([OldExam]),
    MulterModule.register(multerOptions)
  ],
  controllers: [OldExamController],
  providers: [OldExamService]
})
export class OldExamModule {}
