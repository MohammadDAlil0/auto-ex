import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { GetAllUsersDecorators } from 'src/decorators/appliers/user-appliers.decorator';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Get()
    @GetAllUsersDecorators()
    getUsers() {
        
    }
    
}
