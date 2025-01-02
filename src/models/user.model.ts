import { BeforeCreate, BelongsTo, Column, DataType, Default, ForeignKey, IsEmail, IsNumeric, NotEmpty, Table, Unique } from "sequelize-typescript";
import { BaseModel } from "./base.model";
import { Role } from "src/types/enums";
import { CreationOptional } from "@sequelize/core";
import * as argon from 'argon2';
import { BadRequestException } from "@nestjs/common";
import { AutoMap } from "@automapper/classes";

@Table({
    tableName: 'user_table',
    timestamps: true,
    indexes: [
        {
            fields: ['id'],
            name: 'userId_index'
        },
        {
            fields: ['email'],
            name: 'email_index'
        }
    ]
})
export class User extends BaseModel {
    @AutoMap()
    @NotEmpty
    @Column(DataType.STRING)
    username: string;

    @AutoMap()
    @Unique
    @IsEmail
    @Column(DataType.STRING)
    email: string;
  
    @AutoMap()
    @Default(Role.GHOST)
    @Column(DataType.ENUM(...Object.values(Role)))
    role: Role;
  
    @Column(DataType.STRING)
    hash: string;

    @AutoMap()
    @IsNumeric
    @Column(DataType.INTEGER)
    phoneNumber?: number;

    @Column(DataType.DATE)
    passwordChangedAt?: Date;

    @Column(DataType.STRING)
    passwordResetToken?: string;
  
    @Column(DataType.DATE)
    passwordResetExpires?: Date;

    @Column(DataType.STRING)
    verifyEmail: CreationOptional<string>;

    @AutoMap()
    @ForeignKey(() => User)
    @Column(DataType.UUID)
    roleChangedBy?: string;

    @BelongsTo(() => User, { foreignKey: 'roleChangedBy', as: 'roleChangedByUser' })
    roleChangedByUser?: User;
    ExamStudent: any;

    @BeforeCreate
    static async hashPassword(instance: User) {
        if (instance.hash) {
            instance.hash = await argon.hash(instance.hash);
        } else {
            throw new BadRequestException('Please provide a password when you are creating a user');
        }
    }
}