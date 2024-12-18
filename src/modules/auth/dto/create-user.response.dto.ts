import { AutoMap } from "@automapper/classes";
import { UUID } from "crypto";

export class CreateUserResponseDto {
    @AutoMap()
    id: string;
        
    @AutoMap()
    username: string;
    
    @AutoMap()
    email: string;

    @AutoMap()
    phoneNumber?: number;

    @AutoMap()
    role: string; // For Testing 
}

