import { Textarea, type TextareaProps } from '@jigoooo/shared-ui';

import { useColors } from '@/shared/theme';

export function CjTextarea({ style, ...props }: TextareaProps) {
  const colors = useColors();

  return (
    <Textarea
      style={{
        width: '100%',
        borderRadius: '0.4rem',
        boxShadow: `inset 0 0 0 1px ${colors.border.input}`,
        paddingInline: '1.28rem',
        paddingBlock: '1.28rem',
        fontSize: '1.6rem',
        fontWeight: 500,
        color: colors.text.secondary,
        backgroundColor: '#ffffff',
        ...style,
      }}
      focusWidth={1.4}
      focusColor={colors.interactive.primary}
      {...props}
    />
  );
}
