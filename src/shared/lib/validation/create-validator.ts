import { isValid, parse } from 'date-fns';

import {
  isAllDigits,
  isValidBusinessNumber,
  isValidEmail,
  isValidHomeNumber,
  isValidPhoneNumber,
} from './validator.ts';

export type ValidationResult<T> = {
  error: boolean; // 하나라도 에러가 있으면 true
  errorMessage: string; // 첫 번째 에러 메시지 (UI 표시에 주로 사용)
  errors: string[]; // 모든 에러 메시지 목록 (로그/디버깅/툴팁 등에 활용)
  value: T; // 원본 값 (성공/실패와 무관하게 반환)
};

type ValidatorOptions = {
  /** true면 모든 규칙을 끝까지 돌면서 에러를 누적, false면 첫 에러에서 사실상 중단 */
  collectAllErrors?: boolean;
};

export function createValidator<Value>(value: Value, options: ValidatorOptions = {}) {
  const { collectAllErrors = false } = options;

  let hasError = false;
  const errorList: string[] = [];

  const addError = (msg: string) => {
    hasError = true;
    errorList.push(msg);
  };

  const shouldSkip = () => !collectAllErrors && hasError;

  const validator = {
    // 타입 체크/형식 검증 (메서드명 유지)
    string({ message }: { message?: string } = {}) {
      if (shouldSkip()) return validator;
      if (typeof value !== 'string') addError(message ?? '문자만 입력할 수 있습니다.');
      return validator;
    },
    number({ message }: { message?: string } = {}) {
      if (shouldSkip()) return validator;
      if (isNaN(Number(value))) addError(message ?? '숫자만 입력할 수 있습니다.');
      return validator;
    },
    date({ parsedFormat = 'yyyyMMdd', message }: { parsedFormat?: string; message?: string } = {}) {
      if (shouldSkip()) return validator;

      if (value instanceof Date) {
        if (!isValid(value)) addError(message ?? '유효한 날짜가 아닙니다.');
        return validator;
      }

      if (typeof value !== 'string' && typeof value !== 'number') {
        addError(message ?? '입력 값이 날짜 형식이 아닙니다.');
        return validator;
      }

      const stringValue = String(value);
      if (stringValue.length !== parsedFormat.length) {
        addError(message ?? '입력 값이 날짜 형식이 아닙니다.');
        return validator;
      }

      const dateValue = parse(stringValue, parsedFormat, new Date());
      if (!isValid(dateValue)) addError(message ?? '유효한 날짜가 아닙니다.');
      return validator;
    },

    // 범용 규칙
    required({ message }: { message?: string } = {}) {
      if (shouldSkip()) return validator;
      if (value === null || value === undefined || value === '') {
        addError(message ?? '값을 입력해 주세요.');
      }
      return validator;
    },

    // 숫자/크기 비교
    min(minValue: number, { message }: { message?: string } = {}) {
      if (shouldSkip()) return validator;
      const num = Number(value);
      if (isNaN(num) || num < minValue) addError(message ?? '최소값을 벗어날 수 없습니다.');
      return validator;
    },
    max(maxValue: number, { message }: { message?: string } = {}) {
      if (shouldSkip()) return validator;
      const num = Number(value);
      if (isNaN(num) || num > maxValue) addError(message ?? '최대값을 초과할 수 없습니다.');
      return validator;
    },
    greaterThanOrEqual(minValue: number, { message }: { message?: string } = {}) {
      if (shouldSkip()) return validator;
      const num = Number(value);
      if (isNaN(num) || num < minValue) addError(message ?? `값은 ${minValue} 이상이어야 합니다.`);
      return validator;
    },
    lessThanOrEqual(maxValue: number, { message }: { message?: string } = {}) {
      if (shouldSkip()) return validator;
      const num = Number(value);
      if (isNaN(num) || num > maxValue) addError(message ?? `값은 ${maxValue} 이하여야 합니다.`);
      return validator;
    },

    // 문자열 규칙
    startsWith(prefix: string, { message }: { message?: string } = {}) {
      if (shouldSkip()) return validator;
      if (typeof value !== 'string' || !value.startsWith(prefix)) {
        addError(message ?? `문자열이 '${prefix}'로 시작하지 않습니다.`);
      }
      return validator;
    },
    endsWith(suffix: string, { message }: { message?: string } = {}) {
      if (shouldSkip()) return validator;
      if (typeof value !== 'string' || !value.endsWith(suffix)) {
        addError(message ?? `문자열이 '${suffix}'로 끝나지 않습니다.`);
      }
      return validator;
    },
    minLength(n: number, { message }: { message?: string } = {}) {
      if (shouldSkip()) return validator;
      if (typeof value !== 'string' || value.length < n) {
        addError(message ?? `문자열의 길이는 ${n}이상이어야 합니다.`);
      }
      return validator;
    },
    maxLength(n: number, { message }: { message?: string } = {}) {
      if (shouldSkip()) return validator;
      if (typeof value !== 'string' || value.length > n) {
        addError(message ?? `문자열의 길이는 ${n}이하여야 합니다.`);
      }
      return validator;
    },
    length(n: number, { message }: { message?: string } = {}) {
      if (shouldSkip()) return validator;
      if (typeof value !== 'string' || value.length !== n) {
        addError(message ?? `문자열의 길이는 ${n}이어야 합니다.`);
      }
      return validator;
    },
    includesString(substr: string, { message }: { message?: string } = {}) {
      if (shouldSkip()) return validator;
      if (typeof value !== 'string' || !value.includes(substr)) {
        addError(message ?? `문자열에 '${substr}'이 포함되어 있지 않습니다.`);
      }
      return validator;
    },

    // 포맷/도메인 규칙
    phone({ message }: { message?: string } = {}) {
      if (shouldSkip()) return validator;
      if (typeof value !== 'string' || !isValidPhoneNumber(value)) {
        addError(message ?? '유효한 전화번호가 아닙니다.');
      }
      return validator;
    },
    homeNumber({ message }: { message?: string } = {}) {
      if (shouldSkip()) return validator;
      if (typeof value !== 'string' || !isValidHomeNumber(value)) {
        addError(message ?? '유효한 집 전화번호가 아닙니다.');
      }
      return validator;
    },
    allDigits({ message }: { message?: string } = {}) {
      if (shouldSkip()) return validator;
      if (typeof value !== 'string' || !isAllDigits(value)) {
        addError(message ?? '모든 문자가 숫자여야 합니다.');
      }
      return validator;
    },
    email({ message }: { message?: string } = {}) {
      if (shouldSkip()) return validator;
      if (typeof value !== 'string' || !isValidEmail(value)) {
        addError(message ?? '유효한 이메일 주소가 아닙니다.');
      }
      return validator;
    },
    businessNumber({ message }: { message?: string } = {}) {
      if (shouldSkip()) return validator;
      if (typeof value !== 'string' || !isValidBusinessNumber(value)) {
        addError(message ?? '유효한 사업자 등록번호가 아닙니다.');
      }
      return validator;
    },
    url({ message }: { message?: string } = {}) {
      if (shouldSkip()) return validator;
      if (typeof value !== 'string') {
        addError(message ?? '문자로 입력해 주세요.');
        return validator;
      }
      try {
        new URL(value);
      } catch {
        addError(message ?? '유효한 URL이 아닙니다.');
      }
      return validator;
    },

    // 사용자 정의
    custom(validateFn: (v: Value) => boolean, { message }: { message?: string } = {}) {
      if (shouldSkip()) return validator;
      if (!validateFn(value)) addError(message ?? '사용자 정의 검증에 실패했습니다.');
      return validator;
    },

    // 끝맺음
    validate(): ValidationResult<Value> {
      return {
        error: hasError,
        errorMessage: hasError ? (errorList[0] ?? '') : '',
        errors: errorList.slice(),
        value: value as Value,
      };
    },
  };

  return validator;
}
