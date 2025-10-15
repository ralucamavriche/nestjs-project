import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import { PrismaClientValidationError } from 'generated/prisma/runtime/library';

type MyResponse = {
  statusCode: number;
  timestamp: string;
  path: string;
  response: string | object;
};

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const myResponse: MyResponse = {
      statusCode: 500,
      timestamp: new Date().toISOString(),
      path: request.url,
      response: '',
    };

    if (exception instanceof HttpException) {
      myResponse.statusCode = exception.getStatus();
      myResponse.response = exception.getResponse();
    } else if (exception instanceof PrismaClientValidationError) {
      myResponse.statusCode = 422;
      myResponse.response = exception.message.replaceAll('\n', ' ');
    } else {
      myResponse.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      myResponse.response = 'Internal server error';
    }

    response.status(myResponse.statusCode).json(myResponse);

    super.catch(exception, host);
  }
}
