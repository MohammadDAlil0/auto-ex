import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, mapFrom, MappingProfile, type Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { User } from 'src/models/user.model';
import { CreateUserResponseDto } from 'src/modules/auth/dto/create-user.response.dto';
import { Question } from 'src/models/question.model';
import { CreateQuestionResponseDto } from 'src/modules/question/dto/create-question.response.dto';
import { Exam } from 'src/models/exam.model';
import { CreateExamResponseDto } from 'src/modules/exam/dto/create-exam.response.dto';
import { ExamStudent } from 'src/models/exam-student.model';
import { AddExamStudentResponseDto } from 'src/modules/exam/dto/add-exam-student.response.dto';
import { CreateExamQuestionResponseDto } from 'src/modules/exam/dto/create-exam-question.respose.dto';
import { ExamQuestion } from 'src/models/exam-question.model';

@Injectable()
export class UserProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    override get profile(): MappingProfile {
        return (mapper: Mapper) => {
            createMap(mapper, User, CreateUserResponseDto);
            createMap(mapper, ExamStudent, AddExamStudentResponseDto)
        };
    }
}

@Injectable()
export class QuestionProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper: Mapper) => {
      createMap(mapper, Question, CreateQuestionResponseDto, forMember(
        (destination) => destination.options, mapFrom((sourse) => JSON.parse(sourse.options))
      ));
    };
  }
}

@Injectable()
export class ExamProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper: Mapper) => {
        createMap(mapper, Exam, CreateExamResponseDto);
        createMap(mapper, ExamQuestion, CreateExamQuestionResponseDto);
    };
  }
}