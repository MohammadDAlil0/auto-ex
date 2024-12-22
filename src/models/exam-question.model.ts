import { Table, Column, ForeignKey } from 'sequelize-typescript';
import { BaseModel } from './base.model';
import { Exam } from './exam.model';
import { Question } from './question.model';

@Table({
  tableName: 'exam_questions',
  timestamps: true,
})
export class ExamQuestion extends BaseModel {
  @ForeignKey(() => Exam)
  @Column
  examId: string;

  @ForeignKey(() => Question)
  @Column
  questionId: string;
}
