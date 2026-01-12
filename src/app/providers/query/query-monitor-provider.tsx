import { useQueryClient } from '@tanstack/react-query';
import { useRef, useEffect, type ReactNode } from 'react';

// import { handleQueryAndMutationError } from '@/features/query-handler';
// import { Router } from '@/shared/router';
// import { Adapter, type ApiResponseType, ResponseAdapter } from '@/shared/api';
import { useHandleNetworkState } from '@/shared/hooks';

export function QueryMonitorProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const isHandlingError = useRef(false);

  const { networkState } = useHandleNetworkState();

  useEffect(() => {
    const unsubscribeQuery = queryClient.getQueryCache().subscribe(async (event) => {
      if (event.type !== 'updated' || isHandlingError.current) {
        return;
      }

      const query = event.query;
      const action = event.action;

      if (action.type !== 'error' && action.type !== 'failed') {
        return;
      }

      if (networkState === 'online' && query.state.error) {
        isHandlingError.current = true;

        // console.log('QueryMonitorProvider Query Error: ', event);

        // const data = Adapter.from(query.state.error.response?.data).to(
        //   (item: ApiResponseType<null>) =>
        //     new ResponseAdapter(item).adapt(query.state.error.status),
        // );

        // const hasError = await handleQueryAndMutationError({
        //   data,
        //   onUnauthenticated: () => navigate(Router.INDEX, { replace: true }),
        //   onRefreshSuccess: () => event.query.observers[0].refetch(),
        // });

        // if (!hasError) {
        //   isHandlingError.current = false;
        // }

        setTimeout(() => {
          isHandlingError.current = false;
        }, 100);
      }
    });

    const unsubscribeMutation = queryClient.getMutationCache().subscribe(async (event) => {
      if (event.type !== 'updated' || isHandlingError.current) {
        return;
      }

      const mutation = event.mutation;
      const action = event.action;

      if (action.type !== 'error' && action.type !== 'failed') {
        return;
      }

      if (networkState === 'online' && mutation.state.error) {
        // console.log('QueryMonitorProvider Mutation Error: ', event);

        isHandlingError.current = true;

        // const data = Adapter.from(mutation.state.error.response?.data).to(
        //   (item: ApiResponseType<null>) =>
        //     new ResponseAdapter(item).adapt(mutation.state.error.status),
        // );
        //
        // const mutationFn = mutation?.options?.mutationFn;
        // const variables = mutation?.state.variables;

        // const hasError = await handleQueryAndMutationError({
        //   data,
        //   onUnauthenticated: () => navigate(Router.INDEX, { replace: true }),
        //   onRefreshSuccess: async () => {
        //     if (mutationFn && variables) {
        //       const context = mutation?.options?.onMutate?.(variables);
        //       try {
        //         const value = await mutationFn(variables);
        //
        //         mutation?.options?.onSuccess?.(value, variables, context);
        //         mutation?.options?.onSettled?.(value, null, variables, context);
        //       } catch (error) {
        //         mutation?.options?.onError?.(error, variables, context);
        //         mutation?.options?.onSettled?.(undefined, error, variables, context);
        //       }
        //     }
        //   },
        // });
        //
        // if (!hasError) {
        //   isHandlingError.current = false;
        // }

        setTimeout(() => {
          isHandlingError.current = false;
        }, 100);
      }
    });

    return () => {
      unsubscribeQuery();
      unsubscribeMutation();
    };
  }, [networkState, queryClient]);

  return <>{children}</>;
}
