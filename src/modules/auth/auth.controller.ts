import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDecorators } from 'src/decorators/appliers/auth-appliers.decorator';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    
    @Post('signup')
    @SignupDecorators()
    signup(createUserDto: CreateUserDto) {
        return this.authService.signup(createUserDto);
    }



}
