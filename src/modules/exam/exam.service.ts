import { Mapper } from '@automapper/core';
import { ForbiddenException, Global, Inject, Injectable, MethodNotAllowedException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Exam } from 'src/models/exam.model';
import { CreateExamDto } from './dto/create-exam.dto';
import { User } from 'src/models/user.model';
import { QueryParamsDto } from 'src/providers/query-parameters/dto/query-parameters';
import { GlobalQueryFilter } from 'src/providers/query-parameters/query-parameter.class';
import { UpdateExamDto } from './dto/update-exam.dto';
import { InjectMapper } from '@automapper/nestjs';
import { CreateExamQuestionDto } from './dto/create-exam-question.dto';
import { ExamQuestion } from 'src/models/exam-question.model';
import { CreateExamQuestionResponseDto } from './dto/create-exam-question.respose.dto';
import { CreateExamResponseDto } from './dto/create-exam.response.dto';
import { Question } from 'src/models/question.model';
import { ExamStudent } from 'src/models/exam-student.model';
import { AddExamStudentDto } from './dto/add-exam-student.dto';
import { ExamStatus, Role } from 'src/types/enums';
import { AddExamStudentResponseDto } from './dto/add-exam-student.response.dto';

@Injectable()
export class ExamService {
    constructor(
        @InjectModel(Exam) private readonly ExamModel: typeof Exam,
        @InjectModel(ExamQuestion) private readonly ExamQuestionModel: typeof ExamQuestion,
        @InjectModel(ExamStudent) private readonly ExamStudentModel: typeof ExamStudent,
        @InjectMapper() private readonly mapper: Mapper
    ) {}

    async createExam(dto: CreateExamDto, curUser: User) {
        const exam = await this.ExamModel.create<Exam>({
            ...dto,
            createdBy: curUser.id
        });
        return this.mapper.map(exam, Exam, CreateExamResponseDto)
    }

    async createExamQuestion(dto: CreateExamQuestionDto) {
        const doc = await this.ExamQuestionModel.create({
            ...dto
        });
        return this.mapper.map(doc, ExamQuestion, CreateExamQuestionResponseDto)
    }

    async deleteExamQuestion(examStudentId: string) {
        await this.ExamQuestionModel.destroy<ExamQuestion>({
            where: {
                id: examStudentId

            }
        });
    }

    async getAllExams(query: QueryParamsDto, curUser: User) {
        const queryFilter = new GlobalQueryFilter<Exam>(query, ['id', 'name', 'duration', 'date'])
        .setFields()
        .setSearch()
        .setPagination()
        .setCreatedBy(curUser.id)
        .getOptions();
        
        const exams = await this.ExamModel.findAll<Exam>(queryFilter);
        return this.mapper.mapArray(exams, Exam, CreateExamResponseDto);
    }

    async getExam(examId: string, user: User) {
        const exam = await this.ExamModel.findOne({
            where: {
                id: examId
            },
            include: [
                {model: Question, as: 'questionsList', attributes: ['id', 'description', 'options', 'answer']},
                {model: User, as: 'creator', attributes: ['id', 'username']},
                {model: User, as: 'studentsList', attributes: ['id', 'username']}
            ]
        })
        // If the owner of the exam request his exam
        if (exam.createdBy === user.id) {
            return exam
        }
        const isStudent = exam.studentsList.find((el) => el.id === user.id);
        if (!isStudent || exam.date.getTime() >= Date.now()) {
            throw new UnauthorizedException("You don't have a permission to get the exam");
        }
        const plainExam = exam.toJSON();

        // Remove `studentsList`
        delete plainExam.studentsList;

        // Remove `answer` from each question
        plainExam.questionsList.forEach((question) => {
            delete question.answer;
            delete question.ExamQuestion;
        });

        return plainExam;
    }

    async updateExam(examId: string, dto: UpdateExamDto, curUser: User) {
        const exam = await this.ExamModel.findOne<Exam>({
            where: {
                id: examId,
                createdBy: curUser.id,
            }
        });
        if (!exam) {
            throw new NotFoundException('Exam not found');
        }
        Object.assign(exam, dto);
        await exam.save();
        return this.mapper.map(exam, Exam, CreateExamResponseDto);
    }

    async deleteExam(examId: string, curUser: User) {
        await this.ExamModel.destroy({
            where: {
                id: examId,
                createdBy: curUser.id
            }
        });
    }

    async addExamStudent(dto: AddExamStudentDto, curUser: User) {
        const doc = await this.ExamStudentModel.create({
            ...dto,
            acceptedBy: curUser.id,
            status: ExamStatus.ACCEPTED
        });
        return this.mapper.map(doc, ExamStudent, AddExamStudentResponseDto);
    }
  
    async deleteExamStudent(dto: AddExamStudentDto, curUser: User) {
        const exam = await this.ExamModel.findByPk(dto.examId, {
            include: [
                {model: User, as: 'studentsList', attributes: ['id']}
            ]
        });
        
        if (curUser.id !== exam.createdBy) {
            throw new ForbiddenException('Only the owner of the exam can remove students');
        }

        const isStudent = exam.studentsList.find((el) => el.id === dto.studentId);
        if (!isStudent) {
            throw new NotFoundException("Student doesn't belong to this exam");
        }

        this.ExamStudentModel.destroy({
            where: {
                ...dto
            }
        })
    }
}

