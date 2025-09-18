import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { trace } from '@opentelemetry/api';
import { Request } from 'express';
import { FinishLogReqData } from 'src/common/types/LogData';
import { getDefaultLogReqData } from 'src/common/utils/getDefaultLogReqData';
import { logger } from 'src/logger/logger';

@Catch()
export class OnExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: Error, host: ArgumentsHost) {
    const internalServerErrorResponse = {
      message: 'Internal server error',
    };
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const wasHttpException = exception instanceof HttpException;
    const status = wasHttpException ? exception.getStatus() : 500;
    const span = trace.getActiveSpan();
    const { httpAdapter } = this.httpAdapterHost;
    const body = wasHttpException
      ? exception.getResponse()
      : internalServerErrorResponse;

    if (!span) {
      httpAdapter.reply(ctx.getResponse(), body, status);
      return;
    }
    const defaultData = getDefaultLogReqData(span);

    span.setAttribute('time.finish', Date.now());
    span.addEvent('A requisição falhou');

    const logData: FinishLogReqData = {
      message: 'Requisição falhou',
      ...defaultData,
      'http.body': JSON.stringify(req.body),
      'error.message': exception.message,
      'error.stack': exception.stack,
      'http.status_code': status,
    };
    logger[status === 500 ? 'error' : 'warn'](logData);

    httpAdapter.reply(ctx.getResponse(), body, status);
  }
}
