import { useEffect } from 'react';

export function useModalHistory(isOpen: boolean, onClose: () => void) {
  useEffect(() => {
    if (!isOpen) return;

    const timeoutId = setTimeout(() => {
      window.history.pushState({ modal: true }, '');
    }, 0);

    const handlePopState = () => {
      onClose();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isOpen, onClose]);
}
