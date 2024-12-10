import { Body, Controller, Post, Put, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDecorators, SignupDecorators } from 'src/decorators/appliers/auth-appliers.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
// import { JwtGuard } from 'src/common/guards/jwt.guard';
// import { RolesGuard } from 'src/common/guards/roles.guard';
// import { Roles } from 'src/decorators/auth/roles.decorator';
// import { Role } from 'src/types/enums';

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

    // @Put('changeRole')
    // // @UseGuards(JwtGuard, RolesGuard)
    // // @Roles(Role.ADMIN)
    // changeRole() {

    // }

}
