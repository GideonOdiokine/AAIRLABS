/**
 * EmptyState — shown when there are no tasks. An intentional, calm placeholder
 * rather than a blank screen.
 */
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

export function EmptyState() {
  const muted = useThemeColor({}, 'textMuted');

  return (
    <View style={styles.container} accessibilityRole="text">
      <IconSymbol name="checkmark" size={40} color={muted} />
      <ThemedText style={styles.title}>No tasks yet</ThemedText>
      <ThemedText style={[styles.subtitle, { color: muted }]}>
        Add one to get started.
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxl,
    gap: Spacing.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: Spacing.sm,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
  },
});
