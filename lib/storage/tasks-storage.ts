import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Task } from '@/lib/types/task';

const STORAGE_KEY = '@aairlabs/tasks';

// Narrows a parsed value to a valid Task, or returns null so it gets skipped.
function toTask(value: unknown): Task | null {
  if (typeof value !== 'object' || value === null) return null;
  const t = value as Record<string, unknown>;
  if (typeof t.id !== 'string' || typeof t.title !== 'string') return null;
  if (typeof t.completed !== 'boolean' || typeof t.createdAt !== 'number') return null;

  return {
    id: t.id,
    title: t.title,
    description: typeof t.description === 'string' ? t.description : undefined,
    completed: t.completed,
    createdAt: t.createdAt,
    dueDate: typeof t.dueDate === 'number' ? t.dueDate : undefined,
  };
}

export async function loadTasks(): Promise<Task[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.map(toTask).filter((t): t is Task => t !== null);
  } catch {
    // Corrupt JSON or a storage failure: fail safe to an empty list.
    return [];
  }
}

// Throws on failure so the caller decides how to surface it.
export async function saveTasks(tasks: Task[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
