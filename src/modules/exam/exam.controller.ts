import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { CreateExamDto } from './dto/create-exam.dto';
import { ExamService } from './exam.service';
import { UpdateExamDto } from './dto/update-exam.dto';
import { QueryParamsDto } from 'src/core/global-dto/query-params.dto';
import { GetUser } from 'src/user/decorator/get-user.decorator';
import { User } from 'src/user/user.entity';
import { CreateExamDecorator, DeleteExamDecorator, GetAllExamsDecorator, GetExam, GlobalExamDecorator, UpdateExamDecorator } from 'src/decorators/appliers/exam-appliers.decorator';

@GlobalExamDecorator()
@Controller('exam')
export class ExamController {
    constructor(private readonly examService: ExamService) {}

    @Post()
    @CreateExamDecorator()
    createExam(@Body() dto: CreateExamDto, @GetUser() user: User) {
        return this.examService.createExam(dto, user);
    }

    @Get()
    @GetAllExamsDecorator()
    getAllExams(@Query() query: QueryParamsDto, @GetUser() user: User) {
        return this.examService.getAllExams(query, user);
    }

    @Get(':id')
    @GetExam()
    getExam(@Param('id', ParseUUIDPipe) examId: string, @GetUser() user: User) {
        return this.examService.getExam(examId, user);
    }

    @Patch(':id')
    @UpdateExamDecorator()
    updateExam(@Param('id', ParseUUIDPipe) examId: string, @Body() dto: UpdateExamDto, @GetUser() user: User) {
        return this.examService.updateExam(examId, dto, user);
    }

    @Delete(':id')
    @DeleteExamDecorator()
    deleteExam(@Param('id', ParseUUIDPipe) examId: string, @GetUser() user: User) {
        return this.examService.deleteExam(examId, user);
    }
}
