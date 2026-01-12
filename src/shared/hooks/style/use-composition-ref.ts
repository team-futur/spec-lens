import { type CompositionEvent, useRef } from 'react';

export function useCompositionRef() {
  const isComposingRef = useRef(false);

  const handleCompositionStart = (_e: CompositionEvent<HTMLElement>) => {
    isComposingRef.current = true;
  };

  const handleCompositionEnd = (_e: CompositionEvent<HTMLElement>) => {
    isComposingRef.current = false;
  };

  return {
    isComposingRef,
    handleCompositionStart,
    handleCompositionEnd,
  };
}
