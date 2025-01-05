import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, UseGuards } from '@nestjs/common';
import { OldExamService } from './old-exam.service';
import { createOldExamDto } from './dto/create-old-exam.dto';
import { FindAllDecorator, GlobalOldExamDecorator, RemoveOldExamDecorator, UploadOldFileDecorator } from 'src/decorators/appliers/old-exam.appliers.decorator';

@GlobalOldExamDecorator()
@Controller('old-exam')
export class OldExamController {
  constructor(private readonly oldExamService: OldExamService) {}

  @Post('create')
  @UploadOldFileDecorator()
  uploadOldFile(
      @Body() dto: createOldExamDto,
      @UploadedFile(
          new ParseFilePipe({
              validators: [
                  new MaxFileSizeValidator({ maxSize: 30000000 }),
                  new FileTypeValidator({ fileType: 'application/pdf' }),
              ],
          })
      )
      file: Express.Multer.File,
  ) {
      return this.oldExamService.createOldExam(dto, file);
  }

  @Get()
  @FindAllDecorator()
  findAll() {
    return this.oldExamService.findAllOldExams();
  }

  @Delete(':id')
  @RemoveOldExamDecorator()
  remove(@Param('id') examId: string) {
    return this.oldExamService.deleteoldExam(examId);
  }
}
