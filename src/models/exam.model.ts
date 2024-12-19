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

@Table
export class Exam extends BaseModel {
    @Unique
    @Column(DataType.STRING(36))
    name: string;
  
    @Column(DataType.INTEGER)
    duration: number;
  
    @Column(DataType.DATE)
    date: Date;

    // @BelongsToMany(() => User, () => ExamStudent)
    // students: User[];
  
    // @BelongsToMany(() => Question, () => ExamQuestion)
    // questions: Question[];

    @ForeignKey(() => User)
    @Column(DataType.UUID)
    createdBy: string;

    @BelongsTo(() => User, { foreignKey: 'createdBy', as: 'creator' })
    creator: User;
}
  