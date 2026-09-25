/**
 * use-visible-tasks — derive the on-screen task list from the full list plus the
 * active search query and status filter (Phase 4 bonus).
 *
 * Pure view-derivation: it filters and sorts a copy and never mutates state or
 * touches storage, so the list screen stays thin. Sort order: dated tasks first,
 * soonest due at the top; undated tasks after, newest first.
 */
import { useMemo } from 'react';

import type { Task } from '@/lib/types/task';

/** Which completion states to show. */
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

/** Dated-first (soonest due), then undated by newest created. */
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
