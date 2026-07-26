/**
 * TextField — a labeled text input with an optional inline error message.
 *
 * Presentational: colors come from the theme, all input behavior is forwarded
 * to the underlying RN `TextInput`. Used by the Add Task screen for the title
 * and description fields.
 */
import { forwardRef } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

type TextFieldProps = TextInputProps & {
  label: string;
  /** Inline error message shown under the field; also flags the border. */
  error?: string;
};

export const TextField = forwardRef<TextInput, TextFieldProps>(function TextField(
  { label, error, style, multiline, ...inputProps },
  ref
) {
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'textMuted');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const danger = useThemeColor({}, 'danger');

  return (
    <View style={styles.container}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <TextInput
        ref={ref}
        multiline={multiline}
        placeholderTextColor={muted}
        style={[
          styles.input,
          multiline && styles.inputMultiline,
          { color: text, backgroundColor: card, borderColor: error ? danger : border },
          style,
        ]}
        {...inputProps}
      />
      {error ? (
        <ThemedText style={[styles.error, { color: danger }]} accessibilityRole="alert">
          {error}
        </ThemedText>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xs,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    minHeight: 48,
    fontSize: 16,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
  inputMultiline: {
    minHeight: 96,
    paddingTop: Spacing.sm,
    textAlignVertical: 'top',
  },
  error: {
    fontSize: 13,
  },
});
