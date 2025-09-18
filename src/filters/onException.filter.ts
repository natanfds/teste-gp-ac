import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request } from 'express';
import { FinishLogReqData } from 'src/common/types/LogData';
import { getDefaultLogReqData } from 'src/common/utils/getDefaultLogReqData';
import { logger } from 'src/logger/logger';

@Catch()
export class OnExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const wasHttpException = exception instanceof HttpException;
    const status = wasHttpException ? exception.getStatus() : 500;

    const defaultData = getDefaultLogReqData();
    const internalServerErrorResponse = {
      message: 'Internal server error',
    };

    const logData: FinishLogReqData = {
      message: 'Requisição falhou',
      ...defaultData,
      'http.body': JSON.stringify(req.body),
      'error.message': exception.message,
      'error.stack': exception.stack,
      'http.status_code': status,
    };
    logger[status === 500 ? 'error' : 'warn'](logData);

    const body = wasHttpException
      ? exception.getResponse()
      : internalServerErrorResponse;
    const { httpAdapter } = this.httpAdapterHost;
    httpAdapter.reply(ctx.getResponse(), body, status);
  }
}
