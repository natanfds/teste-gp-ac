import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Counter, Histogram } from 'prom-client';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { maskUrl } from 'src/common/utils/maskUrl';

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  constructor(
    @InjectMetric('http_requests_total')
    private readonly httpRequestsTotal: Counter<string>,

    @InjectMetric('http_request_duration_seconds')
    private readonly httpRequestDuration: Histogram<string>,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const routeIdentifier = {
      method: req.method,
      route: maskUrl(req.baseUrl),
    };

    const end = this.httpRequestDuration.startTimer(routeIdentifier);

    res.on('finish', () => {
      this.httpRequestsTotal.inc({
        ...routeIdentifier,
        status_code: res.statusCode,
      });

      end({ status_code: res.statusCode });
    });

    next();
  }
}
