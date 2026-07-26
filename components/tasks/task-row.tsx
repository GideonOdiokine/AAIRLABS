/**
 * TaskRow — renders a single task: completion toggle, title, optional
 * description, an optional due-date badge, and a delete control. It reports
 * intent (toggle / delete) to the parent and owns no list or storage logic.
 *
 * The row animates in and shifts smoothly when the list reorders (Phase 4
 * bonus); both are skipped when the OS reduced-motion setting is on.
 */
import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, LinearTransition, useReducedMotion } from 'react-native-reanimated';

import { TaskToggle } from '@/components/tasks/task-toggle';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Radius, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { formatDueDate, getDueStatus } from '@/lib/dates';
import type { Task } from '@/lib/types/task';

type TaskRowProps = {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

function TaskRowComponent({ task, onToggle, onDelete }: TaskRowProps) {
  const card = useThemeColor({}, 'card');
  const muted = useThemeColor({}, 'textMuted');
  const body = useThemeColor({}, 'textBody');
  const danger = useThemeColor({}, 'danger');
  const warning = useThemeColor({}, 'warning');

  const reduceMotion = useReducedMotion();
  const stateLabel = task.completed ? 'completed' : 'not completed';

  // Completed tasks always recede; only active tasks surface due urgency.
  let dueColor = muted;
  if (task.dueDate != null && !task.completed) {
    const status = getDueStatus(task.dueDate);
    if (status === 'overdue') dueColor = danger;
    else if (status === 'soon') dueColor = warning;
  }

  return (
    <Animated.View
      entering={reduceMotion ? undefined : FadeInDown.duration(220)}
      layout={reduceMotion ? undefined : LinearTransition.duration(220)}
      style={[styles.row, { backgroundColor: card }]}>
      <Pressable
        style={styles.toggleHit}
        onPress={() => onToggle(task.id)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: task.completed }}
        accessibilityLabel={`${task.title}, ${stateLabel}. Toggle completion.`}>
        <TaskToggle completed={task.completed} />
      </Pressable>

      <View style={styles.content}>
        <ThemedText
          style={[styles.title, task.completed && { color: muted, textDecorationLine: 'line-through' }]}>
          {task.title}
        </ThemedText>
        {task.description ? (
          <ThemedText
            style={[
              styles.description,
              { color: task.completed ? muted : body },
              task.completed && styles.strikethrough,
            ]}>
            {task.description}
          </ThemedText>
        ) : null}
        {task.dueDate != null ? (
          <View style={styles.due}>
            <IconSymbol name="calendar" size={13} color={dueColor} />
            <ThemedText style={[styles.dueLabel, { color: dueColor }]}>
              {formatDueDate(task.dueDate)}
            </ThemedText>
          </View>
        ) : null}
      </View>

      <Pressable
        style={styles.deleteHit}
        onPress={() => onDelete(task.id)}
        accessibilityRole="button"
        accessibilityLabel={`Delete task: ${task.title}`}>
        <IconSymbol name="trash" size={20} color={danger} />
      </Pressable>
    </Animated.View>
  );
}

export const TaskRow = memo(TaskRowComponent);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
  },
  // Pads the toggle to a >=44pt hit target without enlarging the visual box.
  toggleHit: {
    padding: Spacing.sm,
    margin: -Spacing.sm,
  },
  content: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  strikethrough: {
    textDecorationLine: 'line-through',
  },
  due: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: 2,
  },
  dueLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  deleteHit: {
    padding: Spacing.sm,
    margin: -Spacing.sm,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
