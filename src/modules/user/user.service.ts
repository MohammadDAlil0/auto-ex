import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "src/models";
import { DataBaseService } from "src/providers/database/database.service";
import { QueryParamsDto } from "src/providers/query-parameters/dto/query-parameters";
import { GetUsersResponseDto } from "./dto/get-users.response.dto";
import { GlobalQueryFilter } from "src/providers/query-parameters/query-parameter.class";

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User) private readonly UserModel: typeof User,
        @InjectMapper() private readonly mapper: Mapper,
        private readonly dataBaseService: DataBaseService
    ) {}

    async getAllUsers(query: QueryParamsDto): Promise<GetUsersResponseDto[]> {
        const queryFilter = new GlobalQueryFilter<User>(query, ['id', 'username', 'email', 'role'])
        .setFields()
        .setSearch()
        .setFilter()
        .setInclude([{model: User, as: 'roleChangedByUser'}])
        .setPagination()
        .getOptions()

        const users = await this.UserModel.findAll(queryFilter);
        return this.mapper.mapArray(users, User, GetUsersResponseDto);
    }


    async deleteUser(userId: string) {
        await this.dataBaseService.destroyOrThrow(this.UserModel, { where: {id: userId} });
    }
}