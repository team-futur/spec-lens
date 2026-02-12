import { type InputProps, OutlinedInput } from '@jigoooo/shared-ui';

import { FORM_HEIGHT_SM } from '@/shared/constants';
import { useColors } from '@/shared/theme';

export function CjInput({
  style,
  placeholderSize = 'md',
  ...props
}: InputProps & {
  placeholderSize?: 'md' | 'sm';
}) {
  const colors = useColors();

  return (
    <OutlinedInput
      className={`cj-placeholder-${placeholderSize}`}
      style={{
        width: '100%',
        height: FORM_HEIGHT_SM,
        borderRadius: '0.4rem',
        boxShadow: `inset 0 0 0 1px ${colors.border.input}`,
        paddingInline: '1.44rem',
        fontSize: '1.6rem',
        fontWeight: 500,
        color: colors.text.secondary,
        ...style,
      }}
      disabledStyle={{ color: colors.text.tertiary }}
      outlinedFocusWidth={1.4}
      focusColor={colors.interactive.primary}
      autoCapitalize='none'
      autoCorrect='off'
      spellCheck={false}
      {...props}
    />
  );
}
