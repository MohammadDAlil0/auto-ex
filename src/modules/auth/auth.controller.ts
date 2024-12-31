import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ChangeRoleDecorator, LoginDecorators, SignupDecorators } from 'src/decorators/appliers/auth-appliers.decorator';
import { GetUser } from 'src/decorators/auth/get-user.decortator';
import { User } from 'src/models/user.model';
import { ChangeRoleDto, CreateUserDto, LoginDto } from './dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    @SignupDecorators()
    signup(@Body() createUserDto: CreateUserDto) {
        return this.authService.signup(createUserDto);
    }

    @Post('login')
    @LoginDecorators()
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto); 
    }

    @Put('changeRole/:userId')
    @ChangeRoleDecorator()
    changeRole(@GetUser() curUser: User, @Param('userId') userId: string, @Body() dto: ChangeRoleDto) {
        return this.authService.changeRole(curUser, userId, dto);
    }
}
