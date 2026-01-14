import { useCallback, useSyncExternalStore } from 'react';

type Net = 'online' | 'offline';

export function useHandleNetworkState({
  handleOnline,
  handleOffline,
}: {
  handleOnline?: (e: Event) => void;
  handleOffline?: (e: Event) => void;
} = {}) {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const onOnline = (e: Event) => {
        handleOnline?.(e);
        onStoreChange();
      };
      const onOffline = (e: Event) => {
        handleOffline?.(e);
        onStoreChange();
      };

      window.addEventListener('online', onOnline);
      window.addEventListener('offline', onOffline);

      return () => {
        window.removeEventListener('online', onOnline);
        window.removeEventListener('offline', onOffline);
      };
    },
    [handleOnline, handleOffline],
  );

  const getSnapshot = useCallback<() => Net>(() => {
    if (typeof navigator === 'undefined') return 'online';
    return navigator.onLine ? 'online' : 'offline';
  }, []);

  const getServerSnapshot = useCallback<() => Net>(() => 'online', []);

  const networkState = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return { networkState };
}
