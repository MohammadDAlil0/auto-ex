import { BeforeCreate, Column, DataType, Default, IsEmail, IsNumeric, Table, Unique } from "sequelize-typescript";
import { BaseModel } from "./base.model";
import { Role } from "src/types/enums";
import { CreationOptional } from "@sequelize/core";
import { IsDate, IsOptional } from "class-validator";
import * as argon from 'argon2';
import { BadRequestException } from "@nestjs/common";

@Table({
    tableName: 'users',
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
    @Column(DataType.STRING)
    username: string;

    @Unique
    @IsEmail
    @Column(DataType.STRING)
    email: string;
  
    @Default(Role.STUDENT)
    @Column(DataType.ENUM(...Object.values(Role)))
    role: Role;
  
    @Column(DataType.STRING)
    hash: string;

    @IsNumeric
    @IsOptional()
    @Column(DataType.INTEGER)
    phoneNumber?: number;

    @Column(DataType.DATE)
    @IsDate()
    @IsOptional()
    passwordChangedAt?: Date;

    @Column(DataType.STRING)
    @IsOptional()
    passwordResetToken?: string;
  
    @Column(DataType.DATE)
    @IsDate() //Last Step
    @IsOptional()
    passwordResetExpires?: Date;

    @Column(DataType.STRING)
    verifyEmail: CreationOptional<string>;

    @BeforeCreate
    static async hashPassword(instance: User) {
        if (instance.hash) {
            instance.hash = await argon.hash(instance.hash);
        } else {
            throw new BadRequestException('Please provide a password when you are creating a user');
        }
    }

    // @BelongsToMany(() => Exam, () => ExamStudent)
    // @ForeignKey(() => ExamStudent)
    // exams: Exam[];

    // @HasMany(() => Exam, {as: 'createdExams'})
    // createdExams: Exam[];
}