import { Injectable, NestMiddleware } from '@nestjs/common';
import { context, trace } from '@opentelemetry/api';
import { Request, Response, NextFunction } from 'express';
import { regexUUID } from '../common/constants/regex';
import { FinishLogReqData, InitLogReqData } from '../common/types/LogData';
import { logger } from '../logger/logger';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const tracer = trace.getTracer('requests');

    const usedUUID: string[] = [];
    const maskedUrl = req.baseUrl.replace(regexUUID, (match) => {
      usedUUID.push(match);
      return '*';
    });

    const span = tracer.startSpan(`HTTP ${req.method} ${maskedUrl}`, {
      attributes: {
        'http.method': req.method,
        'http.url': maskedUrl,
        'http.version': req.httpVersion,
        'http.client.ip': req.ip,
        'http.proxy.ip': req.headers['x-forwarded-for'],
        'time.init': Date.now(),
      },
    });
    req['span'] = span;
    trace.setSpan(context.active(), span);
    if (usedUUID[0]) {
      span.setAttribute('operation.target.uuid', usedUUID[0]);
    }

    const logData: InitLogReqData = {
      message: 'Requisição recebida',
    };
    logger.info(span, logData);

    res.on('finish', () => {
      const { statusCode } = res;
      span.setAttribute('http.status_code', statusCode);
      span.setAttribute('time.finish', Date.now());
      const logData: FinishLogReqData = {
        message: 'Requisição concluída',
        'http.body': JSON.stringify(req.body),
      };
      const wasSuccess = statusCode <= 400;
      if (wasSuccess) {
        logger.info(span, logData);
        span.end();
      }
    });

    next();
  }
}
