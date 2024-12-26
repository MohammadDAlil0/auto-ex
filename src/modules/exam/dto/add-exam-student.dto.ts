import { AutoMap } from "@automapper/classes";
import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsUUID } from "class-validator";

export class AddExamStudentDto {
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
} 