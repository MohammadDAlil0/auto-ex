import { Controller, Post, Body, Delete, Param, Get, Query, ParseUUIDPipe, Patch } from "@nestjs/common";
import { GlobalExamDecorator, CreateExamQuestionDecorator, RemoveExamQuestionDecorator, AddStudentExamDecorators, DeleteStudentExamDecorators, RegisterExamDecorator, ChangeStatusDecorator, SelectOptionDecorator, SubmitExamDecorator, CreateExamDecorator, GetAllExamsDecorator, GetExamDecorator, UpdateExamDecorator, DeleteExamDecorator } from "src/decorators/appliers/exam-appliers.decorator";
import { GetUser } from "src/decorators/auth/get-user.decortator";
import { User } from "src/models";
import { QueryParamsDto } from "src/providers/query-parameters/dto/query-parameters";
import { CreateExamQuestionDto, AddExamStudentDto, ChangeStatusDto, SelectOptionDto, CreateExamDto, UpdateExamDto } from "./dto";
import { ExamService } from "./exam.service";

@GlobalExamDecorator()
@Controller('exam')
export class ExamController {
    constructor(private readonly examService: ExamService) {}
    
    @Post('add-question')
    @CreateExamQuestionDecorator()
    createExamQuestion(@Body() dto: CreateExamQuestionDto) {
        return this.examService.createExamQuestion(dto);
    }

    @Delete('delete-question/:examQuestionId')
    @RemoveExamQuestionDecorator()
    remove(@Param('examQuestionId') examQuestionId: string) {
        return this.examService.deleteExamQuestion(examQuestionId);
    }

    @Post('add-student-exam')
    @AddStudentExamDecorators()
    addStudentExan(@Body() dto: AddExamStudentDto, @GetUser() curUser: User) {
        return this.examService.addExamStudent(dto, curUser);
    }

    @Delete('delete-student-exam/:examStudentId')
    @DeleteStudentExamDecorators()
    deleteStudentExam(@Param('examStudentId') examStudentId: string, @GetUser() curUser: User) {
        return this.examService.deleteExamStudent(examStudentId, curUser);
    }

    @Post('register-exam/:examId')
    @RegisterExamDecorator()
    registerExam(@Param('examId') examId: string, @GetUser() curUser: User) {
        return this.examService.registerExam(examId, curUser);
    }

    @Post('change-status')
    @ChangeStatusDecorator()
    changeStatus(@GetUser() curUser: User, @Body() dto: ChangeStatusDto) {
        return this.examService.changeStatus(curUser, dto);
    }

    @Post('select-option')
    @SelectOptionDecorator()
    selectOption(@GetUser() curUser: User, @Body() dto: SelectOptionDto) {
        return this.examService.selectOption(curUser, dto);
    }

    @Post('submit-exam/:examId')
    @SubmitExamDecorator()
    submitExam(@GetUser() curUser: User, @Param('examId') examId: string) {
        return this.examService.submitExam(curUser, examId);
    }

    @Post()
    @CreateExamDecorator()
    createExam(@Body() dto: CreateExamDto, @GetUser() curUser: User) {
        return this.examService.createExam(dto, curUser);
    }

    @Get()
    @GetAllExamsDecorator()
    getAllExams(@Query() query: QueryParamsDto, @GetUser() curUser: User) {
        return this.examService.getAllExams(query, curUser);
    }

    @Get(':id')
    @GetExamDecorator()
    getExam(@Param('id', ParseUUIDPipe) examId: string, @GetUser() curUser: User) {
        return this.examService.getExam(examId, curUser);
    }

    @Patch(':id')
    @UpdateExamDecorator()
    updateExam(@Param('id', ParseUUIDPipe) examId: string, @Body() dto: UpdateExamDto, @GetUser() curUser: User) {
        return this.examService.updateExam(examId, dto, curUser);
    }

    @Delete(':id')
    @DeleteExamDecorator()
    deleteExam(@Param('id', ParseUUIDPipe) examId: string, @GetUser() curUser: User) {
        this.examService.deleteExam(examId, curUser);
    }
}
