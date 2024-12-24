import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Body, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { User } from 'src/models/user.model';
import { QueryParamsDto } from 'src/providers/query-parameters/dto/query-parameters';
import { GlobalQueryFilter } from 'src/providers/query-parameters/query-parameter.class';
import { Role } from 'src/types/enums';
import { CreateUserResponseDto } from '../auth/dto/create-user.response.dto';
import { AddExamStudentDto } from './dto/add-exam-student.dto';
import { ExamStudent } from 'src/models/exam-student.model';
import { AddExamStudentResponseDto } from './dto/add-exam-student.response.dto';
import { Exam } from 'src/models/exam.model';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User) private readonly UserModel: typeof User,
        @InjectModel(ExamStudent) private readonly ExamStudentModel: typeof ExamStudent, 
        @InjectMapper() private readonly mapper: Mapper,
    ) {}

    async getAllUsers(query: QueryParamsDto): Promise<CreateUserResponseDto[]> {
        const queryFilter = new GlobalQueryFilter<User>(query, ['id', 'username', 'email', 'role'])
        .setFields()
        .setSearch()
        .setFilter()
        .setPagination()
        // .setInclude([
        //     { model: Exam, as: 'createdExams', attributes: ['id', 'name'] },
        //     { model: Exam, as: 'exams', attributes: ['id', 'name'] }
        // ])
        .getOptions()

        const users = await this.UserModel.findAll(queryFilter);
        return this.mapper.mapArray(users, User, CreateUserResponseDto);
    }


    async deleteUser(userId: string) {
        const deletedCount = await this.UserModel.destroy<User>({
          where: { id: userId },
        });

        if (deletedCount === 0) {
          throw new NotFoundException('Invalid user ID');
        }
    }

    async addExamStudent(@Body() dto: AddExamStudentDto, curUser: User) {
      const doc = await this.ExamStudentModel.create({
        ...dto,
        acceptedBy: curUser.id
      });
      return this.mapper.map(doc, ExamStudent, AddExamStudentResponseDto);
    }

    async deleteExamStudent(studentExamId: string, curUser: User) {
      const doc = await this.ExamStudentModel.findOne({
        where: { id: studentExamId },
        include: {
          model: Exam,
          as: 'exam',
          attributes: ['id', 'createdBy'],
        },
      });
      if (!doc) {
        throw new NotFoundException('No Student for this exam with this ID')
      };
      console.log(doc, doc.exam);
      if (curUser.role === Role.TEACHER && curUser.id !== doc.exam.createdBy) {
        throw new ForbiddenException('Only the owner of the exam can remove students');
      }
      await doc.destroy();
    }

}