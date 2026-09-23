import { useMemo } from 'react';

import type { Task } from '@/lib/types/task';

export type TaskFilter = 'all' | 'active' | 'done';

function matchesQuery(task: Task, query: string): boolean {
  if (!query) return true;
  const haystack = `${task.title} ${task.description ?? ''}`.toLowerCase();
  return haystack.includes(query);
}

function matchesFilter(task: Task, filter: TaskFilter): boolean {
  if (filter === 'active') return !task.completed;
  if (filter === 'done') return task.completed;
  return true;
}

// Dated tasks first, soonest due at the top; undated after, newest first.
function compareTasks(a: Task, b: Task): number {
  if (a.dueDate != null && b.dueDate != null) {
    if (a.dueDate !== b.dueDate) return a.dueDate - b.dueDate;
    return b.createdAt - a.createdAt;
  }
  if (a.dueDate != null) return -1;
  if (b.dueDate != null) return 1;
  return b.createdAt - a.createdAt;
}

export function useVisibleTasks(
  tasks: Task[],
  query: string,
  filter: TaskFilter
): Task[] {
  const normalizedQuery = query.trim().toLowerCase();

  return useMemo(() => {
    return tasks
      .filter((task) => matchesFilter(task, filter) && matchesQuery(task, normalizedQuery))
      .sort(compareTasks);
  }, [tasks, normalizedQuery, filter]);
}
