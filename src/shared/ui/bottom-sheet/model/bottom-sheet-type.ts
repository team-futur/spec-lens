export type BottomSheetPickerValue = string | number | null | undefined;
export type ExtendsBottomSheetPickerOption<Value extends BottomSheetPickerValue> = {
  label: string;
  value: Value;
};

export type BottomSheetPickerProps<
  Value extends BottomSheetPickerValue,
  Option extends ExtendsBottomSheetPickerOption<Value>,
> = {
  title?: string;
  value?: Value | null;
  onChange?: (value: Value) => void;
  onConfirm?: (value: Value) => void;
  options: Option[];
  confirmLabel?: string;
  close?: () => void;
};
