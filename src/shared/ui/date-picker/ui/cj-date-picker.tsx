import { MobileDatePicker, Typography } from '@jigoooo/shared-ui';

import { Calendar } from 'lucide-react';

import type { CjDatePickerProps } from '../model/date-picker-type.ts';
import { CjInput } from '@/shared/ui/input';

export function CjDatePicker({
  date,
  setDate,
  label,
  labelStyle,
  endDecoratorIconColor = 'light',
  inputProps = {},
  datePickerProps = {},
}: CjDatePickerProps) {
  return (
    <MobileDatePicker
      containerStyle={{ width: '100%' }}
      strategy={'fixed'}
      value={date}
      onChange={(value) => {
        setDate(value);
      }}
      InputComponent={({ dateString, openDatePicker }) => (
        <CjInput
          value={dateString}
          onClick={openDatePicker}
          readOnly
          startDecorator={
            label ? (
              <Typography
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  paddingLeft: '0.2rem',
                  color: inputProps?.style?.color,
                  ...labelStyle,
                }}
              >
                {label}
              </Typography>
            ) : null
          }
          endDecorator={
            <Calendar
              onClick={openDatePicker}
              color={endDecoratorIconColor === 'light' ? '#ffffff' : '#666666'}
            />
          }
          {...inputProps}
        />
      )}
      {...datePickerProps}
    />
  );
}
