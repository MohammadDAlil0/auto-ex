import {
    Column,
    DataType,
    CreatedAt,
    UpdatedAt,
    DeletedAt,
    Model,
    Default,
    PrimaryKey
} from 'sequelize-typescript';
import { CreationOptional } from '@sequelize/core';
import { UUID } from 'crypto';
import { AutoMap } from '@automapper/classes';

export class BaseModel extends Model {
    @AutoMap()
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    id: string;

    @CreatedAt
    @Column({
        field: 'createdAt',
        type: DataType.DATE,
        defaultValue: DataType.NOW
    })
    createdAt: CreationOptional<Date> | null;

    @UpdatedAt
    @Column({
        field: 'updatedAt',
        type: DataType.DATE,
        defaultValue: DataType.NOW
    })
    updatedAt: CreationOptional<Date> | null;
}
