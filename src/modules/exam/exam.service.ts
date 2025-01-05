import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import { Exam, ExamQuestion, ExamStudent, QuestionStudent, Question, User } from "src/models";
import { DataBaseService } from "src/providers/database/database.service";
import { QueryParamsDto } from "src/providers/query-parameters/dto/query-parameters";
import { GlobalQueryFilter } from "src/providers/query-parameters/query-parameter.class";
import { ExamStatus } from "src/types/enums";
import { CreateExamQuestionDto, CreateExamQuestionResponseDto, AddExamStudentDto, AddExamStudentResponseDto, ChangeStatusDto, CreateExamDto, CreateExamResponseDto, SelectOptionDto, UpdateExamDto } from "./dto";

@Injectable()
export class ExamService {
    constructor(
        @InjectModel(Exam) private readonly ExamModel: typeof Exam,
        @InjectModel(ExamQuestion) private readonly ExamQuestionModel: typeof ExamQuestion,
        @InjectModel(ExamStudent) private readonly ExamStudentModel: typeof ExamStudent,
        @InjectModel(QuestionStudent) private readonly QuestionStudentModel: typeof QuestionStudent,
        @InjectModel(Question) private readonly QuestionModel: typeof Question,
        @InjectMapper() private readonly mapper: Mapper,
        private readonly dataBaseService: DataBaseService
    ) {}

    async createExamQuestion(dto: CreateExamQuestionDto) {
        const question: Question = await this.dataBaseService.findByPkOrThrow(this.QuestionModel, dto.questionId);
        const doc = await this.ExamQuestionModel.create({
            ...dto,
            answer: question.answer
        });
        return this.mapper.map(doc, ExamQuestion, CreateExamQuestionResponseDto)
    }

    async deleteExamQuestion(id: string) {
        await this.dataBaseService.destroyOrThrow<ExamQuestion>(this.ExamQuestionModel, {
            where: {
                id
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

    async deleteExamStudent(id: string, curUser: User) {
        this.dataBaseService.destroyOrThrow(this.ExamStudentModel, {
            where: {
                id
            }
        });
    }

    async registerExam(examId: string, curUser: User) {
        const doc = await this.ExamStudentModel.create({
            examId,
            studentId: curUser.id,
            status: ExamStatus.ONQUEUE
        });
        return this.mapper.map(doc, ExamStudent, AddExamStudentResponseDto);
    }

    async changeStatus(curUser: User, dto: ChangeStatusDto) {
        const doc: ExamStudent = await this.dataBaseService.findOneOrThrow(this.ExamStudentModel, {
            where: {
                examId: dto.examId,
                studentId: dto.studentId
            }
        });
        doc.status = dto.status;
        doc.acceptedBy = curUser.id;
        return await doc.save();
    }

    async createExam(dto: CreateExamDto, curUser: User) {
        const exam = await this.ExamModel.create<Exam>({
            ...dto,
            createdBy: curUser.id
        });
        return this.mapper.map(exam, Exam, CreateExamResponseDto)
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
            const questionStudent: QuestionStudent = await this.dataBaseService.findOneOrThrow(this.QuestionStudentModel, {
                where: {
                    examQuestionId: dto.examQuestionId,
                    studentId: curUser.id 
                }
            });
            questionStudent.selectNumber = dto.selectNumber;
            await questionStudent.save();
            return questionStudent;
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

        return {
            selectedAnswers,
            totalMarks
        };
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
        const exam: any = await this.dataBaseService.findOneOrThrow(this.ExamModel, {
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
        const student: any = exam.studentsList.find((el) => el.id === user.id);
        if (!student || student.ExamStudent.status !== ExamStatus.ACCEPTED || exam.date.getTime() >= Date.now()) {
            throw new UnauthorizedException("You don't have a permission to get the exam");
        }
        let questionsList = exam.questionsList;
        if (student.ExamStudent.mark) {
            const questionIds = exam.questionsList.map(q => q.ExamQuestion.id);

            const selectedAnswers = await this.QuestionStudentModel.findAll({
                where: {
                    examQuestionId: {
                        [Op.in]: questionIds
                    },
                    studentId: user.id
                }
            });
        
            let totalMarks = 0;
        
            questionsList = exam.questionsList.map((question) => {
                const studentAnswer = selectedAnswers.find(sa => sa.examQuestionId === question.ExamQuestion.id);
                let correctness = false, selectedNumber = null;
                if (studentAnswer && studentAnswer.selectNumber === question.answer) {
                    totalMarks += question.ExamQuestion.mark;
                    correctness = true;
                    selectedNumber = studentAnswer.selectNumber;
                }
                return {
                    ...question.toJSON(),
                    correctness,
                    selectedNumber
                }
            });
            
        }
        const plainExam = exam.toJSON();
        plainExam.questionsList = questionsList;
        delete plainExam.studentsList;

        plainExam.questionsList.forEach((question) => {
            delete question.ExamQuestion.answer;
        });

        return plainExam;
    }

    async updateExam(examId: string, dto: UpdateExamDto, curUser: User) {
        const exam = await this.dataBaseService.findOneOrThrow<Exam>(this.ExamModel, {
            where: {
                id: examId,
                createdBy: curUser.id,
            }
        });
        Object.assign(exam, dto);
        await exam.save();
        return this.mapper.map(exam, Exam, CreateExamResponseDto);
    }

    async deleteExam(examId: string, curUser: User) {
        await this.dataBaseService.destroyOrThrow(this.ExamModel, {
            where: {
                id: examId,
                createdBy: curUser.id
            }
        });
    }
 
}