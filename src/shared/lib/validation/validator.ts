import { formatDate, isValid, parse } from 'date-fns';

export function isValidPhoneNumber(phoneNumber?: string | null) {
  if (phoneNumber === null || phoneNumber === undefined) {
    return false;
  }

  const regex = /^((\d{3}-\d{4}-\d{4})|(\d{3}-\d{3}-\d{4}))$/;
  return regex.test(phoneNumber);
}

export function isValidHomeNumber(phoneNumber: string | null) {
  if (phoneNumber === null) {
    return false;
  }

  const patternMatch = phoneNumber.match(/^(?:\d+-){2}\d+$/);
  if (!patternMatch) return false;

  const digitsOnly = phoneNumber.replace(/-/g, '');
  const digitCount = digitsOnly.length;

  return digitCount >= 9 && digitCount <= 11;
}

export function isAllDigits(inputString: string | null) {
  if (inputString === null) {
    return false;
  }

  const regex = /^\d+$/;
  return regex.test(inputString);
}

export function isValidEmail(email: string | null) {
  if (email === null) {
    return false;
  }

  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

export function isValidBusinessNumber(number: string | null) {
  if (number === null) {
    return false;
  }

  const regex = /^\d{3}-\d{2}-\d{5}$/;
  return regex.test(number);
}

export function isValidDateFormat(dateString: string, formats: string | string[]): boolean {
  const fmtList = Array.isArray(formats) ? formats : [formats];

  for (const fmt of fmtList) {
    const parsed = parse(dateString, fmt, new Date());

    if (isValid(parsed) && formatDate(parsed, fmt) === dateString) {
      return true;
    }
  }

  return false;
}
