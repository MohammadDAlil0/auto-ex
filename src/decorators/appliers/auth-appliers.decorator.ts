import { applyDecorators, Delete, Get, HttpCode, HttpStatus, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
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

// export function LoginDecorators() {
//     return applyDecorators(
//         ApiOperation({ summary: 'Login A User' }),
//         ApiResponse({ status: 201, description: 'You will get an access token' }),
//         Post('login')
//     );
// }

// export enum UserFilter {
//     USERNAME = 'USERNAME',
//     EMAIL = 'EMAIL',
//     ROLE = 'ROLE',
// }

// export function GetAllUsersDecorators() {
//     return applyDecorators(
//         UseInterceptors(CacheInterceptor),
//         ApiOperation({ summary: 'Get All Users' }),
//         ApiResponse({ status: 200, description: 'You will get a list of users' }),
//         ApiBearerAuth(),
//         UseGuards(JwtGuard, RolesGuard),
//         Roles(Role.ADMIN, Role.TEACHER),
//         Get()
//     );
// }

// export function ChangeRoleDecorator() {
//     return applyDecorators(
//         ApiOperation({ summary: "Change A User's Role" }),
//         ApiResponse({ status: 200, description: 'You will get the updated user' }),
//         ApiBearerAuth(),
//         UseGuards(JwtGuard, RolesGuard),
//         Roles(Role.ADMIN),
//         Put('changeRole/:id')
//     );
// }

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