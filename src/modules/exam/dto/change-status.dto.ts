import { AutoMap } from "@automapper/classes";
import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsEnum, IsUUID } from "class-validator";
import { ExamStatus } from "src/types/enums";

export class ChangeStatusDto {
    @ApiProperty({
        description: 'ID of the exam',
        type: String,
        example: 'xxxx-xxxx-xxxx-xxxx'
    })
    @IsUUID()
    @IsDefined()
    examId: string;

    @ApiProperty({
        description: 'ID of the student',
        type: String,
        example: 'xxxx-xxxx-xxxx-xxxx'
    })
    @IsUUID()
    @IsDefined()
    studentId: string;

    @IsEnum(ExamStatus)
    status: ExamStatus;
} 