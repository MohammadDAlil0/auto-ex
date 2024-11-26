import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { Match } from "src/decorators/validators/confim-password.validator";

export class CreateUserDto {
    @ApiProperty({
        description: 'Username of a user',
        type: String,
        example: 'user1'
    })
    @IsString()
    @IsNotEmpty()
    username: string;
    
    @ApiProperty({
        description: 'Email of a user',
        type: String,
        example: 'user1@example.com'
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'Password of a user',
        type: String,
        minLength: 8,
        example: '12345678'
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string;

    @ApiProperty({
        description: 'Confirm your password using this',
        type: String,
        example: '12345678'
    })
    @IsString()
    @IsNotEmpty()
    @Match('password', { message: 'Passwords do not match' })
    confirmPassword: string;

    role: string; // For Testing 
}

