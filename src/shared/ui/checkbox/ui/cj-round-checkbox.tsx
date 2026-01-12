import { type CheckboxProps } from '@jigoooo/shared-ui';

import { CjCheckbox } from './cj-checkbox.tsx';

export function CjRoundCheckbox({ ...props }: CheckboxProps) {
  return <CjCheckbox checkboxStyle={{ borderRadius: '50%' }} {...props} />;
}
