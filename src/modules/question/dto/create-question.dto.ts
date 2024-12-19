import { IsArray, IsDefined, IsNotEmpty, IsString, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { IsAnswerValid } from "src/decorators/validators/answer.validator";
import { AutoMap } from "@automapper/classes";

export class CreateQuestionDto {
    @AutoMap()
    @ApiProperty({
        description: 'The Question',
        type: String,
        example: 'What is the sum of 1 + 1'
    })
    @IsString()
    @IsNotEmpty()
    description: string;

    @AutoMap()
    @ApiProperty({
        description: 'options of the question',
        type: String,
        example: ['option1', 'option2', 'option3', 'option4']
    })
    @IsArray()
    @IsString({ each: true })
    options: string[];

    @AutoMap()
    @ApiProperty({
        description: 'answer of the question',
        type: Number,
        example: 1
    })
    @IsAnswerValid()
    answer: number;
}