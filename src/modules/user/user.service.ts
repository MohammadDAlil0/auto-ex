import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { User } from 'src/models/user.model';
import { QueryParamsDto } from 'src/providers/query-parameters/dto/query-parameters';
import { GlobalQueryFilter } from 'src/providers/query-parameters/query-parameter.class';
import { Role } from 'src/types/enums';
import { CreateUserResponseDto } from '../auth/dto/create-user.response.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User) private readonly UserModel: typeof User,
        @InjectMapper() private readonly mapper: Mapper,
    ) {}

    async getAllUsers(query: QueryParamsDto): Promise<CreateUserResponseDto[]> {
        const queryFilter = new GlobalQueryFilter<User>(query)
        .setFields(['id', 'username', 'email', 'role'])
        .setSearch(['username', 'email', 'role'])
        .setPagination()
        // .setInclude([
        //     { model: Exam, as: 'createdExams', attributes: ['id', 'name'] },
        //     { model: Exam, as: 'exams', attributes: ['id', 'name'] }
        // ])
        .getOptions()
  
        const users = await this.UserModel.findAll(queryFilter);
        return this.mapper.mapArray(users, User, CreateUserResponseDto);
    }


    async deleteUser(userId: string) {
        const deletedCount = await this.UserModel.destroy<User>({
          where: { id: userId },
        });
    
        if (deletedCount === 0) {
          throw new NotFoundException('Invalid user ID');
        }
    }

}