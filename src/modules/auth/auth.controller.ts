import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDecorators, SignupDecorators } from 'src/decorators/appliers/auth-appliers.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

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
}
