import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

export function useQueryKeyVariables() {
  const queryClient = useQueryClient();

  return useCallback(
    <T = unknown>(queryKeyPrefix: string[]): T[] => {
      const queries = queryClient.getQueriesData({
        queryKey: queryKeyPrefix,
      });

      return queries
        .map(([queryKey]) => {
          const [_prefix, variables] = queryKey;
          return variables as T;
        })
        .filter((variables): variables is T => variables != null);
    },
    [queryClient],
  );
}
