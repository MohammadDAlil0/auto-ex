import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from 'src/constants/constants';
import { Role } from 'src/types/enums';

export const Roles = (...roles: Role[]) => {
    return SetMetadata(ROLES_KEY, roles)
};