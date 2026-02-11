import { BottomSheetProvider, FlexColumn, ThemeProvider } from '@jigoooo/shared-ui';
import { Outlet } from '@tanstack/react-router';
import { lazy, Suspense } from 'react';
import { preconnect, prefetchDNS } from 'react-dom';

import { RootDocument } from './root-document';
import { AlertProvider, StoreSubscriptionProvider } from '@/app/providers';
import { theme } from '@/shared/theme';

const ReactQueryDevtools = lazy(async () => {
  const module = await import('@tanstack/react-query-devtools');
  return { default: module.ReactQueryDevtools };
});

const TanStackRouterDevtools = lazy(async () => {
  const module = await import('@tanstack/react-router-devtools');
  return { default: module.TanStackRouterDevtools };
});

const PRODUCTION_API_URL = `${import.meta.env.VITE_PRODUCTION_API_URL}:${import.meta.env.VITE_API_PORT}`;

export function RootComponent() {
  if (PRODUCTION_API_URL.startsWith('http') || PRODUCTION_API_URL.startsWith('https')) {
    preconnect(PRODUCTION_API_URL);
    prefetchDNS(PRODUCTION_API_URL);
  }

  return (
    <RootDocument>
      <StoreSubscriptionProvider>
        <BottomSheetProvider>
          <ThemeProvider theme={theme}>
            <AlertProvider />

            <FlexColumn
              style={{
                height: '100vh',
                maxHeight: '100vh',
                overflow: 'hidden',
                backgroundColor: '#0a0a0a',
              }}
            >
              <Outlet />
            </FlexColumn>
          </ThemeProvider>
        </BottomSheetProvider>
      </StoreSubscriptionProvider>
      {import.meta.env.DEV ? (
        <Suspense fallback={null}>
          <ReactQueryDevtools buttonPosition='bottom-left' />
          <TanStackRouterDevtools position='bottom-right' />
        </Suspense>
      ) : null}
    </RootDocument>
  );
}
