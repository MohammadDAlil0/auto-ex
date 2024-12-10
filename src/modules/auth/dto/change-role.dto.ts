import { IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Role } from "src/types/enums";

export class ChangeRoleDto {
    @IsEnum(Role)
    @ApiProperty({
        description: 'Role of a user',
        enum: ['GHOST', 'STUDENT', 'TEACHER', 'ADMIN']
    })
    role: Role
}