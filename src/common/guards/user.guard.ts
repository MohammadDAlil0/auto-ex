import { CanActivate, ExecutionContext, Injectable, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class UserApi implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const curUser = request.user;
    const userId = request.params.userId;

    if (curUser.id === userId) {
      throw new BadRequestException("You can't do this action on yourself");
    }

    return true;
  }
}
