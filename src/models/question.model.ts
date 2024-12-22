import { BelongsTo, Column, DataType, ForeignKey, Table } from "sequelize-typescript";
import { BaseModel } from "./base.model";
import { User } from "./user.model";
import { AutoMap } from "@automapper/classes";

@Table({
    tableName: 'questions',
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
    
    @AutoMap()
    @ForeignKey(() => User)
    @Column(DataType.UUID)
    createdBy: string;

    @AutoMap()
    @BelongsTo(() => User, { foreignKey: 'createdBy', as: 'createdByUser' })
    createdByUser?: User;
}