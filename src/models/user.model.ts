import { AfterCreate, AfterFind, AfterSave, AfterUpdate, BeforeCreate, BelongsTo, BelongsToMany, Column, DataType, Default, ForeignKey, IsEmail, IsNumeric, Table, Unique } from "sequelize-typescript";
import { BaseModel } from "./base.model";
import { Role } from "src/types/enums";
import { CreationOptional } from "@sequelize/core";
import { IsDate, IsOptional } from "class-validator";
import * as argon from 'argon2';
import { BadRequestException } from "@nestjs/common";
import { AutoMap } from "@automapper/classes";
import { Exam } from "./exam.model";
import { ExamStudent } from "./exam-student.model";

@Table({
    tableName: 'usersTable',
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

    @AutoMap()
    @IsOptional()
    @ForeignKey(() => User)
    @Column(DataType.UUID)
    roleChangedBy?: string;

    @BelongsTo(() => User, { foreignKey: 'roleChangedBy', as: 'roleChangedByUser' })
    roleChangedByUser?: User;

    @BeforeCreate
    static async hashPassword(instance: User) {
        if (instance.hash) {
            instance.hash = await argon.hash(instance.hash);
        } else {
            throw new BadRequestException('Please provide a password when you are creating a user');
        }
    }

    // @BelongsToMany(() => Exam, () => ExamStudent)
    // examsList: Exam[];

    // @HasMany(() => Exam, {as: 'createdExams'})
    // createdExams: Exam[];
}