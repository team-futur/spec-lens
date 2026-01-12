import { zIndex } from '@jigoooo/shared-ui';
import { useEffect, useRef, useState } from 'react';

import { type SimpleScrollbarProps } from '../model/scroll-type';

export function SimpleScrollbar({
  scrollElementRef,
  containerRef,
  useAbsolute = false,
  offset = {
    top: 0,
    right: 0,
  },
}: SimpleScrollbarProps) {
  // New state to track if the scrollbar is being dragged
  // State for scrollbar visibility and position
  const [showScrollbar, setShowScrollbar] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [thumbHeight, setThumbHeight] = useState(0);
  const [thumbTop, setThumbTop] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [containerOffset, setContainerOffset] = useState({ top: 0, right: 0 });
  const [containerHeight, setContainerHeight] = useState(0);

  // Refs
  const initialScrollTop = useRef(0);
  const isDragging = useRef(false);
  const hideTimer = useRef<NodeJS.Timeout | null>(null);

  // New state to track if the scrollbar is being dragged
  const [isActive, setIsActive] = useState(false);
  const [isHover, setIsHover] = useState(false);

  const showScrollbarWithTimer = () => {
    setIsVisible(true);
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
    }
    hideTimer.current = setTimeout(() => {
      setIsVisible(false);
    }, 2000);
  };

  useEffect(() => {
    const scrollElement = scrollElementRef.current;
    if (!scrollElement) return;

    const updateScrollbar = () => {
      const containerHeight = scrollElement.clientHeight;
      setContainerHeight(containerHeight);
      const contentHeight = scrollElement.scrollHeight;
      const scrollTop = scrollElement.scrollTop;

      // 스크롤바 위치 offset 계산
      const rect = scrollElement.getBoundingClientRect();

      if (useAbsolute && containerRef?.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const scrollElementRect = scrollElement.getBoundingClientRect();
        setContainerOffset({
          top: scrollElementRect.top - containerRect.top,
          right: containerRect.right - scrollElementRect.right,
        });
      } else {
        setScrollOffset(rect.top);
      }

      if (contentHeight <= containerHeight) {
        setShowScrollbar(false);
        return;
      }

      setShowScrollbar(true);

      // 스크롤바 높이 계산 (최소 20px)
      const minThumbHeight = 20;
      const thumbHeight = Math.max(
        minThumbHeight,
        (containerHeight / contentHeight) * containerHeight,
      );

      // 스크롤바 위치 계산
      const maxScrollTop = contentHeight - containerHeight;
      const maxThumbTop = containerHeight - thumbHeight;
      const thumbTop = maxScrollTop > 0 ? (scrollTop / maxScrollTop) * maxThumbTop : 0;

      setThumbHeight(thumbHeight);
      setThumbTop(thumbTop);
    };

    const showScrollbarWithTimer = () => {
      setIsVisible(true);
      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
      }
      hideTimer.current = setTimeout(() => {
        setIsVisible(false);
      }, 2000);
    };

    const handleScroll = () => {
      // Always update scrollbar position, even during drag, so the thumb follows the content
      updateScrollbar();
      showScrollbarWithTimer();
    };

    scrollElement.addEventListener('scroll', handleScroll);
    const resizeObserver = new ResizeObserver(updateScrollbar);
    resizeObserver.observe(scrollElement);

    const initScrollbar = () => {
      updateScrollbar();

      const hasScrollableContent = scrollElement.scrollHeight > scrollElement.clientHeight;
      if (hasScrollableContent && scrollElement.scrollTop > 0) {
        showScrollbarWithTimer();
      }
    };

    const timeoutId = setTimeout(initScrollbar, 10);

    return () => {
      clearTimeout(timeoutId);
      scrollElement.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
      }
    };
  }, [containerRef, scrollElementRef, useAbsolute]);

  const handleThumbMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!scrollElementRef.current) return;

    const scrollElement = scrollElementRef.current;
    const startY = e.clientY;
    const containerHeight = scrollElement.clientHeight;

    isDragging.current = true;
    setIsActive(true); // Set Active State
    initialScrollTop.current = scrollElement.scrollTop;

    setIsVisible(true);
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!scrollElementRef.current) return;

      const deltaY = e.clientY - startY;
      const scrollableHeight = scrollElement.scrollHeight - scrollElement.clientHeight;
      const scrollbarMovableDistance = containerHeight - thumbHeight;
      const scrollRatio = scrollableHeight / scrollbarMovableDistance;
      const newScrollTop = initialScrollTop.current + deltaY * scrollRatio;

      scrollElement.scrollTop = Math.max(0, Math.min(newScrollTop, scrollableHeight));
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      setIsActive(false); // Unset Active State
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      showScrollbarWithTimer();
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTrackMouseDown = (e: React.MouseEvent) => {
    if (!scrollElementRef.current) return;

    const scrollElement = scrollElementRef.current;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const containerHeight = scrollElement.clientHeight;
    const scrollableHeight = scrollElement.scrollHeight - scrollElement.clientHeight;
    const scrollbarMovableDistance = containerHeight - thumbHeight;
    const targetThumbTop = clickY - thumbHeight / 2;
    const clampedThumbTop = Math.max(0, Math.min(targetThumbTop, scrollbarMovableDistance));
    const scrollProgress = clampedThumbTop / scrollbarMovableDistance;

    scrollElement.scrollTop = scrollProgress * scrollableHeight;
  };

  if (!showScrollbar) return null;

  // Dynamic Styles
  const currentThumbWidth = isActive || isHover ? '0.8rem' : '0.4rem';
  const currentThumbColor = isActive ? '#0066ff' : isHover ? '#999999' : '#cccccc';
  const currentOpacity = isVisible || isActive || isHover ? 1 : 0;

  return (
    <div
      style={{
        position: useAbsolute ? 'absolute' : 'fixed',
        right: (useAbsolute ? containerOffset.right : 0) + (offset?.right ?? 0),
        top: (useAbsolute ? containerOffset.top : scrollOffset) + (offset?.top ?? 0),
        width: 12, // Increased touch target width
        height: containerHeight,
        backgroundColor: 'transparent',
        zIndex: zIndex.scrollbar,
        display: 'flex',
        justifyContent: 'flex-end',
        paddingRight: '0.2rem',
      }}
      onMouseDown={handleTrackMouseDown}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div
        onMouseDown={handleThumbMouseDown}
        style={{
          position: 'absolute',
          width: currentThumbWidth,
          height: thumbHeight,
          backgroundColor: currentThumbColor,
          borderRadius: 4,
          top: thumbTop,
          cursor: 'pointer',
          opacity: currentOpacity,
          transition: 'width 0.2s ease, background-color 0.2s ease, opacity 0.3s ease',
          right: '0.2rem',
        }}
      />
    </div>
  );
}
