import { Checkbox, type CheckboxProps } from '@jigoooo/shared-ui';

export function CjCheckbox({ ...props }: CheckboxProps) {
  return (
    <Checkbox
      checkboxSize={'1rem'}
      checkIconSize={'0.46rem'}
      checkIconColor={'#ffffff'}
      checkboxStyle={{
        borderRadius: '0.2rem',
      }}
      labelStyle={{ fontSize: '0.8125rem' }}
      {...props}
    />
  );
}
