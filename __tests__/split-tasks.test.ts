/**
 * Unit tests for the voice task splitter (Phase 4 bonus).
 *
 * `splitTasks` is the highest-value pure function in the app — it turns free
 * dictation into discrete titles — so it gets the fullest coverage: single vs
 * multi-task input, each separator, leading filler, and empty/blank input.
 */
import { splitTasks } from '@/lib/voice/split-tasks';

describe('splitTasks', () => {
  it('returns a single capitalized task for single-task input', () => {
    expect(splitTasks('buy milk')).toEqual(['Buy milk']);
  });

  it('splits an "and" conjunction into separate tasks', () => {
    expect(splitTasks('buy provisions and call mom')).toEqual([
      'Buy provisions',
      'Call mom',
    ]);
  });

  it('splits on commas and "then"', () => {
    expect(splitTasks('email Sam, water plants then pay rent')).toEqual([
      'Email Sam',
      'Water plants',
      'Pay rent',
    ]);
  });

  it('does not mis-split words that merely contain a separator (e.g. "understand")', () => {
    // "understand" contains "and" but only as a substring — \band\b must not match it.
    expect(splitTasks('understand the brief')).toEqual(['Understand the brief']);
  });

  it('strips leading filler words', () => {
    expect(splitTasks('um okay call the dentist')).toEqual(['Call the dentist']);
  });

  it('trims trailing sentence punctuation', () => {
    expect(splitTasks('finish the report.')).toEqual(['Finish the report']);
  });

  it('drops empty fragments left by trailing conjunctions', () => {
    expect(splitTasks('buy milk and')).toEqual(['Buy milk']);
  });

  it('returns an empty array for empty or whitespace-only input', () => {
    expect(splitTasks('')).toEqual([]);
    expect(splitTasks('   ')).toEqual([]);
  });
});
