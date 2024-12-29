import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNumber, IsUUID } from "class-validator";

export class SelectOptionDto {
    @ApiProperty({
        description: 'ID of the exam-question',
        type: String,
        example: 'xxxx-xxxx-xxxx-xxxx'
    })
    @IsUUID()
    @IsDefined()
    examQuestionId: string;

    @ApiProperty({
        description: 'number of the option',
        type: Number,
        example: 1
    })
    @IsNumber()
    selectNumber: number;
} 