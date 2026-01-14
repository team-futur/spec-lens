import { useCallback, useEffect, useRef, useState } from 'react';

export type FieldConfig<TFieldName extends string> = {
  name: TFieldName;
  autoFocus?: boolean;
  skipIf?: () => boolean;
  validator?: (value: string) => boolean;
  transform?: (value: string) => string;
  onScan: (value: string) => void;
};

export type ScannerFieldsConfig<TFieldName extends string> = {
  fields: ReadonlyArray<FieldConfig<TFieldName>>;
  disableAutoNext?: boolean; // true일 경우 스캔 후 다음 필드로 자동 이동하지 않음
};

export type InputProps = {
  ref: (el: HTMLInputElement | null) => void;
  onFocus: () => void;
  onBlur: () => void;
};

export type UseScannerFieldsReturn<TFieldName extends string> = {
  getInputProps: (fieldName: TFieldName) => InputProps;
  handleScan: (data: string) => void;
  currentField: TFieldName | null;
  focusField: (field: TFieldName) => void;
  reset: () => void;
};

export function useScannerFields<TFieldName extends string>(
  config: ScannerFieldsConfig<TFieldName>,
): UseScannerFieldsReturn<TFieldName> {
  const refs = useRef<Map<TFieldName, HTMLInputElement>>(new Map());
  const [currentField, setCurrentField] = useState<TFieldName | null>(null);
  const configRef = useRef(config);

  // config 업데이트
  useEffect(() => {
    configRef.current = config;
  }, [config]);

  // getInputProps - 타입 안전한 ref, focus, blur
  const getInputProps = useCallback((fieldName: TFieldName): InputProps => {
    return {
      ref: (el: HTMLInputElement | null) => {
        if (el) {
          refs.current.set(fieldName, el);
        } else {
          refs.current.delete(fieldName);
        }
      },
      onFocus: () => setCurrentField(fieldName),
      onBlur: () => setCurrentField(null),
    };
  }, []);

  const moveToNext = useCallback((current: TFieldName) => {
    const currentIndex = configRef.current.fields.findIndex((f) => f.name === current);
    const nextField = configRef.current.fields[currentIndex + 1];

    if (nextField) {
      const nextInput = refs.current.get(nextField.name);
      nextInput?.focus();
    }
  }, []);

  const handleScan = useCallback(
    (data: string) => {
      const targetField = currentField ?? configRef.current.fields[0]?.name;
      if (!targetField) return;

      const fieldConfig = configRef.current.fields.find((f) => f.name === targetField);
      if (!fieldConfig) return;

      // skipIf 체크
      if (fieldConfig.skipIf?.()) {
        moveToNext(targetField);
        return;
      }

      // transform 적용
      const transformedValue = fieldConfig.transform?.(data) ?? data;

      // validator 체크
      if (fieldConfig.validator && !fieldConfig.validator(transformedValue)) {
        console.warn(`Validation failed for field: ${targetField}`);
        return;
      }

      // 값 할당
      fieldConfig.onScan(transformedValue);

      // disableAutoNext가 false일 때만 다음 필드로 이동
      if (!configRef.current.disableAutoNext) {
        moveToNext(targetField);
      }
    },
    [currentField, moveToNext],
  );

  const focusField = useCallback((field: TFieldName) => {
    const input = refs.current.get(field);
    input?.focus();
  }, []);

  const reset = useCallback(() => {
    setCurrentField(null);
    const firstField = configRef.current.fields.find((f) => f.autoFocus);
    if (firstField) {
      focusField(firstField.name);
    }
  }, [focusField]);

  useEffect(() => {
    const autoFocusField = configRef.current.fields.find((f) => f.autoFocus);
    if (autoFocusField) {
      const input = refs.current.get(autoFocusField.name);
      const timeoutId = setTimeout(() => {
        input?.focus();
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, []);

  return {
    getInputProps,
    handleScan,
    currentField,
    focusField,
    reset,
  };
}
