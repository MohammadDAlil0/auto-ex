import { ExceptionFilter, Catch, ArgumentsHost, ConflictException, InternalServerErrorException, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { UniqueConstraintError, ValidationError } from 'sequelize';

@Catch(UniqueConstraintError, ValidationError, HttpException)
export class SequelizeExceptionFilter implements ExceptionFilter {
  catch(exception: UniqueConstraintError | ValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode = 500;
    let message = 'Internal server error';

    if (exception instanceof UniqueConstraintError) {
      statusCode = 409; // Conflict
      message = 'A record with the same unique constraint already exists.';
    } else if (exception instanceof ValidationError) {
      statusCode = 400; // Bad request
      message = 'Validation error occurred.';
    }

    response.status(statusCode).json({
      statusCode,
      message,
      // errors: exception.errors.map((err) => err.message),
    });
  }
}