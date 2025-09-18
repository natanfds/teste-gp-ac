export type InitLogReqData = {
  message: string;
};

export type FinishLogReqData = InitLogReqData & {
  'http.status_code': number;
  'http.body': string;
  'error.message'?: string | undefined;
  'error.stack'?: string | undefined;
};
