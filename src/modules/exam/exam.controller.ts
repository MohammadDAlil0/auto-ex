import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { CreateExamDto } from './dto/create-exam.dto';
import { ExamService } from './exam.service';
import { CreateExamDecorator, CreateExamQuestionDecorator, DeleteExamDecorator, GetAllExamsDecorator, GetExam, GlobalExamDecorator, RemoveExamQuestionDecorator, UpdateExamDecorator } from 'src/decorators/appliers/exam-appliers.decorator';
import { GetUser } from 'src/decorators/auth/get-user.decortator';
import { User } from 'src/models/user.model';
import { QueryParamsDto } from 'src/providers/query-parameters/dto/query-parameters';
import { UpdateExamDto } from './dto/update-exam.dto';
import { ExamQuestionDto } from './dto/exam-question.dto';

@GlobalExamDecorator()
@Controller('exam')
export class ExamController {
    constructor(private readonly examService: ExamService) {}

    @Post()
    @CreateExamDecorator()
    createExam(@Body() dto: CreateExamDto, @GetUser() curUser: User) {
        return this.examService.createExam(dto, curUser);
    }

    @Post('add-question')
    @CreateExamQuestionDecorator()
    createExamQuestion(@Body() dto: ExamQuestionDto) {
        return this.examService.createExamQuestion(dto);
    }

    @Delete('delete-question/:id')
    @RemoveExamQuestionDecorator()
    remove(@Param('id') id: string) {
        return this.examService.deleteExamQuestion(id);
    }

    @Get()
    @GetAllExamsDecorator()
    getAllExams(@Query() query: QueryParamsDto, @GetUser() curUser: User) {
        return this.examService.getAllExams(query, curUser);
    }

    // @Get(':id')
    // @GetExam()
    // getExam(@Param('id', ParseUUIDPipe) examId: string, @GetUser() curUser: User) {
    //     return this.examService.getExam(examId, curUser);
    // }

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
