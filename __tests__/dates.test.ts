/**
 * Unit tests for the due-date helpers (Phase 4 bonus).
 *
 * All times are built from local Date components and compared against an
 * explicit `now`, so the assertions are timezone-independent. We assert the
 * relative labels (today / tomorrow / overdue) rather than locale-formatted
 * weekday/month strings, which vary by environment.
 */
import { dueDateOptions, formatDueDate, getDueStatus } from '@/lib/dates';

/** Local midnight for a Y/M/D, plus an optional day offset. */
function localDay(year: number, month: number, day: number, offset = 0): number {
  const d = new Date(year, month, day + offset);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

// Reference "now": mid-morning on 15 Jul 2026, local time.
const NOW = new Date(2026, 6, 15, 10, 0, 0).getTime();

describe('getDueStatus', () => {
  it('classifies a past date as overdue', () => {
    expect(getDueStatus(localDay(2026, 6, 15, -1), NOW)).toBe('overdue');
  });

  it('classifies today and tomorrow as soon', () => {
    expect(getDueStatus(localDay(2026, 6, 15), NOW)).toBe('soon');
    expect(getDueStatus(localDay(2026, 6, 15, 1), NOW)).toBe('soon');
  });

  it('classifies dates two or more days out as later', () => {
    expect(getDueStatus(localDay(2026, 6, 15, 2), NOW)).toBe('later');
    expect(getDueStatus(localDay(2026, 6, 15, 10), NOW)).toBe('later');
  });
});

describe('formatDueDate', () => {
  it('labels today and tomorrow', () => {
    expect(formatDueDate(localDay(2026, 6, 15), NOW)).toBe('Due today');
    expect(formatDueDate(localDay(2026, 6, 15, 1), NOW)).toBe('Due tomorrow');
  });

  it('pluralizes overdue days', () => {
    expect(formatDueDate(localDay(2026, 6, 15, -1), NOW)).toBe('Overdue by 1 day');
    expect(formatDueDate(localDay(2026, 6, 15, -3), NOW)).toBe('Overdue by 3 days');
  });
});

describe('dueDateOptions', () => {
  it('never returns two options with the same due date', () => {
    // Sunday 19 Jul 2026 — "This weekend" collapses onto "Today" and is dropped.
    const options = dueDateOptions(new Date(2026, 6, 19, 9, 0, 0).getTime());
    const values = options.map((o) => o.value);
    expect(new Set(values).size).toBe(values.length);
    expect(options.some((o) => o.key === 'weekend')).toBe(false);
  });

  it('keeps a distinct weekend option on a weekday', () => {
    // Wednesday 15 Jul 2026 — Saturday is distinct from today.
    const options = dueDateOptions(NOW);
    expect(options.some((o) => o.key === 'weekend')).toBe(true);
  });
});
