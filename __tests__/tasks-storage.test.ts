/**
 * Unit tests for task persistence (Phase 4 bonus).
 *
 * Uses the official AsyncStorage jest mock so tests run without a native
 * module. Covers the round-trip, the corrupt-data fail-safe, and the field
 * coercion that drops malformed entries rather than surfacing them.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

import { loadTasks, saveTasks } from '@/lib/storage/tasks-storage';
import type { Task } from '@/lib/types/task';

// Swap the native module for the in-memory mock the package ships for Jest.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

const STORAGE_KEY = '@aairlabs/tasks';

const sampleTask: Task = {
  id: 'abc123',
  title: 'Buy milk',
  description: 'Semi-skimmed',
  completed: false,
  createdAt: 1_700_000_000_000,
  dueDate: 1_700_086_400_000,
};

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe('tasks-storage', () => {
  it('returns an empty array when nothing is stored', async () => {
    expect(await loadTasks()).toEqual([]);
  });

  it('round-trips a saved task list', async () => {
    await saveTasks([sampleTask]);
    expect(await loadTasks()).toEqual([sampleTask]);
  });

  it('omits an undefined optional field on load', async () => {
    const undated: Task = { ...sampleTask, dueDate: undefined, description: undefined };
    await saveTasks([undated]);

    const [loaded] = await loadTasks();
    expect(loaded.dueDate).toBeUndefined();
    expect(loaded.description).toBeUndefined();
  });

  it('fails safe to an empty array on corrupt JSON', async () => {
    await AsyncStorage.setItem(STORAGE_KEY, 'not-json{{{');
    expect(await loadTasks()).toEqual([]);
  });

  it('returns an empty array when the payload is not an array', async () => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ not: 'an array' }));
    expect(await loadTasks()).toEqual([]);
  });

  it('drops malformed entries but keeps the valid ones', async () => {
    const payload = [
      sampleTask,
      { id: 'x', title: 42 }, // wrong types — should be skipped
      null,
      { title: 'no id, completed missing' },
    ];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));

    expect(await loadTasks()).toEqual([sampleTask]);
  });
});
