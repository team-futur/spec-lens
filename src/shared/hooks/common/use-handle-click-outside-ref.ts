import { useEffect, useRef } from 'react';

export function useHandleClickOutsideRef<T extends HTMLElement>({
  condition,
  outsideClickAction,
}: {
  condition: boolean;
  outsideClickAction: () => void;
}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!condition) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        outsideClickAction();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [condition, outsideClickAction]);

  return ref;
}
