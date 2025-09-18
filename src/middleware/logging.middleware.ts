import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { FinishLogReqData, InitLogReqData } from 'src/common/types/LogData';
import { getDefaultLogReqData } from 'src/common/utils/getDefaultLogReqData';
import { logger } from 'src/logger/logger';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const defaultData = getDefaultLogReqData(req);

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
        logger.info(logData);
      }
    });

    next();
  }
}
