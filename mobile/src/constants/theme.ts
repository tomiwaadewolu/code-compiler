/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#24152F',
    background: '#FAF5FF',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#F5EBFF',
    textSecondary: '#674F7A',
    accent: '#9B4DCA',
    accentLight: '#BE71E3',
    success: '#1A7F16',
    successLight: '#2DA44E',
    warning: '#D29922',
    error: '#D1242F',
    border: '#EADCF6',
    borderLight: '#F7EDFF',
    shadowColor: 'rgba(155, 77, 202, 0.12)',
  },
  dark: {
    text: '#F8F1FF',
    background: '#130D1A',
    backgroundElement: '#20142E',
    backgroundSelected: '#2B1A3D',
    textSecondary: '#B79FD6',
    accent: '#BE71E3',
    accentLight: '#D8A8F6',
    success: '#3FB950',
    successLight: '#56D364',
    warning: '#D29922',
    error: '#F85149',
    border: '#3B2A4D',
    borderLight: '#2B1A3D',
    shadowColor: 'rgba(190, 113, 227, 0.16)',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  xs: 2,
  half: 2,
  sm: 4,
  one: 4,
  md: 8,
  two: 8,
  lg: 16,
  three: 16,
  xl: 24,
  four: 24,
  xxl: 32,
  five: 32,
  xxxl: 48,
  huge: 64,
  six: 64,
} as const;

export const BorderRadius = {
  none: 0,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  round: 9999,
} as const;

export const FontSize = {
  xs: 11,
  sm: 12,
  base: 14,
  md: 16,
  lg: 18,
  xl: 20,
  display: 24,
  hero: 32,
} as const;

export const FontWeight = {
  light: '300' as const,
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
} as const;

export const Shadow = {
  none: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
