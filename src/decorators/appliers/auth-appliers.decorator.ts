import { applyDecorators, Delete, Get, HttpCode, HttpStatus, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/types/enums';
import { Roles } from '../auth/roles.decorator';
// import { JwtGuard } from '../guard/jwt.guard';
// import { Roles } from './role.decorator';
// import { RolesGuard } from '../guard/roles.guard';
// import { Role } from '../user.entity';
// import { CacheInterceptor } from '@nestjs/cache-manager';

export function SignupDecorators() {
  return applyDecorators(
    ApiOperation({ summary: 'Signup A User' }),
    ApiResponse({ status: 201, description: 'You will get an access token' }),
  );
}

export function LoginDecorators() {
    return applyDecorators(
        ApiOperation({ summary: 'Login A User' }),
        ApiResponse({ status: 201, description: 'You will get an access token' }),
        HttpCode(200)
    );
}

export function ChangeRoleDecorator() {
    return applyDecorators(
        ApiOperation({ summary: "Change A User's Role" }),
        ApiResponse({ status: 200, description: 'You will get the updated user' }),
        ApiBearerAuth(),
        UseGuards(JwtGuard, RolesGuard),
        Roles(Role.ADMIN),
        Put('changeRole/:userId')
    );
}

// export function DeleteUserDecorators() {
//     return applyDecorators(
//         ApiOperation({ summary: 'Delete A User' }),
//         ApiResponse({ status: 204, description: 'You will not get any response' }),
//         ApiBearerAuth(),
//         UseGuards(JwtGuard, RolesGuard),
//         Roles(Role.ADMIN),
//         HttpCode(HttpStatus.NO_CONTENT),
//         Delete(':id')
//     );
// }