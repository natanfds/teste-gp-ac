export type InitLogReqData = {
  message: string;
};

export type FinishLogReqData = InitLogReqData & {
  'http.body': string;
  'error.message'?: string | undefined;
  'error.stack'?: string | undefined;
};
