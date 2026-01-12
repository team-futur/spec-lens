import { type ButtonProps, SolidButton } from '@jigoooo/shared-ui';

import { FORM_HEIGHT_MD } from '@/shared/constants';

export function FuturButton({ style, disabledStyle, children, ...props }: ButtonProps) {
  return (
    <SolidButton
      style={{
        height: FORM_HEIGHT_MD,
        fontSize: '1.6rem',
        fontWeight: 700,
        borderRadius: '0.4rem',
        ...style,
      }}
      disabledStyle={{ opacity: 0.3, ...disabledStyle }}
      {...props}
    >
      {children}
    </SolidButton>
  );
}
