import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, MappingProfile, type Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { User } from 'src/models/user.model';
import { CreateUserResponseDto } from 'src/modules/auth/dto/create-user.response.dto';

@Injectable()
export class UserProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    override get profile(): MappingProfile {
        return (mapper: Mapper) => {
            createMap(mapper, User, CreateUserResponseDto);
        };
    }
}