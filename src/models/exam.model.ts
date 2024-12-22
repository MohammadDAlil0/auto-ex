import {
    Table,
    Column,
    DataType,
    BelongsToMany,
    BelongsTo,
    ForeignKey,
    Unique,
} from 'sequelize-typescript';
import { BaseModel } from './base.model';
import { User } from './user.model';
import { AutoMap } from '@automapper/classes';
import { Question } from './question.model';
import { ExamQuestion } from './exam-question.model';

@Table({
    tableName: 'exams',
    timestamps: true,
    indexes: [
        {
            fields: ['id'],
            name: 'examId_index'
        },
        {
            fields: ['createdBy'],
            name: 'createdBy_index'
        }
    ]
})
export class Exam extends BaseModel {
    @AutoMap()
    @Unique
    @Column(DataType.STRING(36))
    name: string;
  
    @AutoMap()
    @Column(DataType.INTEGER)
    duration: number;
  
    @AutoMap()
    @Column(DataType.DATE)
    date: Date;

    // @BelongsToMany(() => User, () => ExamStudent)
    // students: User[];
  
    @BelongsToMany(() => Question, () => ExamQuestion)
    questions: Question[];

    @ForeignKey(() => User)
    @Column(DataType.UUID)
    createdBy: string;

    @BelongsTo(() => User, { foreignKey: 'createdBy', as: 'creator' })
    creator: User;
}
  