/**
 * Task List Screen — the app's home and initial route.
 *
 * Thin by design: it wires the shared `useTasks` hook to presentational
 * components and owns only screen-level orchestration (loading state, delete
 * confirmation, and the primary "Add Task" entry point that navigates to the
 * dedicated Add Task screen).
 */
import { router } from 'expo-router';
import { ActivityIndicator, Alert, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TaskList } from '@/components/tasks/task-list';
import { ThemedText } from '@/components/themed-text';
import { PrimaryButton } from '@/components/ui/primary-button';
import { Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useTasks } from '@/hooks/use-tasks';

export default function TaskListScreen() {
  const { tasks, isLoading, toggleTask, deleteTask } = useTasks();

  const background = useThemeColor({}, 'background');
  const primary = useThemeColor({}, 'tint');

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

      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={primary} />
        </View>
      ) : (
        <TaskList tasks={tasks} onToggle={toggleTask} onDelete={requestDelete} />
      )}

      {/* Primary entry point to the dedicated Add Task screen (Phase 2). */}
      <View style={styles.footer}>
        <PrimaryButton
          label="Add Task"
          onPress={() => router.push('/add-task')}
          accessibilityLabel="Add a new task"
        />
      </View>
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
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.lg,
  },
});
