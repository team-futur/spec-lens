import { Checkbox, type CheckboxProps } from '@jigoooo/shared-ui';

export function CjCheckbox({ ...props }: CheckboxProps) {
  return (
    <Checkbox
      checkboxSize={'1.6rem'}
      checkIconSize={'0.736rem'}
      checkIconColor={'#ffffff'}
      checkboxStyle={{
        borderRadius: '0.32rem',
      }}
      labelStyle={{ fontSize: '1.3rem' }}
      {...props}
    />
  );
}
