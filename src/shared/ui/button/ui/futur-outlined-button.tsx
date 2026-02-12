import { type ButtonProps, OutlinedButton } from '@jigoooo/shared-ui';

import { FORM_HEIGHT_MD } from '@/shared/constants';
import { useColors } from '@/shared/theme';

export function FuturOutlinedButton({ style, children, ...props }: ButtonProps) {
  const colors = useColors();

  return (
    <OutlinedButton
      style={{
        height: FORM_HEIGHT_MD,
        fontSize: '1.6rem',
        fontWeight: 700,
        color: colors.text.tertiary,
        border: `1px solid  ${colors.border.default}`,
        ...style,
      }}
      animationBackgroundColor={'#cfcfcf'}
      {...props}
    >
      {children}
    </OutlinedButton>
  );
}
