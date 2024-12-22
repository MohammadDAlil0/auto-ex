import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Question } from 'src/models/question.model';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { CreateQuestionResponseDto } from './dto/create-question.response.dto';
import { User } from 'src/models/user.model';
import { updateQuestionDto } from './dto/update-question.dto';
import { QueryParamsDto } from 'src/providers/query-parameters/dto/query-parameters';
import { GlobalQueryFilter } from 'src/providers/query-parameters/query-parameter.class';

@Injectable()
export class QuestionService {
    constructor(
        @InjectModel(Question) private readonly QuestionModel: typeof Question,
        @InjectMapper() private readonly mapper: Mapper,
    ) {}
    
    async createQuestion(dto: CreateQuestionDto, curUser: User): Promise<CreateQuestionResponseDto> {
        const question = await this.QuestionModel.create<Question>({
            ...dto,
            options: JSON.stringify(dto.options),
            createdBy: curUser.id
        });
        return this.mapper.map(question, Question, CreateQuestionResponseDto);
    }


    async getAllQuestions(query: QueryParamsDto, curUser: User): Promise<CreateQuestionResponseDto[]> {
        const queryFilter = new GlobalQueryFilter<User>(query)
                .setFields(['description', 'options', 'answer'])
                .setSearch(['description'])
                .setPagination()
                .setCreatedBy(curUser.id)
                // .setInclude([
                //     { model: Exam, as: 'createdExams', attributes: ['id', 'name'] },
                //     { model: Exam, as: 'exams', attributes: ['id', 'name'] }
                // ])
                .getOptions()
        const questions = await this.QuestionModel.findAll<Question>(queryFilter);
        return this.mapper.mapArray(questions, Question, CreateQuestionResponseDto);
    }

    async updateQuestion(questionId: string, dto: updateQuestionDto, curUser: User) {
        const question = await this.QuestionModel.findOne<Question>({
            where: {
                id: questionId,
                createdBy: curUser.id,
            }
        });
        if (!question) {
            throw new NotFoundException('Question not found');
        }
        Object.assign(question, dto);
        await question.save();
        return this.mapper.map(question, Question, CreateQuestionResponseDto);
    }

    async deleteQuestion(questionId: string, user: User) {
        await this.QuestionModel.destroy({
            where: {
                id: questionId,
                createdBy: user.id
            }
        });
    }
}
