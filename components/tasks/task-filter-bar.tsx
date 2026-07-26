/**
 * TaskFilterBar — search box + All / Active / Done chips for the list screen
 * (Phase 4 bonus). Presentational: it reports the query and filter upward and
 * owns no list logic.
 */
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Radius, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { TaskFilter } from '@/hooks/use-visible-tasks';

type TaskFilterBarProps = {
  query: string;
  onQueryChange: (query: string) => void;
  filter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
};

const FILTERS: { key: TaskFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'done', label: 'Done' },
];

export function TaskFilterBar({
  query,
  onQueryChange,
  filter,
  onFilterChange,
}: TaskFilterBarProps) {
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'textMuted');
  const primary = useThemeColor({}, 'tint');
  const primarySoft = useThemeColor({}, 'primarySoft');

  return (
    <View style={styles.container}>
      <View style={[styles.search, { backgroundColor: card, borderColor: border }]}>
        <IconSymbol name="magnifyingglass" size={18} color={muted} />
        <TextInput
          value={query}
          onChangeText={onQueryChange}
          placeholder="Search tasks"
          placeholderTextColor={muted}
          style={[styles.searchInput, { color: text }]}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityLabel="Search tasks by title or description"
        />
        {query.length > 0 ? (
          <Pressable
            onPress={() => onQueryChange('')}
            hitSlop={Spacing.sm}
            accessibilityRole="button"
            accessibilityLabel="Clear search">
            <IconSymbol name="xmark" size={16} color={muted} />
          </Pressable>
        ) : null}
      </View>

      <View style={styles.filters}>
        {FILTERS.map(({ key, label }) => {
          const active = filter === key;
          return (
            <Pressable
              key={key}
              onPress={() => onFilterChange(key)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`Show ${label.toLowerCase()} tasks`}
              style={[
                styles.chip,
                { backgroundColor: active ? primarySoft : card, borderColor: active ? primary : border },
              ]}>
              <ThemedText style={[styles.chipLabel, { color: active ? primary : text }]}>
                {label}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    minHeight: 44,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: Spacing.sm,
  },
  filters: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    minHeight: 36,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
});
