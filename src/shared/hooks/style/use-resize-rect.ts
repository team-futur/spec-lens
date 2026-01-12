import { type RefObject, useRef, useSyncExternalStore } from 'react';

type Rect = Readonly<{
  x: number;
  y: number;
  top: number;
  left: number;
  bottom: number;
  right: number;
  width: number;
  height: number;
}>;

const defaultRect: Rect = Object.freeze({
  x: 0,
  y: 0,
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  width: 0,
  height: 0,
});

function rectEquals(a: Rect, b: Rect) {
  return (
    a.x === b.x &&
    a.y === b.y &&
    a.top === b.top &&
    a.left === b.left &&
    a.bottom === b.bottom &&
    a.right === b.right &&
    a.width === b.width &&
    a.height === b.height
  );
}

export function useResizeRect(ref: RefObject<HTMLElement | null>) {
  // 👉 스냅샷 캐시(참조 유지)
  const rectRef = useRef<Rect>(defaultRect);

  return useSyncExternalStore(
    (onStoreChange) => {
      const el = ref.current;
      if (!el) return () => {};

      let raf = 0;
      const ro = new ResizeObserver((entries) => {
        const cr = entries[0]?.contentRect;
        if (!cr) return;

        // nextRect 생성
        const next: Rect = {
          x: cr.x ?? 0,
          y: cr.y ?? 0,
          top: cr.top ?? 0,
          left: cr.left ?? 0,
          bottom: (cr.top ?? 0) + cr.height,
          right: (cr.left ?? 0) + cr.width,
          width: cr.width,
          height: cr.height,
        };

        // 값이 실제로 변했을 때만 notify (rAF로 프레임당 1회)
        if (!rectEquals(rectRef.current, next)) {
          rectRef.current = next;
          if (!raf) {
            raf = requestAnimationFrame(() => {
              raf = 0;
              onStoreChange();
            });
          }
        }
      });

      ro.observe(el);

      return () => {
        if (raf) cancelAnimationFrame(raf);
        ro.disconnect();
      };
    },
    // ✅ 렌더 중엔 "같은 객체 참조"를 돌려준다 → 불필요 리렌더 방지
    () => rectRef.current,
    () => defaultRect,
  );
}
