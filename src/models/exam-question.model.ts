import { Table, Column, ForeignKey, DataType } from 'sequelize-typescript';
import { BaseModel } from './base.model';
import { Exam } from './exam.model';
import { Question } from './question.model';

@Table({
  tableName: 'exam_questions_table',
  timestamps: true,
})
export class ExamQuestion extends BaseModel {
  @ForeignKey(() => Exam)
  @Column(DataType.UUID)
  examId: string;

  @ForeignKey(() => Question)
  @Column(DataType.UUID)
  questionId: string;

  @Column(DataType.INTEGER)
  mark: number;
}
