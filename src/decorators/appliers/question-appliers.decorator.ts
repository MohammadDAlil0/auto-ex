import { applyDecorators, Delete, Get, HttpCode, HttpStatus, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { JwtGuard } from "src/common/guards/jwt.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { Role } from "src/types/enums";

export function GlobalQuestionDecorator() {
    return applyDecorators(
        UseGuards(JwtGuard, RolesGuard),
        Roles(Role.TEACHER, Role.ADMIN),
        ApiBearerAuth()
    );
}

export function CreateQuestionDecorator() {
    return applyDecorators(
        ApiOperation({ summary: 'Create Question' }),
        ApiResponse({ status: 201, description: 'You will get the created Question' }),
    );
}

export function GetAllQuestionsDecorator() {
    return applyDecorators(
        ApiOperation({ summary: 'Get All Questions' }),
        ApiResponse({ status: 200, description: 'You will get all the Questions' }),
    );
}

export function UpdateQuestionDecorator() {
    return applyDecorators(
        ApiOperation({ summary: 'Update Question' }),
        ApiResponse({ status: 201, description: 'You will get the updated Question' }),
    );
}

export function DeleteQuestionDecorator() {
    return applyDecorators(
        ApiOperation({ summary: 'Delete Question' }),
        ApiResponse({ status: 204, description: 'You will not get anything' }),
        HttpCode(HttpStatus.NO_CONTENT),
    );
}