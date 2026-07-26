/**
 * DueDatePicker — a compact, cross-platform due-date control (Phase 4 bonus).
 *
 * Rather than a native-only calendar (which does not run in the web preview),
 * this offers quick-pick day chips — Today / Tomorrow / This weekend / Next week
 * — plus a Clear chip. It reports the chosen due date (local-midnight epoch ms)
 * or null upward; it owns no persistence. Selecting the active chip again clears
 * it, so the control is fully keyboard/tap reversible.
 */
import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Radius, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { dueDateOptions, formatDueDate } from '@/lib/dates';

type DueDatePickerProps = {
  /** Currently selected due date (epoch ms), or null when undated. */
  value: number | null;
  onChange: (value: number | null) => void;
};

export function DueDatePicker({ value, onChange }: DueDatePickerProps) {
  const primary = useThemeColor({}, 'tint');
  const primarySoft = useThemeColor({}, 'primarySoft');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'textMuted');

  // Options are relative to "now" — memoized so chips stay stable across renders.
  const options = useMemo(() => dueDateOptions(), []);

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <ThemedText style={styles.label}>Due date (optional)</ThemedText>
        {value != null ? (
          <ThemedText style={[styles.selected, { color: muted }]}>
            {formatDueDate(value)}
          </ThemedText>
        ) : null}
      </View>

      <View style={styles.chips}>
        {options.map((option) => {
          const active = value != null && value === option.value;
          return (
            <Pressable
              key={option.key}
              onPress={() => onChange(active ? null : option.value)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`Due ${option.label}`}
              style={[
                styles.chip,
                { backgroundColor: active ? primarySoft : card, borderColor: active ? primary : border },
              ]}>
              <ThemedText style={[styles.chipLabel, { color: active ? primary : text }]}>
                {option.label}
              </ThemedText>
            </Pressable>
          );
        })}

        {value != null ? (
          <Pressable
            onPress={() => onChange(null)}
            accessibilityRole="button"
            accessibilityLabel="Clear due date"
            style={[styles.chip, styles.clearChip, { borderColor: border }]}>
            <IconSymbol name="xmark" size={14} color={muted} />
            <ThemedText style={[styles.chipLabel, { color: muted }]}>Clear</ThemedText>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  selected: {
    fontSize: 13,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    minHeight: 40, // comfortable hit target
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearChip: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  chipLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
});
