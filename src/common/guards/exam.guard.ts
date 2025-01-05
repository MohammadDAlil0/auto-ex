import { CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Exam, ExamQuestion, ExamStudent, User } from "src/models";
import { DataBaseService } from "src/providers/database/database.service";
import { Role } from "src/types/enums";

@Injectable()
export class TeacherOfExam implements CanActivate {
    constructor(
        private readonly dataBaseService: DataBaseService,
        @InjectModel(Exam) private readonly ExamModel: Exam,
        @InjectModel(ExamQuestion) private readonly ExamQuestionModel: ExamQuestion
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const curUser: User = request.user;
        let examId: string = request.body.examId;

        if (curUser.role === Role.ADMIN) return true;

        if (request.params.examQuestionId && !examId) {
            const examQuestion: ExamQuestion = await this.dataBaseService.findByPkOrThrow(this.ExamQuestionModel, request.params.examQuestionId);
            examId = examQuestion.examId;
        }

        const exam: Exam = await this.dataBaseService.findByPkOrThrow(Exam, examId);

        if (exam.createdBy !== curUser.id) {
            throw new ForbiddenException('You must be the owner of the exam');
        }

        return true;
    }
}

@Injectable()
export class StudentOfExam implements CanActivate {
    constructor(
        private readonly dataBaseService: DataBaseService,
        @InjectModel(ExamQuestion) private readonly ExamQuestionModel: ExamQuestion,
        @InjectModel(ExamStudent) private readonly ExamStudentModel: ExamStudent
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const curUser: User = request.user;
        let examId: string = request.body.examId || request.params.examId;

        if (request.body.examQuestionId && !examId) {
            const examQuestion: ExamQuestion = await this.dataBaseService.findByPkOrThrow(this.ExamQuestionModel, request.body.examQuestionId);
            examId = examQuestion.examId;
        }

        await this.dataBaseService.findOneOrThrow(this.ExamStudentModel, {
            where: {
                studentId: curUser.id,
                examId
            }

        });

        return true;
    }
}