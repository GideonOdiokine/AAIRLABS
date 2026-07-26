/**
 * TaskList — FlatList wrapper that renders task rows, or the empty state when
 * there are none. Presentational: it forwards toggle/delete intent upward.
 */
import { FlatList, StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/tasks/empty-state';
import { TaskRow } from '@/components/tasks/task-row';
import { Spacing } from '@/constants/theme';
import type { Task } from '@/lib/types/task';

type TaskListProps = {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export function TaskList({ tasks, onToggle, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return <EmptyState />;
  }

  return (
    <FlatList
      data={tasks}
      keyExtractor={(task) => task.id}
      renderItem={({ item }) => (
        <TaskRow task={item} onToggle={onToggle} onDelete={onDelete} />
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    />
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.lg,
  },
  separator: {
    height: Spacing.sm,
  },
});
