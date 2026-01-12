import { createTheme } from '@jigoooo/shared-ui';

import type { CustomTheme } from './theme-type.ts';

export const theme = createTheme<CustomTheme>({
  colors: {
    primary: {
      50: '#E6F4EF',
      100: '#B3E1D0',
      200: '#80CDB0',
      300: '#4DB890',
      400: '#007651',
      500: '#006644',
      600: '#005537',
      700: '#004429',
      800: '#00331C',
      900: '#001A0E',
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#f59e0b',
      500: '#d97706',
      600: '#b45309',
      700: '#92400e',
      800: '#78350f',
      900: '#451a03',
    },
    point1: '#075D46',
    point2: '#F2FFF7',
    point3: '#F2F8F4',

    textWhite: '#ffffff',

    textDark: '#1a1a1a',
    textMediumDark: '#333333',
    textLightDark: '#666666',
    textExtraLightDark: '#999999',
    textLight: '#aaaaaa',

    placeholderColor: '#c2c2c2',

    buttonDark: '#4d4d4d',

    border: '#c9c9c9',

    red: '#F0232C',
    blue: '#006ECD',
  },
});
