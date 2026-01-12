export type ApiArgs<P = object, Q = object, D = object> = {
  path?: P;
  params?: Q;
  data?: D;
};

export enum AuthErrorCode {
  UNKNOWN_ERROR = 'C0001', // unknown 에러
  NETWORK_ERROR = 'C0002', // network 에러
  REQUEST_CANCELED = 'C0003', // abort 이벤트
  SERVICE_UNAVAILABLE = 'C0004', // 503
  LOGIN_FAILED = 'auth.error.login.failed',
  SESSION_EXPIRED = 'auth.error.login.required',
  LOCK_ACCOUNT = 'auth.error.account.locked',
  WRONG_PASSWORD = 'auth.error.login.credentials',
}

export enum DataType {
  OBJECT = 'OBJECT',
  ARRAY = 'ARRAY',
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  NONE = 'NONE',
}

export type BaseResponseType<T> = {
  code: number;
  dataType: DataType;
  data?: T | null;
  message: string;
  success: boolean;
};

export type ApiResponseType<TData> = {
  message: string;
  data_type: DataType;
  error_code?: AuthErrorCode;
  data?: TData | null;
  is_success: boolean;
};

export type AdapterResponseType<TData> = BaseResponseType<TData> & {
  errorCode?: AuthErrorCode;
};
