import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

type IconName = 'checkmark' | 'magnifyingglass';

type EmptyStateProps = {
  title?: string;
  subtitle?: string;
  icon?: IconName;
};

export function EmptyState({
  title = 'No tasks yet',
  subtitle = 'Add one to get started.',
  icon = 'checkmark',
}: EmptyStateProps) {
  const muted = useThemeColor({}, 'textMuted');

  return (
    <View style={styles.container} accessibilityRole="text">
      <IconSymbol name={icon} size={40} color={muted} />
      <ThemedText style={styles.title}>{title}</ThemedText>
      <ThemedText style={[styles.subtitle, { color: muted }]}>{subtitle}</ThemedText>
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
