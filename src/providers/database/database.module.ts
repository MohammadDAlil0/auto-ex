import { Global, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { User, Exam, Question, ExamQuestion, ExamStudent, QuestionStudent } from 'src/models';
import { OldExam } from 'src/models/old-exam.model';
import { DataBaseService } from './database.service';

@Global()
@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const nodeEnv = configService.getOrThrow('NODE_ENV');
        return  {
          dialect: 'mysql',
          host: configService.getOrThrow(`DATA_BASE_HOST_${nodeEnv}`),
          port: parseInt(configService.getOrThrow(`DATA_BASE_PORT_${nodeEnv}`), 10),
          username: configService.getOrThrow(`DATA_BASE_USERNAME_${nodeEnv}`),
          password: configService.getOrThrow(`DATA_BASE_PASSWORD_${nodeEnv}`),
          database: configService.getOrThrow(`DATA_BASE_NAME_${nodeEnv}`),
          models: [User, Exam, Question, ExamQuestion, ExamStudent, QuestionStudent, OldExam],
          autoLoadModels: true,
          synchronize: true,
          logging: configService.getOrThrow(`DATA_BASE_LOGGING_${nodeEnv}`) === 'true' ? console.log : false,
        }
      },
      inject: [ConfigService],
    }),
  ],
  providers: [DataBaseService],
  exports: [DataBaseService]
})
export class DatabaseModule {}