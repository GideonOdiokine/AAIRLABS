/**
 * use-tasks — task state + persistence glue.
 *
 * Owns the in-memory task list, hydrates it once on mount, and writes back to
 * storage on every mutation. Screens and components consume this hook and never
 * touch AsyncStorage directly.
 */
import { useCallback, useEffect, useRef, useState } from 'react';

import { loadTasks, saveTasks } from '@/lib/storage/tasks-storage';
import type { Task } from '@/lib/types/task';

/** Generate a stable, unique id without pulling in a uuid dependency. */
function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export type UseTasks = {
  tasks: Task[];
  /** True until the initial hydrate from storage completes. */
  isLoading: boolean;
  /** Append a new task. Empty/whitespace-only titles are ignored. */
  addTask: (title: string, description?: string) => void;
  /** Flip a task's completed state. */
  toggleTask: (id: string) => void;
  /** Remove a task. */
  deleteTask: (id: string) => void;
};

export function useTasks(): UseTasks {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // Guards the initial hydrate so it never overwrites stored data on first mount.
  const hydrated = useRef(false);

  // Hydrate once on start.
  useEffect(() => {
    let active = true;
    (async () => {
      const stored = await loadTasks();
      if (active) {
        setTasks(stored);
        setIsLoading(false);
        hydrated.current = true;
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Persist on every change, but only after the initial hydrate has landed.
  useEffect(() => {
    if (!hydrated.current) return;
    // Fire-and-forget; storage failures leave in-memory state intact.
    void saveTasks(tasks);
  }, [tasks]);

  const addTask = useCallback((title: string, description?: string) => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return; // never persist an empty title
    const trimmedDescription = description?.trim();

    const task: Task = {
      id: makeId(),
      title: trimmedTitle,
      description: trimmedDescription ? trimmedDescription : undefined,
      completed: false,
      createdAt: Date.now(),
    };
    setTasks((prev) => [task, ...prev]);
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { tasks, isLoading, addTask, toggleTask, deleteTask };
}
