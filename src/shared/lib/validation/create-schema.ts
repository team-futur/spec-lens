import type { ValidationResult } from './create-validator.ts';

export type FieldValidationResult<K extends PropertyKey, V> = {
  field: K;
  error: boolean;
  errorMessage: string;
  value: V;
};

export type SchemaValidationResult<T extends Record<PropertyKey, unknown>> = {
  safeValues: T;
  error: boolean;
  firstError?: FieldValidationResult<PropertyKey, unknown> | null;
  errors: {
    [K in keyof T]: FieldValidationResult<K, T[K]>;
  }[keyof T][];
};

type Schema<T extends Record<PropertyKey, unknown>> = {
  [K in keyof T]: ValidatorFn<T[K], T>;
};

type ValidatorFn<Value, Row> = (value: Value, row: Row) => ValidationResult<Value>;

export function createSchema<T extends Record<PropertyKey, unknown>>(schema: Schema<T>) {
  return {
    validate(data: T): SchemaValidationResult<T> {
      const results = [] as SchemaValidationResult<T>['errors'];
      const safeValues = {} as T;

      for (const key of Object.keys(schema) as (keyof T)[]) {
        const validatorFn = schema[key] as ValidatorFn<T[typeof key], T>;
        const value = data[key] as T[typeof key];
        const res = validatorFn(value, data);

        results.push({
          field: key,
          error: res.error,
          errorMessage: res.errorMessage,
          value: res.value as T[typeof key],
        });

        safeValues[key] = res.value as T[typeof key];
      }

      return {
        safeValues,
        error: results.some((r) => r.error),
        firstError: results.find((r) => r.error),
        errors: results,
      };
    },
  };
}
