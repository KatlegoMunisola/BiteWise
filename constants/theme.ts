import { Platform } from 'react-native';

export const colors = {
  primary: '#2a9d8f',
  primaryLight: '#a6e4d0',
  accent: '#fdeb93',
  background: '#ffffff',
  surface: '#f4f8f7',
  text: '#1d3557',
  textMuted: '#6b7c93',
  danger: '#e63946',
  warning: '#f4a261',
  border: '#dbe4e2',

  white: '#ffffff',
  onPrimary: '#ffffff',
  successText: '#1e7d6f',
  successTint: '#e3f5f1',
  dangerTint: '#fdecea',
  warningTint: '#fdf1e3',
  overlay: 'rgba(29,53,87,0.45)',
};

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 20,
  pill: 999,
};

export const contentWidth = {
  standard: 560,
  narrow: 420,
};

export const fontSize = {
  sm: 13,
  md: 16,
  lg: 20,
  xl: 26,
};

export const lineHeight = {
  sm: 18,
  md: 22,
  lg: 26,
  xl: 32,
};

export const fontWeight = {
  regular: '400' as const,
  medium: '600' as const,
  bold: '700' as const,
  heavy: '800' as const,
};

export const iconSize = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28,
  xxl: 32,
};

export const elevation = Platform.select({
  ios: {
    none: {},
    low: {
      shadowColor: '#1d3557',
      shadowOpacity: 0.06,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
    },
    med: {
      shadowColor: '#1d3557',
      shadowOpacity: 0.12,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
    },
    high: {
      shadowColor: '#1d3557',
      shadowOpacity: 0.18,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 8 },
    },
  },
  default: {
    none: { elevation: 0 },
    low: { elevation: 2 },
    med: { elevation: 6 },
    high: { elevation: 12 },
  },
})!;
