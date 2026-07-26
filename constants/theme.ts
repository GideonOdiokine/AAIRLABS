/**
 * Below are the colors that are used in the app, defined for both light and dark mode.
 * This project styles with React Native StyleSheet + these theme tokens (see the
 * coding standards); components read colors from here rather than hardcoding hex.
 */

import { Platform } from 'react-native';

// Brand blue is the single accent, per the project color system.
const tintColorLight = '#208AEF';
const tintColorDark = '#4FA6F5';

export const Colors = {
  light: {
    text: '#0F1720',
    textBody: '#3C4655',
    textMuted: '#8A94A3', // completed-task text, placeholders
    background: '#FFFFFF',
    card: '#F7F9FC', // task row surface
    border: '#E6EAF0',
    tint: tintColorLight, // brand blue — primary actions, FAB
    primaryPressed: '#1B6FBF',
    primarySoft: '#E6F4FE', // tinted surfaces / active states
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    success: '#2E7D4F', // completed check
    danger: '#C43D2D', // delete / destructive
    warning: '#B87400', // due-soon (readable amber on light surfaces)
  },
  dark: {
    text: '#ECEDEE',
    textBody: '#B7C0CC',
    textMuted: '#6C7686',
    background: '#151718',
    card: '#1E2124',
    border: '#2A2E33',
    tint: tintColorDark,
    primaryPressed: '#3B8BD9',
    primarySoft: '#132A3F',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    success: '#5DBB84',
    danger: '#E5695A',
    warning: '#F4B740', // due-soon (bright amber on dark surfaces)
  },
};

/** Spacing scale (pt) — avoids one-off magic numbers in styles. */
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

/** Corner radius scale (pt). */
export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
} as const;

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
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
