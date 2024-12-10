import { AutoMap } from "@automapper/classes";
import { UUID } from "crypto";

export class CreateUserResponseDto {
    @AutoMap()
    id: UUID;
        
    @AutoMap()
    username: string;
    
    @AutoMap()
    email: string;

    @AutoMap()
    phoneNumber?: number;

    @AutoMap()
    role: string; // For Testing 
}

