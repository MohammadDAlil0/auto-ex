import { applyDecorators, HttpCode, HttpStatus, UseGuards } from "@nestjs/common";
import { JwtGuard } from "src/common/guards/jwt.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { Role } from "src/types/enums";
import { ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";


export function GlobalExamDecorator() {
    return applyDecorators(
        UseGuards(JwtGuard, RolesGuard),
        Roles(Role.ADMIN, Role.TEACHER),
        ApiBearerAuth()
    );
}

export function CreateExamDecorator() {
    return applyDecorators(
        ApiOperation({ summary: 'Create Exam' }),
        ApiResponse({ status: 201, description: 'You will get the created exam' })
    );
}

export function GetAllExamsDecorator() {
    return applyDecorators(
        ApiOperation({ summary: 'Get All Exams' }),
        ApiResponse({ status: 200, description: 'You will get all the exams' })
    );
}

export function GetExam() {
    return applyDecorators(
        ApiOperation({ summary: 'Get the exam with its question if its allowed'}),
        ApiResponse({ status: 200, description: 'You will get an exam with its questions, I will get the students rolled in the exam of you are a Teacher or an Admin' }),
        Roles(Role.STUDENT, Role.TEACHER)
    )
}

export function UpdateExamDecorator() {
    return applyDecorators(
        ApiOperation({ summary: 'Update Exam' }),
        ApiResponse({ status: 200, description: 'You will get the updated exam' }),
    );
}

export function DeleteExamDecorator() {
    return applyDecorators(
        ApiOperation({ summary: 'Delete Exam' }),
        ApiResponse({ status: 204, description: 'You will not get anything' }),
        HttpCode(HttpStatus.NO_CONTENT)
    );
}

export function CreateExamQuestionDecorator() {
    return applyDecorators(
        ApiOperation({ summary: 'Add Question For An Exam' }),
        ApiResponse({ status: 201, description: 'You will get a message' }),
    );
}


export function RemoveExamQuestionDecorator() {
    return applyDecorators(
        ApiOperation({ summary: 'Remove Student From An Exam' }),
        ApiResponse({ status: 204, description: 'You will not get anything' }),
    );
}
