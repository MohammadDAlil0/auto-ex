import { AutoMap } from "@automapper/classes";
import { User } from "src/models";

export class GetUsersResponseDto {
    @AutoMap()
    id: string;
        
    @AutoMap()
    username: string;
    
    @AutoMap()
    email: string;

    @AutoMap()
    phoneNumber?: number;

    @AutoMap() 
    roleChangedByUserId?: string; 
    
    @AutoMap() 
    roleChangedByUsername?: string;

    @AutoMap()
    role: string; // For Testing 
}

