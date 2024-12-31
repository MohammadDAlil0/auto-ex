import { ExceptionFilter, Catch, ArgumentsHost, HttpException, BadRequestException } from '@nestjs/common';
import { Response } from 'express';
import { UniqueConstraintError, ValidationError } from 'sequelize';
import { GlobalResponse } from 'src/constants/responses';

@Catch(UniqueConstraintError, ValidationError, HttpException)
export class SequelizeExceptionFilter implements ExceptionFilter {
  catch(exception: UniqueConstraintError | ValidationError | HttpException | BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    console.log('Error type:', exception.constructor.name);

    if (exception instanceof UniqueConstraintError) {
      return response.status(409).json(GlobalResponse(request, response, exception, 409, exception.errors.map(error => error.message)));
    } else if (exception instanceof ValidationError) {
      return response.status(400).json(GlobalResponse(request, response, exception, 400, exception.errors.map(error => error.message)));
    } else if (exception instanceof BadRequestException) {
      const errorResponse = exception.getResponse(); 
      const message = (typeof errorResponse === 'object' && 'message' in errorResponse) ? errorResponse['message'] : errorResponse; 
      return response.status(exception.getStatus()).json(GlobalResponse(request, response, exception, exception.getStatus(), message));
    } else if (exception instanceof HttpException) {
      return response.status(exception.getStatus()).json(GlobalResponse(request, response, exception, exception.getStatus(), exception.message));
    } else {
      return response.status(500).json(GlobalResponse(request, response, exception, 500, 'Internal Error'));
    }
  }
}
