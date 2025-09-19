import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Span } from '@opentelemetry/api';
import { Request } from 'express';
import { FinishLogReqData } from '../common/types/LogData';
import { logger } from '../logger/logger';

@Catch()
export class OnExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: Error, host: ArgumentsHost) {
    const internalServerErrorResponse = {
      message: 'Internal server error',
    };
    //Infos
    const wasHttpException = exception instanceof HttpException;
    const status = wasHttpException ? exception.getStatus() : 500;
    const internalError = status === 500;

    //Span
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const span = req['span'] as Span;

    const { httpAdapter } = this.httpAdapterHost;
    const body = wasHttpException
      ? exception.getResponse()
      : internalServerErrorResponse;

    const logData: FinishLogReqData = {
      message: internalError ? 'Erro de execussão' : 'Erro tratado',
      'http.body': JSON.stringify(req.body),
      'error.message': exception.message,
      'error.stack': exception.stack,
    };
    span.setAttribute('http.status_code', status);
    span.setAttribute('time.finish', Date.now());
    logger[internalError ? 'error' : 'warn'](span, logData);

    span.end();

    httpAdapter.reply(ctx.getResponse(), body, status);
  }
}
