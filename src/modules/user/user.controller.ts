import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { AddStudentExamDecorators, DeleteUserDecorators, GetAllUsersDecorators } from 'src/decorators/appliers/user-appliers.decorator';
import { QueryParamsDto } from 'src/providers/query-parameters/dto/query-parameters';
import { CreateUserResponseDto } from '../auth/dto/create-user.response.dto';
import { AddExamStudentDto } from './dto/add-exam-student.dto';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Get()
    @GetAllUsersDecorators()
    getUsers(@Query() query: QueryParamsDto): Promise<CreateUserResponseDto[]> {
        return this.userService.getAllUsers(query);
    }

    @Patch('add-student-exam')
    @AddStudentExamDecorators()
    addStudentExan(@Body() dto: AddExamStudentDto) {
        return this.userService.addStudentExan(dto);
    }

    @Delete(':id')
    @DeleteUserDecorators()
    deleteUser(@Param('id', ParseUUIDPipe) userId: string) {
        return this.userService.deleteUser(userId);
    }
}
