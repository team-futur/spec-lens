import { ErrorBoundary } from 'react-error-boundary';

import { ComponentErrorPage } from './component-error-page';
import type { ComponentErrorProviderProps } from '../model/error-type.ts';

export function ComponentErrorProvider({ children }: ComponentErrorProviderProps) {
  return (
    <ErrorBoundary
      fallbackRender={(props) => {
        return <ComponentErrorPage {...props} />;
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
