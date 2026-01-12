import { Textarea, type TextareaProps } from '@jigoooo/shared-ui';

import { useTheme } from '@/shared/theme';

export function CjTextarea({ style, ...props }: TextareaProps) {
  const { theme } = useTheme();

  return (
    <Textarea
      style={{
        width: '100%',
        borderRadius: '0.25rem',
        boxShadow: `inset 0 0 0 1px ${theme.colors.border}`,
        paddingInline: '0.8rem',
        paddingBlock: '0.8rem',
        fontSize: '1rem',
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
