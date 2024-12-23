import { IsArray, IsDefined, IsNotEmpty, IsString, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { IsAnswerValid } from "src/decorators/validators/answer.validator";
import { AutoMap } from "@automapper/classes";

export class CreateQuestionResponseDto {
    @AutoMap()
    id: string;

    @AutoMap()
    description: string;

    @AutoMap()
    options: string[];

    @AutoMap()
    answer: number;
}