import { Table, Column, ForeignKey, DataType, Default } from 'sequelize-typescript';
import { BaseModel } from './base.model';
import { Exam } from './exam.model';
import { User } from './user.model';
import { AutoMap } from '@automapper/classes';
import { ExamStatus } from 'src/types/enums';

@Table({
  tableName: 'exam_students_table',
  timestamps: true,
})
export class ExamStudent extends BaseModel {
  @AutoMap()
  @ForeignKey(() => Exam)
  @Column(DataType.UUID)
  examId: string;

  @AutoMap()
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  studentId: string;

  @AutoMap()
  @Default(ExamStatus.ONQUEUE)
  @Column(DataType.ENUM(...Object.values(ExamStatus)))
  status: ExamStatus;

  @AutoMap()
  @Column(DataType.INTEGER)
  mark: number;
}
