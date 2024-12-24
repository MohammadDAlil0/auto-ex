import { Table, Column, ForeignKey, DataType, Default } from 'sequelize-typescript';
import { BaseModel } from './base.model';
import { Exam } from './exam.model';
import { Question } from './question.model';
import { AutoMap } from '@automapper/classes';

@Table({
  tableName: 'exam_questions_table',
  timestamps: true,
})
export class ExamQuestion extends BaseModel {
  @AutoMap()
  @ForeignKey(() => Exam)
  @Column(DataType.UUID)
  examId: string;

  @AutoMap()
  @ForeignKey(() => Question)
  @Column(DataType.UUID)
  questionId: string;

  @AutoMap()
  @Default(10)
  @Column(DataType.INTEGER)
  mark: number;
}
