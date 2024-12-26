import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ChangeRoleDecorator, LoginDecorators, SignupDecorators } from 'src/decorators/appliers/auth-appliers.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/decorators/auth/roles.decorator';
import { Role } from 'src/types/enums';
import { GetUser } from 'src/decorators/auth/get-user.decortator';
import { User } from 'src/models/user.model';
import { ChangeRoleDto } from './dto/change-role.dto';

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
