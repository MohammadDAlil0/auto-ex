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
            })),
            catchError(err => {
              const statusCode = err instanceof HttpException ? err.getStatus() : 500;
              let messages = ['Internal server error'];
              if (err.response && err.response.message) {
                messages = err.response.message;
              }
              if (err instanceof UniqueConstraintError) {
                messages = err.errors.map(e => e.message);
              }
              const errorResponse = {
              statusCode,
              messages: messages,
              error: err.name || 'Error',
              timestamp: Date.now(),
              version: 'v1',
              path: request.url,
              data: err,
            };
              return throwError(() => new HttpException(errorResponse, statusCode));
            })
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
            })),
            catchError(err => {
              const statusCode = err instanceof HttpException ? err.getStatus() : 500;
              let messages = ['Internal server error'];
              if (err.response && err.response.message) {
                messages = err.response.message;
              }
              if (err instanceof UniqueConstraintError) {
                messages = err.errors.map(e => e.message);
              }
              const errorResponse = {
                messages: messages,
                error: err.name || 'Error',
              };
              return throwError(() => new HttpException(errorResponse, statusCode));
            })
        );
    }
}