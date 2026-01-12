import { useDeferredValue } from 'react';

import { useDebounce } from '@/shared/hooks';

export function useDebounceDeferredValue<Value>(
  value: Value,
  delay = 350,
  options?: { immediateOnEmpty?: boolean },
) {
  const { immediateOnEmpty = false } = options ?? {};
  const debouncedValue = useDebounce(value, delay);

  const finalValue = immediateOnEmpty && value === '' ? value : debouncedValue;
  return useDeferredValue(finalValue);
}
