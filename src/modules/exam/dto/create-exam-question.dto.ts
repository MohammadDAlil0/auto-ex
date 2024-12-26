import { AutoMap } from "@automapper/classes";
import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNumber, IsUUID } from "class-validator";

export class CreateExamQuestionDto {
    @AutoMap()
    @ApiProperty({
        description: 'ID of the exam',
        type: String,
        example: 'xxxx-xxxx-xxxx-xxxx'
    })
    @IsUUID()
    @IsDefined()
    examId: string;

    @AutoMap()
    @ApiProperty({
        description: 'ID of the question',
        type: String,
        example: 'xxxx-xxxx-xxxx-xxxx'
    })
    @IsUUID()
    @IsDefined()
    questionId: string;

    @AutoMap()
    @ApiProperty({
        description: 'mark of the question',
        type: String,
        example: 10
    })
    @IsNumber()
    mark: string;
}