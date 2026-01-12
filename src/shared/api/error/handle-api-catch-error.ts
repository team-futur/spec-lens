import { AxiosError } from 'axios';

import { Adapter } from '../adapter/adapter';
import { ResponseAdapter } from '../adapter/response-adapter';
import {
  AuthErrorCode,
  DataType,
  type ApiResponseType,
  type AdapterResponseType,
} from '../type/api-type';

export function handleApiCatchError<T>(error: unknown): AdapterResponseType<T> {
  if (error instanceof AxiosError) {
    if (error.status === 502 || error.status === 503) {
      return {
        code: -1,
        dataType: DataType.OBJECT,
        message: '현재 서비스를 이용할 수 없습니다.\n잠시 후 다시 시도해 주세요.',
        data: null,
        success: false,
        errorCode: AuthErrorCode.SERVICE_UNAVAILABLE,
      };
    }

    if (error.code === 'ERR_CANCELED' || error.name === 'CanceledError') {
      return {
        code: -1,
        dataType: DataType.OBJECT,
        message: '요청이 취소되었습니다.',
        data: null,
        success: false,
        errorCode: AuthErrorCode.REQUEST_CANCELED,
      };
    }
    if (error.response) {
      const errorResponse = error.response;

      // 인증 관련 에러 처리
      if (errorResponse.status === 401 || errorResponse.status === 403) {
        console.clear();
      }

      return Adapter.from(errorResponse.data).to((item: ApiResponseType<T>) =>
        new ResponseAdapter(item).adapt(errorResponse.status),
      );
    }

    // 네트워크 에러 (요청은 했지만 응답 못받음)
    if (error.request) {
      return {
        code: -1,
        dataType: DataType.OBJECT,
        message: '요청에 실패하였습니다.',
        data: null,
        success: false,
        errorCode: AuthErrorCode.NETWORK_ERROR,
      };
    }

    // 요청 설정 에러
    return {
      code: -1,
      dataType: DataType.OBJECT,
      message: `요청 설정 오류: ${error.message}`,
      data: null,
      success: false,
      errorCode: AuthErrorCode.UNKNOWN_ERROR,
    };
  }

  // 일반 Error
  if (error instanceof Error) {
    return {
      code: -1,
      dataType: DataType.OBJECT,
      message: error.message,
      data: null,
      success: false,
      errorCode: AuthErrorCode.UNKNOWN_ERROR,
    };
  }

  // 알 수 없는 에러
  return {
    code: -1,
    dataType: DataType.OBJECT,
    message: '알 수 없는 에러',
    data: null,
    success: false,
    errorCode: AuthErrorCode.UNKNOWN_ERROR,
  };
}
