import { AutoMap } from "@automapper/classes";

export class CreateExamResponseDto  {
    @AutoMap()
    id: string;

    @AutoMap()
    name: string;
    
    @AutoMap()
    duration: number;

    @AutoMap()
    date: Date;
}