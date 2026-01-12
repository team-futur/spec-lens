import type { ExtendsBottomSheetPickerOption } from '@/shared/ui/bottom-sheet';

export type TimePickerOption = ExtendsBottomSheetPickerOption<string>;

/**
 * 현재 시간 이후부터 23:59까지 10분 간격으로 시간 옵션 생성
 */
export function generateTimeOptions(): {
  hourOptions: TimePickerOption[];
  getMinuteOptions: (selectedHour: string) => TimePickerOption[];
} {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  // 시 옵션 생성 (현재 시간 이후)
  const hourOptions: TimePickerOption[] = [];
  for (let hour = currentHour; hour <= 23; hour++) {
    hourOptions.push({
      label: `${hour.toString().padStart(2, '0')}시`,
      value: hour.toString().padStart(2, '0'),
    });
  }

  // 분 옵션 생성 함수 (선택된 시에 따라 동적으로 생성)
  const getMinuteOptions = (selectedHour: string): TimePickerOption[] => {
    const hour = parseInt(selectedHour, 10);
    const minuteOptions: TimePickerOption[] = [];

    // 10분 간격: 00, 10, 20, 30, 40, 50
    for (let minute = 0; minute <= 50; minute += 10) {
      // 현재 시간과 같은 시간대라면, 현재 분보다 이후만 추가
      if (hour === currentHour) {
        if (minute > currentMinute) {
          minuteOptions.push({
            label: `${minute.toString().padStart(2, '0')}분`,
            value: minute.toString().padStart(2, '0'),
          });
        }
      } else {
        // 미래 시간대는 모든 분 옵션 추가
        minuteOptions.push({
          label: `${minute.toString().padStart(2, '0')}분`,
          value: minute.toString().padStart(2, '0'),
        });
      }
    }

    return minuteOptions;
  };

  return {
    hourOptions,
    getMinuteOptions,
  };
}
