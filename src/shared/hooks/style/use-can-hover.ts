import { useCallback, useSyncExternalStore } from 'react';

const QUERY = '(hover: hover) and (pointer: fine)';

export function useCanHover() {
  const subscribe = useCallback((callback: () => void) => {
    const mq = window.matchMedia(QUERY);
    mq.addEventListener('change', callback);
    return () => mq.removeEventListener('change', callback);
  }, []);

  const getSnapshot = useCallback(() => {
    return window.matchMedia(QUERY).matches;
  }, []);

  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
