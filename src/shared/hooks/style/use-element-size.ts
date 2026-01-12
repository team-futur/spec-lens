import { useCallback, useSyncExternalStore, type RefObject } from 'react';

export function useElementSize(ref: RefObject<HTMLElement | null>): {
  width: number;
  height: number;
} {
  const subscribe = useCallback(
    (callback: () => void) => {
      const element = ref.current;
      if (!element) {
        return () => {};
      }

      const observer = new ResizeObserver(callback);
      observer.observe(element);

      return () => observer.disconnect();
    },
    [ref],
  );

  const getSnapshot = useCallback(() => {
    const element = ref.current;
    if (!element) {
      return { width: 0, height: 0 };
    }

    const { width, height } = element.getBoundingClientRect();
    return { width, height };
  }, [ref]);

  const getServerSnapshot = useCallback(() => ({ width: 0, height: 0 }), []);

  // useSyncExternalStore는 참조 동일성으로 변경을 감지하므로
  // 실제 값이 변경되었을 때만 리렌더링되도록 JSON 문자열로 비교
  const sizeString = useSyncExternalStore(
    subscribe,
    () => JSON.stringify(getSnapshot()),
    () => JSON.stringify(getServerSnapshot()),
  );

  return JSON.parse(sizeString);
}
