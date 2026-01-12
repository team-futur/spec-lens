import { dialog } from '@jigoooo/shared-ui';
import { endOfYear, format, subYears } from 'date-fns';

import { ALERT_TITLE_MOBILE_WARNING } from '@/shared/constants';

export function sleep(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export function isNullOrUndefined(value: any) {
  return value === null || value === undefined;
}

export function convertToRGBA(hexColor: string, alpha: number) {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function getYears(prevYearCount: number = 100) {
  const currentYear = new Date().getFullYear();
  const years: string[] = [];

  for (let i = currentYear; i >= currentYear - prevYearCount; i--) {
    const formattedYear = format(endOfYear(subYears(new Date(), currentYear - i)), 'yyyy');
    years.push(formattedYear);
  }

  return years;
}

export function logOnDev(...message: any[]) {
  if (import.meta.env.DEV) {
    console.log(...message);
  }
}

export function transformArrayToDictByKey<T, K extends keyof T>(
  array: T[],
  key: K,
): { [key: string]: T } {
  return array.reduce((acc: { [key: string]: T }, cur: T) => {
    const keyValue = String(cur[key]);

    acc[keyValue] = cur;

    return acc;
  }, {});
}

export function generateRandomNumber(a: number) {
  return Math.floor(Math.random() * a);
}

export function detectDeviceTypeAndOS() {
  const ua = navigator.userAgent;

  // OS 체크
  const isAndroid = /Android/i.test(ua);
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const isMac = /Macintosh|Mac OS X/i.test(ua);
  const isWindows = /Windows NT/i.test(ua);

  // Electron 체크
  const isElectron = !!(
    (typeof window !== 'undefined' && (/electron/i.test(ua) || false))
    // window.process?.type === 'renderer' ||
    // window.electron
  );

  const isTablet = /iPad|Tablet|PlayBook/i.test(ua) || (isAndroid && !/Mobile/i.test(ua));
  const isMobile =
    /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/i.test(
      ua,
    ) && !isTablet;

  // Desktop 체크 시 Electron도 고려
  const isDesktop = !isTablet && !isMobile;
  const isBrowser = isDesktop && !isElectron;

  return {
    isDesktop,
    isAndroid,
    isIOS,
    isMac,
    isWindows,
    isMobile,
    isTablet,
    isElectron,
    isBrowser,
    platform: isElectron ? 'electron' : isMobile ? 'mobile' : isTablet ? 'tablet' : 'web',
  };
}

export function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

export function scrollToTopNoneSmooth() {
  window.scrollTo({
    top: 0,
  });
}

export function openPhoneApp(phoneNumber: string) {
  window.location.href = `tel:${phoneNumber}`;
}

export function openSmsApp(phoneNumber: string, message: string = '') {
  window.location.href = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;
}

export function openKakaoMap({
  latitude,
  longitude,
  webUrl,
}: {
  latitude: number;
  longitude: number;
  webUrl: string;
}) {
  const { isMobile } = detectDeviceTypeAndOS();

  if (isMobile) {
    // window.location.href = `kakaomap://look?p=${latitude},${longitude}`;
    window.location.href = `kakaomap://route?ep=${latitude},${longitude}&by=CAR`;
  } else {
    window.open(webUrl);
  }
}

export function openTMap({
  latitude,
  longitude,
  placeName,
}: {
  latitude: number;
  longitude: number;
  placeName: string;
}) {
  const { isMobile } = detectDeviceTypeAndOS();

  if (isMobile) {
    window.location.href = `tmap://search?name=${encodeURIComponent(placeName)}&lon=${longitude}&lat=${latitude}`;
  } else {
    dialog.warning({
      title: ALERT_TITLE_MOBILE_WARNING,
      content: '모바일에서만 지원됩니다.',
    });
  }
}

export function openNaverMap({
  latitude,
  longitude,
  placeName,
  webUrl,
}: {
  latitude: number;
  longitude: number;
  placeName: string;
  webUrl: string;
}) {
  const { isMobile } = detectDeviceTypeAndOS();

  if (isMobile) {
    // window.location.href = `nmap://place?lat=${latitude}&lng=${longitude}&name=${encodeURIComponent(placeName)}&appname=com.example.myapp`;
    window.location.href = `nmap://navigation?dlat=${latitude}&dlng=${longitude}&dname=${encodeURIComponent(placeName)}&appname=com.example.myapp`;
  } else {
    window.open(webUrl);
  }
}

export function copyToClipboard(text: string, successCallback?: () => void) {
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(text)
      .then(successCallback)
      .catch((err) => console.log('err: ', err));
  } else {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);

    if (successCallback) {
      successCallback();
    }
  }
}

export function isLightColor(color: string): boolean {
  // HEX 색상을 RGB로 변환
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  // 상대 밝기 계산
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  // 밝기 기준(0.5)으로 판단
  return luminance > 0.5;
}

export function getFormValues<T extends Record<string, string | null>>(
  formData: FormData,
  fields: Record<keyof T, string>,
): T {
  return Object.keys(fields).reduce((acc, key) => {
    acc[key as keyof T] = formData.get(fields[key as keyof T]) as T[keyof T];
    return acc;
  }, {} as Partial<T>) as T;
}

export function deepEqual(a: any, b: any, seen = new Map<any, any>()): boolean {
  // 동일한 객체이거나 원시값인 경우
  if (a === b) return true;

  // 함수 비교: 두 함수라면 toString()으로 비교 (참조값 비교보다 더 깊은 비교)
  if (typeof a === 'function' && typeof b === 'function') {
    return a.toString() === b.toString();
  }

  // 둘 중 하나라도 null 이거나 객체가 아닌 경우
  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') {
    return false;
  }

  // 순환 참조 처리를 위해, a를 이미 봤다면 b와 비교해서 같으면 true
  if (seen.has(a)) {
    return seen.get(a) === b;
  }
  // 현재 a와 b를 비교 대상으로 기록
  seen.set(a, b);

  // 배열 비교
  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i], seen)) return false;
    }
    return true;
  }

  // 하나는 배열인데 다른 하나는 배열이 아닌 경우
  if (Array.isArray(b)) return false;

  // 일반 객체 비교: 키 개수와 각 키의 값 비교
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
    if (!deepEqual(a[key], b[key], seen)) return false;
  }
  return true;
}

export function openPopup({
  url,
  width = 500,
  height = 600,
}: {
  url: string;
  width?: number;
  height?: number;
}) {
  const left = window.screenX + (window.innerWidth - width) / 2;
  const top = window.screenY + (window.innerHeight - height) / 2;

  const popup = window.open(
    url,
    'PopupWindow',
    `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=no,resizable=no`,
  );

  if (popup) {
    popup.focus();
  }
}

export function throttle<T extends (...args: any[]) => void>(
  func: T,
  wait: number,
  options: {
    leading?: boolean;
    trailing?: boolean;
  } = { leading: true, trailing: false },
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let previous = 0;

  const { leading, trailing } = options;

  const later = (context: unknown, args: Parameters<T>) => {
    previous = leading === false ? 0 : Date.now();
    timeout = null;
    func.apply(context, args);
  };

  return function (this: unknown, ...args: Parameters<T>) {
    const now = Date.now();
    if (!previous && leading === false) {
      previous = now;
    }

    const remaining = wait - (now - previous);

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(this, args);
    } else if (!timeout && trailing !== false) {
      timeout = setTimeout(() => later(this, args), remaining);
    }
  };
}

export function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift();
    return cookieValue || null;
  }

  return null;
}

export async function webShare(shareData: ShareData, failedSharedDataCopiedData: string) {
  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch {
      // console.error('공유 취소:', error);
    }
  } else {
    copyToClipboard(failedSharedDataCopiedData);
  }
}

export function handleTextSelectionClear() {
  return () => {
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
    }
  };
}

export function devConsole(...args: any[]) {
  if (import.meta.env.DEV) {
    console.log(...args);
  }
}
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export async function blurElement(delay = 0) {
  const activeElement = document.activeElement as HTMLElement;
  if (activeElement && 'blur' in activeElement) {
    activeElement.blur();
    await sleep(delay);
  }
}
