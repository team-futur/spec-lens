import type { RefObject } from 'react';

export type SimpleScrollbarProps = {
  scrollElementRef: RefObject<HTMLDivElement | null>;
  containerRef?: RefObject<HTMLDivElement | null>;
  useAbsolute?: boolean;
  offset?: {
    top?: number;
    right?: number;
  };
};
