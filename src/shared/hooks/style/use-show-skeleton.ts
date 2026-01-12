import { useEffect, useState } from 'react';

export function useShowSkeleton(isFetching: boolean, delay = 250) {
  const [delayedFetching, setDelayedFetching] = useState(false);

  // isFetching이 true일 때 delay 후 delayedFetching을 true로
  useEffect(() => {
    if (!isFetching) {
      return;
    }

    const timer = setTimeout(() => setDelayedFetching(true), delay);
    return () => clearTimeout(timer);
  }, [delay, isFetching]);

  // isFetching이 false가 되면 즉시 리셋 (0ms setTimeout으로 비동기화)
  useEffect(() => {
    if (isFetching) {
      return;
    }

    const timer = setTimeout(() => setDelayedFetching(false), 0);
    return () => clearTimeout(timer);
  }, [isFetching]);

  return {
    showSkeleton: isFetching && delayedFetching,
  };
}
