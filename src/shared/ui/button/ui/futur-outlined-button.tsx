import { type ButtonProps, OutlinedButton } from '@jigoooo/shared-ui';

import { FORM_HEIGHT_MD } from '@/shared/constants';
import { useTheme } from '@/shared/theme';

export function FuturOutlinedButton({ style, children, ...props }: ButtonProps) {
  const { theme } = useTheme();

  return (
    <OutlinedButton
      style={{
        height: FORM_HEIGHT_MD,
        fontSize: '1.6rem',
        fontWeight: 700,
        color: theme.colors.textLightDark,
        border: `1px solid  ${theme.colors.border}`,
        ...style,
      }}
      animationBackgroundColor={'#cfcfcf'}
      {...props}
    >
      {children}
    </OutlinedButton>
  );
}
