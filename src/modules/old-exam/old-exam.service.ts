import { Injectable } from '@nestjs/common';
import { createOldExamDto } from './dto/create-old-exam.dto';
import { OldExam } from 'src/models/old-exam.model';
import { InjectModel } from '@nestjs/sequelize';
import { DataBaseService } from 'src/providers/database/database.service';

@Injectable()
export class OldExamService {
    constructor(
        @InjectModel(OldExam) private readonly oldExamModel: typeof OldExam,
        private readonly dataBaseService: DataBaseService
    ) {}

    async createOldExam(dto: createOldExamDto, file: Express.Multer.File) {
        console.log(file, file.filename);
        const oldExam =  await this.oldExamModel.create({
            ...dto,
            path: file.filename
        });
        console.log(oldExam);
        return oldExam;
        
    }   

    async findAllOldExams() {
        return await this.oldExamModel.findAll<OldExam>();
    }

    async deleteoldExam(examId: string) {
        await this.dataBaseService.destroyOrThrow<OldExam>(this.oldExamModel, {
            where: {
                id: examId
            }
        });
    }
}
