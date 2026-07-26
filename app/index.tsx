/**
 * Task List Screen — the app's home and initial route.
 *
 * Thin by design: it wires the shared `useTasks` hook to presentational
 * components and owns only screen-level orchestration (loading state, delete
 * confirmation, the search/filter UI state, and the primary "Add Task" entry
 * point that navigates to the dedicated Add Task screen).
 */
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/tasks/empty-state';
import { TaskFilterBar } from '@/components/tasks/task-filter-bar';
import { TaskList } from '@/components/tasks/task-list';
import { ThemedText } from '@/components/themed-text';
import { PrimaryButton } from '@/components/ui/primary-button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { VoiceFab } from '@/components/voice/voice-fab';
import { Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useTasks } from '@/hooks/use-tasks';
import { useVisibleTasks, type TaskFilter } from '@/hooks/use-visible-tasks';

export default function TaskListScreen() {
  const { tasks, isLoading, addTask, toggleTask, deleteTask } = useTasks();

  // Search/filter UI state (Phase 4 bonus) — view-only, not persisted.
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<TaskFilter>('all');
  const visibleTasks = useVisibleTasks(tasks, query, filter);

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

  const hasTasks = tasks.length > 0;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: background }]} edges={['top']}>
      <View style={styles.header}>
        <ThemedText type="title">Tasks</ThemedText>
        {/* Light / dark / system theme toggle (Phase 4 bonus). */}
        <ThemeToggle />
      </View>

      {/* Search + status filter — only once there are tasks to narrow. */}
      {hasTasks ? (
        <View style={styles.filterBar}>
          <TaskFilterBar
            query={query}
            onQueryChange={setQuery}
            filter={filter}
            onFilterChange={setFilter}
          />
        </View>
      ) : null}

      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={primary} />
        </View>
      ) : (
        <TaskList
          tasks={visibleTasks}
          onToggle={toggleTask}
          onDelete={requestDelete}
          // Distinguish "no tasks at all" from "filter hid everything".
          emptyState={
            hasTasks ? (
              <EmptyState
                icon="magnifyingglass"
                title="No matching tasks"
                subtitle="Try a different search or filter."
              />
            ) : undefined
          }
        />
      )}

      {/* Voice FAB — the one bold affordance, floating above the list (Phase 3).
          Each spoken sentence is split into one or more tasks and appended. */}
      <VoiceFab onTasks={(titles) => titles.forEach((title) => addTask(title))} />

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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  filterBar: {
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
