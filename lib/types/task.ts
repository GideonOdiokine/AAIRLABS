/**
 * The Task model — single source of truth for the shape of a to-do item.
 * Imported everywhere a task is created, stored, or rendered.
 */
export type Task = {
  /** Unique, stable identifier (timestamp + random suffix). */
  id: string;
  /** Required, non-empty title (already trimmed before storage). */
  title: string;
  /** Optional free-text detail. */
  description?: string;
  /** Whether the task has been checked off. */
  completed: boolean;
  /** Creation time in epoch milliseconds. */
  createdAt: number;
  /** Reserved for Phase 4 (due dates); unused in Phase 1. */
  dueDate?: number;
};
