import { AutoMap } from "@automapper/classes";
import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsUUID } from "class-validator";
import { ExamStatus } from "src/types/enums";

export class AddExamStudentResponseDto {
    @AutoMap()
    id: string;
    
    @AutoMap()
    examId: string;

    @AutoMap()
    studentId: string;

    @AutoMap()
    status: ExamStatus;

    @AutoMap()
    acceptedBy: string;
} 