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
import { RegisterExamDto } from './dto/register-exam.dto';
import { ChangeStatusDto } from './dto/change-status.dto';
import { SelectOptionDto } from './dto/select-option.dto';
import { QuestionStudent } from 'src/models/question-student.model';
import { Op } from 'sequelize';

@Injectable()
export class ExamService {
    constructor(
        @InjectModel(Exam) private readonly ExamModel: typeof Exam,
        @InjectModel(ExamQuestion) private readonly ExamQuestionModel: typeof ExamQuestion,
        @InjectModel(ExamStudent) private readonly ExamStudentModel: typeof ExamStudent,
        @InjectModel(QuestionStudent) private readonly QuestionStudentModel: typeof QuestionStudent,
        @InjectModel(Question) private readonly QuestionModel: typeof Question,
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
        const question = await this.QuestionModel.findByPk(dto.questionId);
        const doc = await this.ExamQuestionModel.create({
            ...dto,
            answer: question.answer
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
        });
        // If the owner of the exam request his exam
        if (exam.createdBy === user.id) {
            return exam
        }
        const isStudent: any = exam.studentsList.find((el) => el.id === user.id);
        if (!isStudent || isStudent.ExamStudent.status !== ExamStatus.ACCEPTED || exam.date.getTime() >= Date.now()) {
            throw new UnauthorizedException("You don't have a permission to get the exam");
        }
        const plainExam = exam.toJSON();

        // Remove `studentsList`
        delete plainExam.studentsList;

        // Remove `answer` from each question
        plainExam.questionsList.forEach((question) => {
            delete question.answer;
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

    async registerExam(dto: RegisterExamDto, curUser: User) {
        const doc = await this.ExamStudentModel.create({
            ...dto,
            studentId: curUser.id,
            status: ExamStatus.ONQUEUE
        });
        return this.mapper.map(doc, ExamStudent, AddExamStudentResponseDto);
    }

    async changeStatus(curUser: User, dto: ChangeStatusDto) {
        const doc = await this.ExamStudentModel.findOne({
            where: {
                examId: dto.examId,
                studentId: dto.studentId
            }
        });
        doc.status = dto.status;
        doc.acceptedBy = curUser.id;
        return await doc.save();
    }

    async selectOption(curUser: User, dto: SelectOptionDto) {
        let doc = await this.QuestionStudentModel.findOne({
            where: {
                examQuestionId: dto.examQuestionId,
                studentId: curUser.id
            }
        });
        if (!doc) {     // Create a new one
            doc = await this.QuestionStudentModel.create({
                ...dto,
                studentId: curUser.id
            });
            return doc;
        }
        else {
            await this.QuestionStudentModel.update({
                selectNumber: dto.selectNumber
            }, {
                where: {
                    examQuestionId: dto.examQuestionId,
                    studentId: curUser.id 
                }
            });
            return 'Updated Successfuly';
        }
    }
    
    async submitExam(curUser: User, examId: string) {
        const questions = await this.ExamQuestionModel.findAll({
            where: {
                examId: examId
            }
        });
    
        const questionIds = questions.map(q => q.id);
    
        const selectedAnswers = await this.QuestionStudentModel.findAll({
            where: {
                examQuestionId: {
                    [Op.in]: questionIds
                },
                studentId: curUser.id
            }
        });
    
        let totalMarks = 0;
    
        questions.forEach((question) => {
            const studentAnswer = selectedAnswers.find(sa => sa.examQuestionId === question.id);
            if (studentAnswer && studentAnswer.selectNumber === question.answer) {
                totalMarks += question.mark;
            }
        });

        await this.ExamStudentModel.update({
            mark: totalMarks
        }, {
            where: {
                examId: examId,
                studentId: curUser.id
            }
        });

        await this.QuestionStudentModel.destroy({
            where: {
                examQuestionId: {
                    [Op.in]: questionIds
                },
                studentId: curUser.id
            }
        })

        return {
            selectedAnswers,
            totalMarks
        };
    }   
}