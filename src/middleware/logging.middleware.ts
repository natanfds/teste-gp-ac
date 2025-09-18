import { Injectable, NestMiddleware } from '@nestjs/common';
import { context, trace } from '@opentelemetry/api';
import { Request, Response, NextFunction } from 'express';
import { FinishLogReqData, InitLogReqData } from 'src/common/types/LogData';
import { getDefaultLogReqData } from 'src/common/utils/getDefaultLogReqData';
import { logger } from 'src/logger/logger';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const tracer = trace.getTracer('requests');
    const span = tracer.startSpan(`HTTP ${req.method} ${req.url}`, {
      attributes: {
        'http.method': req.method,
        'http.url': req.baseUrl || req.url,
        'http.version': req.httpVersion,
        'http.client.ip': req.ip,
        'http.proxy.ip': req.headers['x-forwarded-for'],
        'time.init': Date.now(),
      },
    });
    trace.setSpan(context.active(), span);
    span.addEvent('Requisição recebida');
    const defaultData = getDefaultLogReqData(span);
    const logData: InitLogReqData = {
      message: 'Requisição recebida',
      ...defaultData,
    };
    logger.info(logData);

    res.on('finish', () => {
      const { statusCode } = res;
      if (statusCode < 400) {
        const logData: FinishLogReqData = {
          message: 'Requisição concluída',
          ...defaultData,
          'http.status_code': statusCode,
          'http.body': JSON.stringify(req.body),
        };
        span.addEvent('Requisição concluída');
        logger.info(logData);
      }
      span.end();
    });

    next();
  }
}
