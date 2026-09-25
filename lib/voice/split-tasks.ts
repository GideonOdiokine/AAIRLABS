// Separators people actually speak between tasks.
const SEPARATORS = /\s*(?:,|;|&|\n|\band\b|\bthen\b)\s*/gi;

// Dropped only when they lead a fragment ("um call mom" -> "Call mom").
// Left alone mid-phrase so real titles stay intact.
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

function stripLeadingFiller(fragment: string): string {
  const words = fragment.split(/\s+/);
  let start = 0;
  while (start < words.length && LEADING_FILLER.has(words[start].toLowerCase())) {
    start += 1;
  }
  return words.slice(start).join(' ');
}

function capitalizeFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

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
