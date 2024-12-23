import { applyDecorators, HttpCode, HttpStatus, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { JwtGuard } from "src/common/guards/jwt.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { Role } from "src/types/enums";

export function GetAllUsersDecorators() {
    return applyDecorators(
        ApiOperation({ summary: 'Get All Users' }),
        ApiResponse({ status: 200, description: 'You will get a list of users' }),
        ApiBearerAuth(),
        UseGuards(JwtGuard, RolesGuard),
        Roles(Role.ADMIN)
    );
}

export function DeleteUserDecorators() {
    return applyDecorators(
        ApiOperation({ summary: 'Delete A User' }),
        ApiResponse({ status: 204, description: 'You will not get any response' }),
        ApiBearerAuth(),
        UseGuards(JwtGuard, RolesGuard),
        Roles(Role.ADMIN),
        HttpCode(HttpStatus.NO_CONTENT)
    );
}

export function AddStudentExamDecorators() {
    return applyDecorators(
        ApiOperation({ summary: 'Add student for an exam' }),
        ApiResponse({ status: 200, description: 'You will get a message' }),
        ApiBearerAuth(),
        UseGuards(JwtGuard),
    )
}