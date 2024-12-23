import { AutoMap } from "@automapper/classes";

export class CreateExamQuestionResponseDto {
    @AutoMap()
    id: string;

    @AutoMap()
    examId: string;

    @AutoMap()
    questionId: string;

    @AutoMap()
    mark: string;
}