import { ExceptionFilter, Catch, ArgumentsHost, HttpException, BadRequestException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ConnectionRefusedError, UniqueConstraintError, ValidationError } from 'sequelize';
import { GlobalResponse } from 'src/constants/responses';

@Catch(BadRequestException)
export class badRequestExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    response.status(exception.getStatus()).json(GlobalResponse({
      path: request.url,
      statusCode: exception.getStatus(),
      messages: (exception.getResponse() as any).message || 'Bad Exception'
    }));
  }
}

@Catch(HttpException)
export class httpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    console.log(exception.constructor.name);
    response.status(exception.getStatus()).json(GlobalResponse({
      path: request.url,
      statusCode: exception.getStatus(),
      messages: [exception.message]
    }));
  }
}

@Catch(UniqueConstraintError, ValidationError, ConnectionRefusedError)
export class SequelizeExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        if (exception instanceof ConnectionRefusedError) {
          return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(GlobalResponse({
            path: request.url,
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            messages: ['Unable to connect to the database'],
          }))
        }

        response.status(HttpStatus.BAD_REQUEST).json(GlobalResponse({
          path: request.url,
          statusCode: HttpStatus.BAD_REQUEST,
          messages: exception.errors.map((e: any) => e.message),
      }));
    }
}