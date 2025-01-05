import { PickType } from "@nestjs/swagger";
import { ChangeStatusDto } from "./change-status.dto";

export class AddExamStudentDto extends PickType(ChangeStatusDto, ['examId', 'studentId'])  {} 