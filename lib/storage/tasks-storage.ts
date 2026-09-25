/**
 * Task persistence — the ONLY module that touches AsyncStorage.
 *
 * The full task list is serialized under a single key. Reads are defensive:
 * missing or corrupt data resolves to an empty list rather than throwing, so
 * the app never crashes on a bad payload.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Task } from '@/lib/types/task';

const STORAGE_KEY = '@aairlabs/tasks';

/** Narrow an untyped parsed value to a valid Task, or return null to skip it. */
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

/**
 * Load all persisted tasks. Returns an empty array when nothing is stored or
 * when the stored payload is unreadable/corrupt.
 */
export async function loadTasks(): Promise<Task[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.map(toTask).filter((t): t is Task => t !== null);
  } catch {
    // Corrupt JSON or storage failure — fail safe to an empty list.
    return [];
  }
}

/**
 * Persist the full task list, overwriting the previous payload.
 * Throws on failure so callers can decide how to surface the error.
 */
export async function saveTasks(tasks: Task[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
