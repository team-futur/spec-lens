import { type KeyboardEvent, useEffect, useState } from 'react';

export function useCapsLockState() {
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);

  // 초기 Caps Lock 상태 체크
  useEffect(() => {
    const checkInitialCapsLock = (event: KeyboardEvent) => {
      if (event.getModifierState) {
        const isCaps = event.getModifierState('CapsLock');
        setIsCapsLockOn(isCaps);
      }
    };

    // 첫 번째 키 입력으로 상태 확인
    const handleFirstKeyPress = (event: any) => {
      checkInitialCapsLock(event);
    };

    document.addEventListener('keydown', handleFirstKeyPress, { once: true });

    return () => {
      document.removeEventListener('keydown', handleFirstKeyPress);
    };
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.getModifierState) {
      const isCaps = event.getModifierState('CapsLock');
      setIsCapsLockOn(isCaps);
    }
  };

  return {
    isCapsLockOn,
    handleKeyDown,
  };
}
