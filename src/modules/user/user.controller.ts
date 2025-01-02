import { Controller, Delete, Get, Param, ParseUUIDPipe, Query } from "@nestjs/common";
import { UserService } from "./user.service";
import { DeleteUserDecorators, GetAllUsersDecorators } from "src/decorators/appliers/user-appliers.decorator";
import { QueryParamsDto } from "src/providers/query-parameters/dto/query-parameters";
import { GetUsersResponseDto } from "./dto/get-users.response.dto";

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Get()
    @GetAllUsersDecorators()
    getUsers(@Query() query: QueryParamsDto): Promise<GetUsersResponseDto[]> {
        return this.userService.getAllUsers(query);
    }

    @Delete(':id')
    @DeleteUserDecorators()
    deleteUser(@Param('id', ParseUUIDPipe) userId: string) {
        return this.userService.deleteUser(userId);
    }
}
