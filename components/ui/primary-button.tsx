/**
 * PrimaryButton — the app's single, brand-blue primary action.
 *
 * Used for the list's "Add Task" entry point and the Add Task screen's save.
 * Presentational only: colors come from the theme, behavior comes from props.
 */
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

export function PrimaryButton({
  label,
  onPress,
  disabled = false,
  style,
  accessibilityLabel,
}: PrimaryButtonProps) {
  const primary = useThemeColor({}, 'tint');
  const pressedColor = useThemeColor({}, 'primaryPressed');

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: pressed ? pressedColor : primary,
          opacity: disabled ? 0.4 : 1,
        },
        style,
      ]}>
      <ThemedText style={styles.label}>{label}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48, // comfortable, ≥44pt hit target
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
  },
  label: {
    color: '#FFFFFF', // fixed on brand-blue surface in both themes
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 20,
  },
});
