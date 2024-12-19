import { PartialType } from "@nestjs/swagger";
import { CreateQuestionDto } from "./create-question.dto";

export class updateQuestionDto extends PartialType(CreateQuestionDto) {}