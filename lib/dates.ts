const DAY_MS = 86_400_000;

function startOfDay(ts: number): number {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

// Calendar math rather than adding milliseconds, so DST shifts don't skew it.
function addDays(ts: number, days: number): number {
  const d = new Date(ts);
  d.setDate(d.getDate() + days);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function dayDiff(due: number, now: number): number {
  return Math.round((startOfDay(due) - startOfDay(now)) / DAY_MS);
}

export type DueStatus = 'overdue' | 'soon' | 'later';

export function getDueStatus(dueDate: number, now: number = Date.now()): DueStatus {
  const diff = dayDiff(dueDate, now);
  if (diff < 0) return 'overdue';
  if (diff <= 1) return 'soon';
  return 'later';
}

function weekday(ts: number): string {
  return new Date(ts).toLocaleDateString(undefined, { weekday: 'short' });
}

function monthDay(ts: number): string {
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

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

export type DueOption = {
  key: string;
  label: string;
  value: number | null;
};

function thisWeekend(now: number): number {
  const today = startOfDay(now);
  const day = new Date(today).getDay(); // 0 Sun … 6 Sat
  if (day === 0 || day === 6) return today; // already the weekend
  return addDays(today, 6 - day); // this week's Saturday
}

export function dueDateOptions(now: number = Date.now()): DueOption[] {
  const today = startOfDay(now);
  const all: DueOption[] = [
    { key: 'today', label: 'Today', value: today },
    { key: 'tomorrow', label: 'Tomorrow', value: addDays(today, 1) },
    { key: 'weekend', label: 'This weekend', value: thisWeekend(now) },
    { key: 'nextweek', label: 'Next week', value: addDays(today, 7) },
  ];

  // Drop options that collapse onto an earlier one: on a weekend,
  // "This weekend" is the same day as "Today".
  const seen = new Set<number>();
  return all.filter((option) => {
    if (option.value == null || seen.has(option.value)) return false;
    seen.add(option.value);
    return true;
  });
}
