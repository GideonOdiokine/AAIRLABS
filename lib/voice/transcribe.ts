/**
 * transcribe — send a recorded audio file to a speech-to-text API and return
 * the plain-text transcript.
 *
 * Isolated here so components never speak to the network directly. Uses Groq's
 * audio transcription endpoint, which is OpenAI-compatible and runs Whisper on a
 * free tier. The API key is read from Expo public env (`EXPO_PUBLIC_GROQ_API_KEY`)
 * and must never be committed — see the README for setup.
 *
 * Failures are surfaced as thrown `TranscriptionError`s with friendly messages;
 * callers add nothing to the list when transcription fails or returns empty.
 */

const TRANSCRIBE_URL = 'https://api.groq.com/openai/v1/audio/transcriptions';
const TRANSCRIBE_MODEL = 'whisper-large-v3-turbo';

/** Read the key at call time (not module load) so tests can stub the env. */
function getApiKey(): string | undefined {
  return process.env.EXPO_PUBLIC_GROQ_API_KEY;
}

/**
 * Whisper hallucinates a small set of stock phrases when handed silence or
 * no-speech audio — an artifact of its video-caption training data. Left
 * unchecked these become junk tasks ("Thank you"). We treat a transcript that
 * is *only* one of these (ignoring punctuation/case) as "no speech captured".
 * A real phrase that merely *contains* one of these still passes.
 */
const NO_SPEECH_HALLUCINATIONS = new Set([
  'thank you',
  'thank you.',
  'thanks for watching',
  'thanks for watching!',
  'thank you for watching',
  'you',
  'bye',
  'bye.',
  '.',
]);

/** True when the transcript is only a known silence-hallucination phrase. */
export function isNoSpeechHallucination(text: string): boolean {
  const normalized = text.trim().toLowerCase();
  return normalized === '' || NO_SPEECH_HALLUCINATIONS.has(normalized);
}

/** A transcription failure with a message safe to show the user. */
export class TranscriptionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TranscriptionError';
  }
}

/** Best-effort file name + mime from the recording URI (m4a on native, webm on web). */
function describeRecording(uri: string): { name: string; type: string } {
  const extMatch = /\.(\w+)(?:\?|$)/.exec(uri);
  const ext = (extMatch?.[1] ?? 'm4a').toLowerCase();
  const mimeByExt: Record<string, string> = {
    m4a: 'audio/m4a',
    mp4: 'audio/mp4',
    caf: 'audio/x-caf',
    webm: 'audio/webm',
    wav: 'audio/wav',
    mp3: 'audio/mpeg',
  };
  return { name: `recording.${ext}`, type: mimeByExt[ext] ?? 'audio/m4a' };
}

/**
 * Transcribe the recording at `uri`. Returns the trimmed transcript text.
 * Throws `TranscriptionError` with a friendly message on any failure.
 */
export async function transcribe(uri: string): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new TranscriptionError(
      'Voice input is not configured. Add a Groq API key to enable it.'
    );
  }

  const { name, type } = describeRecording(uri);
  const form = new FormData();
  // React Native's FormData accepts a { uri, name, type } file descriptor.
  form.append('file', { uri, name, type } as unknown as Blob);
  form.append('model', TRANSCRIBE_MODEL);
  form.append('response_format', 'text');
  // Pin language + greedy decoding: both measurably reduce Whisper's tendency
  // to hallucinate stock phrases on marginal/near-silent audio.
  form.append('language', 'en');
  form.append('temperature', '0');

  let response: Response;
  try {
    response = await fetch(TRANSCRIBE_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form,
    });
  } catch {
    // Network-level failure (offline, DNS, timeout).
    throw new TranscriptionError('Could not reach the transcription service. Check your connection.');
  }

  if (!response.ok) {
    // Do not surface raw API bodies (may contain sensitive detail) to the UI.
    throw new TranscriptionError('Transcription failed. Please try again.');
  }

  const text = (await response.text()).trim();
  // Empty transcript, or one that is only a known silence-hallucination phrase:
  // treat both as "no speech captured" so nothing junk is added to the list.
  if (isNoSpeechHallucination(text)) {
    throw new TranscriptionError('We didn’t catch that. Please try again.');
  }
  return text;
}
