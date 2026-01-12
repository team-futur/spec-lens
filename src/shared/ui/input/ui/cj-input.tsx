import { type InputProps, OutlinedInput } from '@jigoooo/shared-ui';

import { FORM_HEIGHT_SM } from '@/shared/constants';
import { useTheme } from '@/shared/theme';

export function CjInput({
  style,
  placeholderSize = 'md',
  ...props
}: InputProps & {
  placeholderSize?: 'md' | 'sm';
}) {
  const { theme } = useTheme();

  return (
    <OutlinedInput
      className={`cj-placeholder-${placeholderSize}`}
      style={{
        width: '100%',
        height: FORM_HEIGHT_SM,
        borderRadius: '0.4rem',
        boxShadow: `inset 0 0 0 1px ${theme.colors.border}`,
        paddingInline: '1.44rem',
        fontSize: '1.6rem',
        fontWeight: 500,
        color: theme.colors.textMediumDark,
        ...style,
      }}
      disabledStyle={{ color: theme.colors.textLightDark }}
      outlinedFocusWidth={1.4}
      focusColor={theme.colors.point1}
      autoCapitalize='none'
      autoCorrect='off'
      spellCheck={false}
      {...props}
    />
  );
}
