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

export class BaseModel extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    id: CreationOptional<UUID>;

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

    @DeletedAt
    @Column({ field: 'deletedAt', type: DataType.DATE })
    deletedAt: Date | null;

    @Column({ type: DataType.STRING(36), allowNull: true })
    createdBy: string | null;

    @Column({ type: DataType.STRING(36), allowNull: true })
    updatedBy: string | null;

    @Column({ type: DataType.STRING(36), allowNull: true })
    deletedBy: string | null;
}
