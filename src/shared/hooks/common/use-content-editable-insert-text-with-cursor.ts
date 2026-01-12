import { useEffect, useCallback, useState, type RefObject } from 'react';

export type UseContentEditableOptions = {
  onTextChange: (text: string, htmlText: string) => void;
  enableCursorTracking?: boolean;
  trackingEvents?: string[];
  insertDelay?: number;
};

type ContentEditableElement = HTMLDivElement | HTMLParagraphElement | HTMLSpanElement;

export function useContentEditableInsertTextWithCursor<T extends ContentEditableElement>(
  contentEditableRef: RefObject<T | null>,
  options: UseContentEditableOptions,
) {
  const {
    onTextChange,
    trackingEvents = [
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'Home',
      'End',
      'PageUp',
      'PageDown',
    ],
    insertDelay = 100,
  } = options;

  const [lastCursorPosition, setLastCursorPosition] = useState(0);

  // 커서 위치 업데이트 함수
  const updateCursorPosition = useCallback(() => {
    const contentEditable = contentEditableRef.current;
    if (!contentEditable) return;

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      let cursorPos = 0;

      const walker = document.createTreeWalker(contentEditable, NodeFilter.SHOW_TEXT, null);

      let node;
      while ((node = walker.nextNode())) {
        if (node === range.startContainer) {
          cursorPos += range.startOffset;
          break;
        } else {
          cursorPos += node.textContent?.length || 0;
        }
      }

      setLastCursorPosition(cursorPos);
    }
  }, [contentEditableRef]);

  // 이벤트 리스너 등록
  useEffect(() => {
    const contentEditable = contentEditableRef.current;
    if (!contentEditable) return;

    // 커서 위치 변경을 감지하는 이벤트들
    const handleSelectionChange = () => {
      if (document.activeElement === contentEditable) {
        updateCursorPosition();
      }
    };

    const handleKeyUp = (e: Event) => {
      if (e instanceof KeyboardEvent && trackingEvents.includes(e.key)) {
        updateCursorPosition();
      }
    };

    const handleClick = () => {
      // 클릭 후 약간의 지연을 두고 커서 위치 업데이트
      setTimeout(updateCursorPosition, 0);
    };

    const handleFocus = () => {
      // 포커스 받았을 때도 커서 위치 업데이트
      setTimeout(updateCursorPosition, 0);
    };

    // 전역 selectionchange 이벤트 (가장 확실한 방법)
    document.addEventListener('selectionchange', handleSelectionChange);

    // 직접 이벤트 등록
    contentEditable.addEventListener('keyup', handleKeyUp);
    contentEditable.addEventListener('click', handleClick);
    contentEditable.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      contentEditable.removeEventListener('keyup', handleKeyUp);
      contentEditable.removeEventListener('click', handleClick);
      contentEditable.removeEventListener('focus', handleFocus);
    };
  }, [contentEditableRef, trackingEvents, updateCursorPosition]);

  const insertText = (text: string) => {
    const contentEditable = contentEditableRef.current;
    if (!contentEditable) return;

    const selection = window.getSelection();
    const hasActiveSelection =
      selection &&
      selection.rangeCount > 0 &&
      !selection.isCollapsed &&
      document.activeElement === contentEditable;

    if (hasActiveSelection) {
      // 기존 로직 그대로 (이미 DOM 기반이라 문제없음)
      const range = selection.getRangeAt(0);
      range.deleteContents();

      const textNode = document.createTextNode(text);
      range.insertNode(textNode);

      range.setStartAfter(textNode);
      range.collapse(true);

      selection.removeAllRanges();
      selection.addRange(range);

      const newText = contentEditable.textContent || '';
      const newHtmlText = contentEditable.innerHTML || '';
      setLastCursorPosition(textNode.textContent?.length || 0);
      onTextChange(newText, newHtmlText);
    } else {
      // 🔥 핵심 수정: textContent 할당 대신 DOM 기반 삽입

      // 현재 커서 위치 계산 (기존 방식)
      const currentText = contentEditable.textContent || '';
      const insertPos = Math.min(lastCursorPosition, currentText.length);

      // 🔥 DOM 기반으로 정확한 위치 찾기
      const { node, offset } = findNodeAndOffsetAtPosition(contentEditable, insertPos);

      if (node) {
        const range = document.createRange();
        const textNode = document.createTextNode(text);

        // 텍스트 노드에 삽입
        if (node.nodeType === Node.TEXT_NODE) {
          const currentNodeText = node.textContent || '';
          const beforeText = currentNodeText.slice(0, offset);
          const afterText = currentNodeText.slice(offset);

          node.textContent = beforeText + text + afterText;

          // 커서 위치 설정
          range.setStart(node, beforeText.length + text.length);
          range.collapse(true);
        } else {
          // 요소 노드에 삽입
          range.setStart(node, offset);
          range.insertNode(textNode);

          range.setStartAfter(textNode);
          range.collapse(true);
        }

        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);

        // 커서 위치 업데이트
        const newCursorPos = insertPos + text.length;
        setLastCursorPosition(newCursorPos);
      } else {
        // 🔥 최후의 fallback: 끝에 추가
        const textNode = document.createTextNode(text);
        contentEditable.appendChild(textNode);

        const range = document.createRange();
        range.setStartAfter(textNode);
        range.collapse(true);

        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);

        setLastCursorPosition(currentText.length + text.length);
      }

      const newText = contentEditable.textContent || '';
      const newHtmlText = contentEditable.innerHTML || '';
      onTextChange(newText, newHtmlText);
    }

    // 포커스 복원
    setTimeout(() => {
      contentEditable.focus();
    }, insertDelay);
  };

  function findNodeAndOffsetAtPosition(element: HTMLElement, position: number) {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);

    let currentPos = 0;
    let node;

    while ((node = walker.nextNode())) {
      const nodeLength = node.textContent?.length || 0;

      if (currentPos + nodeLength >= position) {
        return {
          node: node,
          offset: position - currentPos,
        };
      }

      currentPos += nodeLength;
    }

    // 위치를 찾지 못한 경우 마지막 노드 반환
    return {
      node: element.lastChild || element,
      offset: 0,
    };
  }

  return {
    insertText,
    updateCursorPosition,
  };
}
