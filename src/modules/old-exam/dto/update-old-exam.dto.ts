import { PartialType } from '@nestjs/swagger';
import { createOldExamDto } from './create-old-exam.dto';

export class UpdateOldExamDto extends PartialType(createOldExamDto) {}
