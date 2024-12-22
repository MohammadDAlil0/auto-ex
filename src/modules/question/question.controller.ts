import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDecorator, DeleteQuestionDecorator, GetAllQuestionsDecorator, GlobalQuestionDecorator, UpdateQuestionDecorator } from 'src/decorators/appliers/question-appliers.decorator';
import { CreateQuestionDto } from './dto/create-question.dto';
import { updateQuestionDto } from './dto/update-question.dto';
import { GetUser } from 'src/decorators/auth/get-user.decortator';
import { User } from 'src/models/user.model';
import { QueryParamsDto } from 'src/providers/query-parameters/dto/query-parameters';

@Controller('question')
@GlobalQuestionDecorator()
export class QuestionController {
    constructor(private questionService: QuestionService) {}

    @Post()
    @CreateQuestionDecorator()
    createQuestion(@Body() dto: CreateQuestionDto, @GetUser() curUser: User) {
        return this.questionService.createQuestion(dto, curUser);
    }

    @Get()
    @GetAllQuestionsDecorator()
    getAllQuestions(@Query() query: QueryParamsDto, @GetUser() curUser: User) {
        return this.questionService.getAllQuestions(query, curUser);
    }

    @Patch(':id')
    @UpdateQuestionDecorator()
    updateQuestion(@Param('id', ParseUUIDPipe) questionId: string, @Body() dto: updateQuestionDto, @GetUser() curUser: User) {
        return this.questionService.updateQuestion(questionId, dto, curUser);
    }

    @Delete(':id')
    @DeleteQuestionDecorator()
    deleteQuestion(@Param('id', ParseUUIDPipe) questionId: string, @GetUser() user: User) {
        this.questionService.deleteQuestion(questionId, user);
    }
}
