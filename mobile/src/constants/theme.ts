/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#0F1117',
    background: '#FFFFFF',
    backgroundElement: '#F6F8FB',
    backgroundSelected: '#EAEEF2',
    textSecondary: '#57606A',
    accent: '#0969DA',
    accentLight: '#54AEFF',
    success: '#1a7f16',
    successLight: '#2da44e',
    warning: '#d29922',
    error: '#d1242f',
    border: '#D0D7DE',
    borderLight: '#EAEEF2',
    shadowColor: 'rgba(9, 105, 218, 0.1)',
  },
  dark: {
    text: '#E6EDF3',
    background: '#0D1117',
    backgroundElement: '#161B22',
    backgroundSelected: '#21262D',
    textSecondary: '#8B949E',
    accent: '#58A6FF',
    accentLight: '#79C0FF',
    success: '#3fb950',
    successLight: '#56d364',
    warning: '#d29922',
    error: '#f85149',
    border: '#30363D',
    borderLight: '#21262D',
    shadowColor: 'rgba(88, 166, 255, 0.1)',
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
  half: 2,     // backward compatibility
  sm: 4,
  one: 4,      // backward compatibility
  md: 8,
  two: 8,      // backward compatibility
  lg: 16,
  three: 16,   // backward compatibility
  xl: 24,
  four: 24,    // backward compatibility
  xxl: 32,
  five: 32,    // backward compatibility
  xxxl: 48,
  huge: 64,
  six: 64,     // backward compatibility
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
