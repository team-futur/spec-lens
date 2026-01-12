import { FlexColumn, SolidButton, Typography } from '@jigoooo/shared-ui';

import type { ComponentErrorPageProps } from '../model/error-type.ts';

export function ComponentErrorPage({ error, resetErrorBoundary }: ComponentErrorPageProps) {
  return (
    <FlexColumn
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100vh',
        backgroundColor: '#fcfcfc',
        gap: '1.5rem',
      }}
    >
      <Typography style={{ fontSize: '2rem', fontWeight: 600 }}>Component Error</Typography>
      <FlexColumn style={{ alignItems: 'center', justifyContent: 'center', maxWidth: '80vw' }}>
        <Typography
          style={{
            fontSize: '1.4rem',
            fontWeight: 500,
            color: '#888888',
          }}
        >
          {error?.message}
        </Typography>
      </FlexColumn>
      <SolidButton onClick={resetErrorBoundary}>새로고침</SolidButton>
    </FlexColumn>
  );
}
