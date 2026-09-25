import { Pressable, StyleSheet } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Radius, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useThemePreference, type ThemePreference } from '@/hooks/use-theme-preference';

// Material fallbacks for these SF Symbols are mapped in icon-symbol.tsx.
const ICON: Record<ThemePreference, 'sun.max.fill' | 'moon.fill' | 'circle.lefthalf.filled'> = {
  light: 'sun.max.fill',
  dark: 'moon.fill',
  system: 'circle.lefthalf.filled',
};

const LABEL: Record<ThemePreference, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
};

export function ThemeToggle() {
  const { preference, cyclePreference } = useThemePreference();

  const primary = useThemeColor({}, 'tint');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');

  return (
    <Pressable
      onPress={cyclePreference}
      hitSlop={Spacing.sm}
      accessibilityRole="button"
      accessibilityLabel={`Theme: ${LABEL[preference]}. Tap to change.`}
      style={[styles.button, { backgroundColor: card, borderColor: border }]}>
      <IconSymbol name={ICON[preference]} size={20} color={primary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
