import { Column, DataType, Default, IsEmail, IsNumeric, Table, Unique } from "sequelize-typescript";
import { BaseModel } from "./base.model";
import { Role } from "src/types/enums";
import { CreationOptional } from "@sequelize/core";
import { IsDate, IsOptional } from "class-validator";

@Table
export class User extends BaseModel {
    @Unique
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
    @Column(DataType.NUMBER)
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

    // @BelongsToMany(() => Exam, () => ExamStudent)
    // @ForeignKey(() => ExamStudent)
    // exams: Exam[];

    // @HasMany(() => Exam, {as: 'createdExams'})
    // createdExams: Exam[];
}