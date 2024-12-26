import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/models/user.model';
import { QueryParamsDto } from 'src/providers/query-parameters/dto/query-parameters';
import { GlobalQueryFilter } from 'src/providers/query-parameters/query-parameter.class';
import { CreateUserResponseDto } from '../auth/dto/create-user.response.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User) private readonly UserModel: typeof User,
        @InjectMapper() private readonly mapper: Mapper,
    ) {}

    async getAllUsers(query: QueryParamsDto): Promise<CreateUserResponseDto[]> {
        const queryFilter = new GlobalQueryFilter<User>(query, ['id', 'username', 'email', 'role'])
        .setFields()
        .setSearch()
        .setFilter()
        .setPagination()
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