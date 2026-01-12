import type { DatePickerProps, InputProps } from '@jigoooo/shared-ui';
import type { CSSProperties } from 'react';

export type CjDatePickerProps = {
  date?: Date;
  setDate: (date: Date) => void;
  label?: string;
  labelStyle?: CSSProperties;
  endDecoratorIconColor?: 'light' | 'dark';
  inputProps?: InputProps;
  datePickerProps?: DatePickerProps;
};
