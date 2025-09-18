import { Span } from '@opentelemetry/api';

export function getDefaultLogReqData(span: Span) {
  const { spanId, traceId } = span.spanContext();
  const output = {
    'span.id': spanId,
    'trace.id': traceId,
  };

  return output;
}
