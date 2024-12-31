import { AutoMap } from "@automapper/classes";

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

