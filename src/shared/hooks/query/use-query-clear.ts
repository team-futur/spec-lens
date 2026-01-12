import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

export function useQueryClear() {
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.clear();
  }, [queryClient]);
}
