/**
 * dates — pure helpers for the optional due-date feature (Phase 4 bonus).
 *
 * A due date is stored as the epoch-ms of the chosen day's local midnight (see
 * `Task.dueDate`). These helpers turn that into quick-pick options, a relative
 * status (overdue / soon / later), and a short human label. Kept dependency-free
 * so they stay easy to reason about and to unit-test.
 */

const DAY_MS = 86_400_000;

/** Local midnight (start of day) for a timestamp. */
function startOfDay(ts: number): number {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/** Local midnight `days` from the given timestamp — DST-safe via calendar math. */
function addDays(ts: number, days: number): number {
  const d = new Date(ts);
  d.setDate(d.getDate() + days);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/** Whole-day difference between two timestamps (positive = `due` is later). */
function dayDiff(due: number, now: number): number {
  return Math.round((startOfDay(due) - startOfDay(now)) / DAY_MS);
}

/** Urgency bucket used to color a task's due badge. */
export type DueStatus = 'overdue' | 'soon' | 'later';

/** Classify a due date: past = overdue, today/tomorrow = soon, else later. */
export function getDueStatus(dueDate: number, now: number = Date.now()): DueStatus {
  const diff = dayDiff(dueDate, now);
  if (diff < 0) return 'overdue';
  if (diff <= 1) return 'soon';
  return 'later';
}

/** Short weekday, e.g. "Mon". */
function weekday(ts: number): string {
  return new Date(ts).toLocaleDateString(undefined, { weekday: 'short' });
}

/** Short month + day, e.g. "Jul 28". */
function monthDay(ts: number): string {
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

/** A compact, relative due-date label for a task row. */
export function formatDueDate(dueDate: number, now: number = Date.now()): string {
  const diff = dayDiff(dueDate, now);
  if (diff < 0) {
    const by = Math.abs(diff);
    return `Overdue by ${by} ${by === 1 ? 'day' : 'days'}`;
  }
  if (diff === 0) return 'Due today';
  if (diff === 1) return 'Due tomorrow';
  if (diff < 7) return `Due ${weekday(dueDate)}`;
  return `Due ${monthDay(dueDate)}`;
}

/** A quick-pick option in the due-date picker. `value` null clears the date. */
export type DueOption = {
  key: string;
  label: string;
  /** Stored due date (local midnight epoch ms), or null to clear. */
  value: number | null;
};

/** The upcoming weekend's Saturday, or today if it is already the weekend. */
function thisWeekend(now: number): number {
  const today = startOfDay(now);
  const day = new Date(today).getDay(); // 0 Sun … 6 Sat
  if (day === 0 || day === 6) return today; // already the weekend
  return addDays(today, 6 - day); // this week's Saturday
}

/** Quick-pick options for the picker, relative to `now`. */
export function dueDateOptions(now: number = Date.now()): DueOption[] {
  const today = startOfDay(now);
  const all: DueOption[] = [
    { key: 'today', label: 'Today', value: today },
    { key: 'tomorrow', label: 'Tomorrow', value: addDays(today, 1) },
    { key: 'weekend', label: 'This weekend', value: thisWeekend(now) },
    { key: 'nextweek', label: 'Next week', value: addDays(today, 7) },
  ];

  // Drop options that collapse onto an earlier one — e.g. on a weekend,
  // "This weekend" equals "Today" — so no two chips share a due date.
  const seen = new Set<number>();
  return all.filter((option) => {
    if (option.value == null || seen.has(option.value)) return false;
    seen.add(option.value);
    return true;
  });
}
