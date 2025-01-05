import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Question, User } from "src/models";
import { CreateQuestionDto, CreateQuestionResponseDto, UpdateQuestionDto } from "./dto";
import { QueryParamsDto } from "src/providers/query-parameters/dto/query-parameters";
import { GlobalQueryFilter } from "src/providers/query-parameters/query-parameter.class";
import { DataBaseService } from "src/providers/database/database.service";

@Injectable()
export class QuestionService {
    constructor(
        @InjectModel(Question) private readonly QuestionModel: typeof Question,
        @InjectMapper() private readonly mapper: Mapper,
        private readonly dataBaseService: DataBaseService
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
        const queryFilter = new GlobalQueryFilter<User>(query, ['id', 'description', 'options', 'answer'])
        .setFields()
        .setSearch()
        .setPagination()
        .setCreatedBy(curUser.id)
        .getOptions()
        const questions = await this.QuestionModel.findAll<Question>(queryFilter);
        return this.mapper.mapArray(questions, Question, CreateQuestionResponseDto);
    }

    async updateQuestion(questionId: string, dto: UpdateQuestionDto, curUser: User) {
        const question: Question = await this.dataBaseService.findOneOrThrow(Question, {
            where: {
                id: questionId,
                createdBy: curUser.id,
            }
        });
        Object.assign(question, dto);
        await question.save();
        return this.mapper.map(question, Question, CreateQuestionResponseDto);
    }

    async deleteQuestion(questionId: string, user: User) {
        await this.dataBaseService.destroyOrThrow(Question, {
            where: {
                id: questionId,
                createdBy: user.id
            }
        });
    }
}
