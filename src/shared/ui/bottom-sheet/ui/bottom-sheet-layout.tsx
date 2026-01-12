import { CloseIconButton, FlexColumn, FlexRow, Typography } from '@jigoooo/shared-ui';
import type { ReactNode } from 'react';

import { CONTENT_BLOCK_SIZE } from '@/shared/constants';
import { useTheme } from '@/shared/theme';

export function BottomSheetLayout({ title, children }: { title?: string; children: ReactNode }) {
  const { theme } = useTheme();

  return (
    <FlexColumn>
      <FlexRow
        style={{
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingInline: '1rem',
          paddingBottom: CONTENT_BLOCK_SIZE,
        }}
      >
        <Typography style={{ fontSize: '1.125rem', fontWeight: 700 }}>{title}</Typography>
        <CloseIconButton
          iconSize={'1.5rem'}
          color={theme.colors.textLightDark}
          close={() => window.history.back()}
        />
      </FlexRow>

      <div style={{ width: '100%', height: 1, backgroundColor: '#d8d8d8' }} />

      {children}
    </FlexColumn>
  );
}
