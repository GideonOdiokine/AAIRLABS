/**
 * split-tasks — turn a raw voice transcript into discrete task titles.
 *
 * Pure and dependency-free (easy to unit-test in Phase 4). Given natural
 * dictation like "buy provisions and call mom" it returns
 * `["Buy provisions", "Call mom"]`; a single task in yields a single task out.
 *
 * Heuristic, not a parser: people speak lists with conjunctions ("and",
 * "then"), commas, and leading filler ("um", "okay"). We split on those
 * separators, strip filler, collapse whitespace, and capitalize each result.
 */

/** Separators between spoken tasks: commas, semicolons, "and", "then", "&", newlines. */
const SEPARATORS = /\s*(?:,|;|&|\n|\band\b|\bthen\b)\s*/gi;

/**
 * Filler words dropped only when they lead a fragment — they add no task
 * content ("um call mom" → "Call mom"). Kept mid-phrase so real titles like
 * "buy milk" stay intact.
 */
const LEADING_FILLER = new Set([
  'um',
  'uh',
  'er',
  'erm',
  'okay',
  'ok',
  'so',
  'please',
  'also',
  'and',
  'then',
  'like',
]);

/** Remove leading filler tokens from an already-split fragment. */
function stripLeadingFiller(fragment: string): string {
  const words = fragment.split(/\s+/);
  let start = 0;
  while (start < words.length && LEADING_FILLER.has(words[start].toLowerCase())) {
    start += 1;
  }
  return words.slice(start).join(' ');
}

/** Uppercase the first character, leaving the rest of the title untouched. */
function capitalizeFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Split a transcript into trimmed, non-empty, capitalized task titles.
 * Returns an empty array for empty/whitespace-only input.
 */
export function splitTasks(transcript: string): string[] {
  if (!transcript.trim()) return [];

  return transcript
    .split(SEPARATORS)
    .map((fragment) => stripLeadingFiller(fragment.trim()))
    // Drop stray trailing punctuation left by the transcription.
    .map((fragment) => fragment.replace(/[.!?]+$/, '').trim())
    .filter((fragment) => fragment.length > 0)
    .map(capitalizeFirst);
}
