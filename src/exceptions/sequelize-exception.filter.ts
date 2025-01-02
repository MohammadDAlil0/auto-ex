import { ExceptionFilter, Catch, ArgumentsHost, HttpException, BadRequestException } from '@nestjs/common';
import { Response } from 'express';
import { UniqueConstraintError, ValidationError } from 'sequelize';
import { GlobalResponse } from 'src/constants/responses';

@Catch(HttpException)
export class httpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    console.log(exception.constructor().name);

    response.status(exception.getStatus()).json(GlobalResponse({
      path: request.url,
      statusCode: exception.getStatus(),
      messages: [exception.message]
    }));
  }
}

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

@Catch(UniqueConstraintError, ValidationError)
export class SequelizeExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        response.status(409).json(GlobalResponse({
          path: request.url,
          statusCode: 409,
          messages: exception.errors.map((e: any) => e.message),
      }));
    }
}