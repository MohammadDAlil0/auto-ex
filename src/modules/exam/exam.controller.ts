import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Put, Query } from '@nestjs/common';
import { CreateExamDto } from './dto/create-exam.dto';
import { ExamService } from './exam.service';
import { AddStudentExamDecorators, ChangeStatusDecorator, CreateExamDecorator, CreateExamQuestionDecorator, DeleteExamDecorator, DeleteStudentExamDecorators, GetAllExamsDecorator, GetExamDecorator, GlobalExamDecorator, RegisterExamDecorator, RemoveExamQuestionDecorator, SelectOptionDecorator, SubmitExamDecorator, UpdateExamDecorator, UpdateExamQuestionDecorator } from 'src/decorators/appliers/exam-appliers.decorator';
import { GetUser } from 'src/decorators/auth/get-user.decortator';
import { User } from 'src/models/user.model';
import { QueryParamsDto } from 'src/providers/query-parameters/dto/query-parameters';
import { UpdateExamDto } from './dto/update-exam.dto';
import { CreateExamQuestionDto } from './dto/create-exam-question.dto';
import { AddExamStudentDto } from './dto/add-exam-student.dto';
import { RegisterExamDto } from './dto/register-exam.dto';
import { ExamStatus } from 'src/types/enums';
import { ChangeStatusDto } from './dto/change-status.dto';
import { SelectOptionDto } from './dto/select-option.dto';

@GlobalExamDecorator()
@Controller('exam')
export class ExamController {
    constructor(private readonly examService: ExamService) {}
    @Post('add-question')
    @CreateExamQuestionDecorator()
    createExamQuestion(@Body() dto: CreateExamQuestionDto) {
        return this.examService.createExamQuestion(dto);
    }

    @Delete('delete-question/:id')
    @RemoveExamQuestionDecorator()
    remove(@Param('id') id: string) {
        return this.examService.deleteExamQuestion(id);
    }

    @Post('add-student-exam')
    @AddStudentExamDecorators()
    addStudentExan(@Body() dto: AddExamStudentDto, @GetUser() curUser: User) {
        return this.examService.addExamStudent(dto, curUser);
    }

    @Delete('delete-student-exam/:id')
    @DeleteStudentExamDecorators()
    deleteStudentExam(@Body() dto: AddExamStudentDto, @GetUser() curUser: User) {
        return this.examService.deleteExamStudent(dto, curUser);
    }

    @Post('register-exam')
    @RegisterExamDecorator()
    registerExam(@Body() dto: RegisterExamDto, @GetUser() curUser: User) {
        return this.examService.registerExam(dto, curUser);
    }

    @Post('change-status')
    @ChangeStatusDecorator()
    changeStatus(@GetUser() curUser: User,@Body() dto: ChangeStatusDto) {
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
