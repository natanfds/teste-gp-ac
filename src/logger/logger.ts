import pino from 'pino';
import { ecsFormat } from '@elastic/ecs-pino-format';
import { Span } from '@opentelemetry/api';
import { FinishLogReqData, InitLogReqData } from '../common/types/LogData';

const internalLogger = pino(ecsFormat());

function send(
  span: Span,
  level: 'info' | 'warn' | 'error',
  logData: FinishLogReqData | InitLogReqData,
) {
  const { spanId, traceId } = span.spanContext();
  const spanData = {
    'span.id': spanId,
    'trace.id': traceId,
  };
  span.addEvent(logData.message, logData);
  internalLogger[level]({ ...spanData, ...logData });
}

export const logger = {
  info: (span: Span, logData: FinishLogReqData | InitLogReqData) =>
    send(span, 'info', logData),
  warn: (span: Span, logData: FinishLogReqData | InitLogReqData) =>
    send(span, 'warn', logData),
  error: (span: Span, logData: FinishLogReqData | InitLogReqData) =>
    send(span, 'error', logData),
};
