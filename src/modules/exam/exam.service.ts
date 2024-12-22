import { Mapper } from '@automapper/core';
import { Global, Inject, Injectable, MethodNotAllowedException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Exam } from 'src/models/exam.model';
import { CreateExamDto } from './dto/create-exam.dto';
import { User } from 'src/models/user.model';
import { CreateExamResponseDto } from './dto/create-exam.response.dto';
import { QueryParamsDto } from 'src/providers/query-parameters/dto/query-parameters';
import { GlobalQueryFilter } from 'src/providers/query-parameters/query-parameter.class';
import { UpdateExamDto } from './dto/update-exam.dto';
import { InjectMapper } from '@automapper/nestjs';
import { ExamQuestionDto } from './dto/exam-question.dto';
import { ExamQuestion } from 'src/models/exam-question.model';

@Injectable()
export class ExamService {
    constructor(
        @InjectModel(Exam) private readonly ExamModel: typeof Exam,
        @InjectModel(ExamQuestion) private readonly ExamQuestionModel: typeof ExamQuestion,
        @InjectMapper() private readonly mapper: Mapper
    ) {}

    async createExam(dto: CreateExamDto, curUser: User) {
        const exam = await this.ExamModel.create<Exam>({
            ...dto,
            createdBy: curUser.id
        });
        return this.mapper.map(exam, Exam, CreateExamResponseDto)
    }

    async createExamQuestion(dto: ExamQuestionDto) {
        const doc = await this.ExamQuestionModel.create({
            ...dto
        });
        return doc.toJSON();
    }

    async deleteExamQuestion(examStudentId: string) {
        await this.ExamQuestionModel.destroy<ExamQuestion>({
            where: {
                id: examStudentId
            }
        });
    }

    async getAllExams(query: QueryParamsDto, curUser: User) {
        const queryFilter = new GlobalQueryFilter<Exam>(query)
        .setFields(['id', 'name', 'duration', 'date'])
        .setSearch(['name'])
        .setPagination()
        .setCreatedBy(curUser.id)
        // .setInclude([
        //     { model: Question },
        //     { model: User, as: 'students', attributes: ['id', 'username'] },
        //     { model: User, as: 'creator', attributes: ['id', 'username'] }
        // ])
        // .applyUserFilter(user)
        .getOptions();
        
        const exams = await this.ExamModel.findAll<Exam>(queryFilter);
        return this.mapper.mapArray(exams, Exam, CreateExamResponseDto);
    }

    // async getExam(examId: string, user: User) {
    //     const include: any = [
    //         { model: Question },
    //     ]
    //     const where: any = {
    //         id: examId,
    //     }
    //     if (user.role === 'TEACHER') {
    //         include.push({ model: User, as: 'students', attributes: ['id', 'username'] });
    //         where['createdBy'] = user.id;
    //     }
    //     else {
    //         include.push({
    //             model: User,
    //             as: 'students',
    //             where: { id: user.id }, // Filter students by user ID
    //         });
    //         where['date'] = { [Op.lt]: Date.now() };
    //     }

    //     const exam = this.examRepository.findOne<Exam>({
    //         include,
    //         where
    //     });
    //     if (!exam) {
    //         throw new MethodNotAllowedException('Access is not allowed')
    //     }
    //     return exam;
    // }

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
}

