import { trace, context } from '@opentelemetry/api';
import { Request } from 'express';

export function getDefaultLogReqData(req?: Request) {
  const currentSpan = trace.getSpan(context.active());
  if (!currentSpan) {
    return {};
  }
  const { spanId, traceId } = currentSpan.spanContext();
  let output = {
    'span.id': spanId,
    'trace.id': traceId,
  };

  if (req) {
    const reqData = {
      'http.method': req.method,
      'http.url': req.baseUrl || req.url,
      'http.version': req.httpVersion,
      'http.client.ip': req.ip,
      'http.proxy.ip': req.headers['x-forwarded-for'],
    };
    output = { ...output, ...reqData };
  }

  return output;
}
