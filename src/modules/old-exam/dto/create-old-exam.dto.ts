import { Type } from "class-transformer";
import { IsDefined, IsNotEmpty, IsString } from "class-validator";

export class createOldExamDto {
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @Type(() => Date)
    date: Date;
}