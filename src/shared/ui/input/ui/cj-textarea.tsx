import { Textarea, type TextareaProps } from '@jigoooo/shared-ui';

import { useTheme } from '@/shared/theme';

export function CjTextarea({ style, ...props }: TextareaProps) {
  const { theme } = useTheme();

  return (
    <Textarea
      style={{
        width: '100%',
        borderRadius: '0.4rem',
        boxShadow: `inset 0 0 0 1px ${theme.colors.border}`,
        paddingInline: '1.28rem',
        paddingBlock: '1.28rem',
        fontSize: '1.6rem',
        fontWeight: 500,
        color: theme.colors.textMediumDark,
        backgroundColor: '#ffffff',
        ...style,
      }}
      focusWidth={1.4}
      focusColor={theme.colors.point1}
      {...props}
    />
  );
}
