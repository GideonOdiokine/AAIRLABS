/**
 * Task List Screen — the app's home and initial route.
 *
 * Thin by design: it wires the `useTasks` hook to presentational components and
 * owns only screen-level orchestration (loading state, delete confirmation, and
 * a minimal inline add affordance so the flow is testable before the dedicated
 * Add Task screen arrives in Phase 2).
 */
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TaskList } from '@/components/tasks/task-list';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useTasks } from '@/hooks/use-tasks';

export default function TaskListScreen() {
  const { tasks, isLoading, addTask, toggleTask, deleteTask } = useTasks();
  const [draft, setDraft] = useState('');

  const background = useThemeColor({}, 'background');
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'textMuted');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const primary = useThemeColor({}, 'tint');

  const trimmedDraft = draft.trim();
  const canAdd = trimmedDraft.length > 0;

  const handleAdd = () => {
    if (!canAdd) return;
    addTask(draft);
    setDraft('');
  };

  // Delete is destructive — confirm first. Alert isn't reliable on web, so fall
  // back to window.confirm there.
  const requestDelete = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    const title = task ? `"${task.title}"` : 'this task';

    if (Platform.OS === 'web') {
      if (window.confirm(`Delete ${title}?`)) deleteTask(id);
      return;
    }
    Alert.alert('Delete task', `Delete ${title}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteTask(id) },
    ]);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: background }]} edges={['top']}>
      <View style={styles.header}>
        <ThemedText type="title">Tasks</ThemedText>
      </View>

      {/* Minimal inline add — placeholder for the Phase 2 Add Task screen. */}
      <View style={[styles.addBar, { backgroundColor: card, borderColor: border }]}>
        <TextInput
          style={[styles.input, { color: text }]}
          value={draft}
          onChangeText={setDraft}
          placeholder="Add a task…"
          placeholderTextColor={muted}
          returnKeyType="done"
          onSubmitEditing={handleAdd}
          accessibilityLabel="New task title"
        />
        <Pressable
          onPress={handleAdd}
          disabled={!canAdd}
          style={[styles.addButton, { backgroundColor: primary, opacity: canAdd ? 1 : 0.4 }]}
          accessibilityRole="button"
          accessibilityLabel="Add task"
          accessibilityState={{ disabled: !canAdd }}>
          <ThemedText style={styles.addButtonText}>Add</ThemedText>
        </Pressable>
      </View>

      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={primary} />
        </View>
      ) : (
        <TaskList tasks={tasks} onToggle={toggleTask} onDelete={requestDelete} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  addBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    paddingLeft: Spacing.md,
    paddingRight: Spacing.xs,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: Spacing.sm,
  },
  addButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
    lineHeight: 20,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
