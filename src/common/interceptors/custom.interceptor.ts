import { CallHandler, ExecutionContext, HttpException, Injectable, NestInterceptor } from "@nestjs/common";
import { catchError, map, Observable, throwError } from "rxjs";
import { SequelizeScopeError, UniqueConstraintError } from "sequelize";

@Injectable()
export class CustomResponseInterceptorDevelopment implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest();
      const response = context.switchToHttp().getResponse();
      const statusCode = response.statusCode;
      return next.handle().pipe(
          map(data => ({
            statusCode,
            message: statusCode >= 400 ? 'Error' : 'Success',
            error: statusCode >= 400 ? response.message : null,
            timestamp: Date.now(),
            version: 'v1',
            path: request.url,
            data,
          }))
      );
    }
}

@Injectable()
export class CustomResponseInterceptorProduction implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest();
      const response = context.switchToHttp().getResponse();
      const statusCode = response.statusCode;
      return next.handle().pipe(
        map(data => ({
          message: statusCode >= 400 ? 'Error' : 'Success',
          data,
        }))
      );
    }
}