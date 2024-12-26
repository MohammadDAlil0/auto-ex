import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Table } from "sequelize-typescript";
import { BaseModel } from "./base.model";
import { User } from "./user.model";
import { AutoMap } from "@automapper/classes";
import { Exam } from "./exam.model";
import { ExamQuestion } from "./exam-question.model";

@Table({
    tableName: 'questions_table',
    timestamps: true,
    indexes: [
        {
            fields: ['id'],
            name: 'questionId_index'
        },
        {
            fields: ['createdBy'],
            name: 'createdBy_index'
        }
    ]
})
export class Question extends BaseModel {
    @AutoMap()
    @Column(DataType.STRING)
    description: string;

    @AutoMap()
    @Column(DataType.TEXT)
    options: string;
  
    @AutoMap()
    @Column(DataType.INTEGER)
    answer: number;

    // @BelongsToMany(() => Exam, () => ExamQuestion)
    // examsList: Exam[];
    
    @AutoMap()
    @ForeignKey(() => User)
    @Column(DataType.UUID)
    createdBy: string;

    @AutoMap()
    @BelongsTo(() => User, { foreignKey: 'createdBy', as: 'createdByUser' })
    createdByUser?: User;
}