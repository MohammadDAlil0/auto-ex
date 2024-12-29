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

export function GetExamDecorator() {
    return applyDecorators(
        ApiOperation({ summary: 'Get the exam with its question if its allowed'}),
        ApiResponse({ status: 200, description: 'You will get an exam with its questions, I will get the students rolled in the exam of you are a Teacher or an Admin' }),
        Roles(Role.STUDENT, Role.TEACHER, Role.ADMIN)
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

export function AddStudentExamDecorators() {
    return applyDecorators(
        ApiOperation({ summary: 'Add student for an exam' }),
        ApiResponse({ status: 200, description: 'You will get a message' }),
        ApiBearerAuth(),
        UseGuards(JwtGuard, RolesGuard),
        Roles(Role.ADMIN, Role.TEACHER)
    )
}

export function DeleteStudentExamDecorators() {
    return applyDecorators(
        ApiOperation({ summary: 'Remove student from the current exam' }),
        ApiResponse({ status: 204, description: 'You will not get any response' }),
        ApiBearerAuth(),
        UseGuards(JwtGuard, RolesGuard),
        Roles(Role.ADMIN, Role.TEACHER),
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

export function UpdateExamQuestionDecorator() {
    return applyDecorators(
        ApiOperation({ summary: 'Update Question For An Exam' }),
        ApiResponse({ status: 200, description: 'You will get the updated question' }),
    );
}

export function RegisterExamDecorator() {
    return applyDecorators(
        ApiOperation({ summary: 'Register a student in an exam' }),
        ApiResponse({ status: 200, description: 'You will get a message' }),
        ApiBearerAuth(),
        UseGuards(JwtGuard, RolesGuard),
        Roles(Role.STUDENT, Role.ADMIN, Role.TEACHER)
    )
}

export function ChangeStatusDecorator() {
    return applyDecorators(
        ApiOperation({ summary: 'Accept or regect a user for an exam' }),
        ApiResponse({ status: 200, description: 'You will get a message' }),
        ApiBearerAuth(),
        UseGuards(JwtGuard, RolesGuard),
        Roles(Role.ADMIN, Role.TEACHER)
    )
}

export function SelectOptionDecorator() {
    return applyDecorators(
        ApiOperation({ summary: 'Select option of a question' }),
        ApiResponse({ status: 200, description: 'You will get a message' }),
        ApiBearerAuth(),
        UseGuards(JwtGuard, RolesGuard),
        Roles(Role.STUDENT)
    )
}

export function SubmitExamDecorator() {
    return applyDecorators(
        ApiOperation({ summary: 'Submit Exam' }),
        ApiResponse({ status: 200, description: 'You will get a message' }),
        ApiBearerAuth(),
        UseGuards(JwtGuard, RolesGuard),
        Roles(Role.STUDENT)
    )
}
