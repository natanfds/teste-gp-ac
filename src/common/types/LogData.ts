export type DefaultLogReqData = {
  'span.id'?: string | undefined;
  'trace.id'?: string | undefined;
  'http.method'?: string | undefined;
  'http.url'?: string | undefined;
  'http.version'?: string | undefined;
  'http.client.ip'?: string | undefined;
  'http.proxy.ip'?: string | string[] | undefined;
};

export type InitLogReqData = DefaultLogReqData & {
  message: string;
};

export type FinishLogReqData = InitLogReqData & {
  'http.status_code': number;
  'http.body': string;
  'error.message'?: string | undefined;
  'error.stack'?: string | undefined;
};
