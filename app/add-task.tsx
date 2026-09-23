import { router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DueDatePicker } from '@/components/ui/due-date-picker';
import { PrimaryButton } from '@/components/ui/primary-button';
import { TextField } from '@/components/ui/text-field';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useTasks } from '@/hooks/use-tasks';

export default function AddTaskScreen() {
  const { addTask } = useTasks();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<number | null>(null);
  // Only surface validation errors once the user has tried to save.
  const [error, setError] = useState<string | null>(null);

  const background = useThemeColor({}, 'background');
  const primary = useThemeColor({}, 'tint');

  const handleSave = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Please enter a task title.');
      return;
    }
    addTask(trimmedTitle, description, dueDate ?? undefined);
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: background }]} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable
          onPress={handleCancel}
          hitSlop={Spacing.sm}
          accessibilityRole="button"
          accessibilityLabel="Cancel and return to the task list">
          <ThemedText style={{ color: primary, fontSize: 16 }}>Cancel</ThemedText>
        </Pressable>
        <ThemedText type="defaultSemiBold">New Task</ThemedText>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.form}
          keyboardShouldPersistTaps="handled">
          <TextField
            label="Title"
            value={title}
            onChangeText={(value) => {
              setTitle(value);
              if (error) setError(null);
            }}
            error={error ?? undefined}
            placeholder="What needs doing?"
            autoFocus
            returnKeyType="next"
            accessibilityLabel="Task title, required"
          />

          <TextField
            label="Description (optional)"
            value={description}
            onChangeText={setDescription}
            placeholder="Add any details…"
            multiline
            accessibilityLabel="Task description, optional"
          />

          <DueDatePicker value={dueDate} onChange={setDueDate} />
        </ScrollView>

        <View style={styles.footer}>
          <PrimaryButton label="Save Task" onPress={handleSave} accessibilityLabel="Save task" />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  headerSpacer: {
    width: 56, // matches the Cancel label width so the title stays centred
  },
  form: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  footer: {
    padding: Spacing.lg,
  },
});
