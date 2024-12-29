import { Column, DataType, ForeignKey, Table } from "sequelize-typescript";
import { BaseModel } from "./base.model";
import { AutoMap } from "@automapper/classes";
import { ExamQuestion } from "./exam-question.model";
import { User } from "./user.model";

@Table({
    tableName: 'student_question_table',
    timestamps: true,
})
export class QuestionStudent extends BaseModel {
    @AutoMap()
    @ForeignKey(() => ExamQuestion)
    @Column(DataType.UUID)
    examQuestionId: string;

    @AutoMap()
    @ForeignKey(() => User)
    @Column(DataType.UUID)
    studentId: string;

    @AutoMap()
    @Column(DataType.INTEGER)
    selectNumber: number;
}