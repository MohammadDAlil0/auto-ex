import { Column, DataType, NotEmpty, Table } from "sequelize-typescript";
import { BaseModel } from "./base.model";
import { AutoMap } from "@automapper/classes";

@Table({
    tableName: 'old_exams_table',
    timestamps: true,
    indexes: [
        {
            fields: ['id'],
            name: "oldExamId_index"
        }
    ]
})
export class OldExam extends BaseModel {
    @AutoMap()
    @NotEmpty
    @Column(DataType.STRING)
    name: string;
  
    @AutoMap()
    @Column(DataType.DATE)
    date: Date;
  
    @AutoMap()
    @Column(DataType.STRING)
    path: string;
}
  