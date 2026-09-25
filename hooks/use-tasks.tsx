import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

import { loadTasks, saveTasks } from '@/lib/storage/tasks-storage';
import type { Task } from '@/lib/types/task';

// Timestamp + random suffix, so no uuid dependency is needed.
function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export type UseTasks = {
  tasks: Task[];
  isLoading: boolean;
  addTask: (title: string, description?: string, dueDate?: number) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
};

function useTasksState(): UseTasks {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // Guards the initial hydrate so it never overwrites stored data on first mount.
  const hydrated = useRef(false);

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

  // Persist on every change, but only once the initial hydrate has landed.
  useEffect(() => {
    if (!hydrated.current) return;
    // Fire and forget: a failed write leaves the in-memory list intact.
    void saveTasks(tasks);
  }, [tasks]);

  const addTask = useCallback((title: string, description?: string, dueDate?: number) => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;
    const trimmedDescription = description?.trim();

    const task: Task = {
      id: makeId(),
      title: trimmedTitle,
      description: trimmedDescription ? trimmedDescription : undefined,
      completed: false,
      createdAt: Date.now(),
      dueDate: typeof dueDate === 'number' ? dueDate : undefined,
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

const TasksContext = createContext<UseTasks | null>(null);

// One shared task list for the whole app. Wraps the root navigator.
export function TasksProvider({ children }: { children: React.ReactNode }) {
  const value = useTasksState();
  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

export function useTasks(): UseTasks {
  const ctx = useContext(TasksContext);
  if (!ctx) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return ctx;
}
