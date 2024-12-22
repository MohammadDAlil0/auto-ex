import { IsDefined, IsUUID } from "class-validator";

export class ExamQuestionDto {
    @IsUUID()
    @IsDefined()
    examId: string;

    @IsUUID()
    @IsDefined()
    questionId: string;
}