import type { AdapterResponseType, ApiResponseType } from '../type/api-type.ts';

export class ResponseAdapter<TData> {
  private value: ApiResponseType<TData>;

  constructor(obj: ApiResponseType<TData>) {
    this.value = obj;
  }

  adapt(code: number): AdapterResponseType<TData> {
    return {
      code: code,
      errorCode: this.value.error_code,
      dataType: this.value.data_type,
      message: this.value.message,
      data: this.value.data,
      success: this.value.is_success,
    };
  }
}
