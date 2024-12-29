import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/models/user.model';
import { Exam } from 'src/models/exam.model';
import { Question } from 'src/models/question.model';
import { ExamQuestion } from 'src/models/exam-question.model';
import { ExamStudent } from 'src/models/exam-student.model';
import { QuestionStudent } from 'src/models/question-student.model';

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
          models: [User, Exam, Question, ExamQuestion, ExamStudent, QuestionStudent],
          autoLoadModels: true,
          synchronize: true,
          logging: configService.getOrThrow(`DATA_BASE_LOGGING_${nodeEnv}`) === 'true' ? console.log : false,
        }
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}