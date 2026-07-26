/**
 * transcribe — send a recorded audio file to a speech-to-text API and return
 * the plain-text transcript.
 *
 * Isolated here so components never speak to the network directly. Uses
 * OpenAI's audio transcription endpoint (Whisper). The API key is read from
 * Expo public env (`EXPO_PUBLIC_OPENAI_API_KEY`) and must never be committed —
 * see the README for setup.
 *
 * Failures are surfaced as thrown `TranscriptionError`s with friendly messages;
 * callers add nothing to the list when transcription fails or returns empty.
 */

const OPENAI_TRANSCRIBE_URL = 'https://api.openai.com/v1/audio/transcriptions';
const TRANSCRIBE_MODEL = 'whisper-1';

/** Read the key at call time (not module load) so tests can stub the env. */
function getApiKey(): string | undefined {
  return process.env.EXPO_PUBLIC_OPENAI_API_KEY;
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
      'Voice input is not configured. Add an OpenAI API key to enable it.'
    );
  }

  const { name, type } = describeRecording(uri);
  const form = new FormData();
  // React Native's FormData accepts a { uri, name, type } file descriptor.
  form.append('file', { uri, name, type } as unknown as Blob);
  form.append('model', TRANSCRIBE_MODEL);
  form.append('response_format', 'text');

  let response: Response;
  try {
    response = await fetch(OPENAI_TRANSCRIBE_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form,
    });
  } catch {
    // Network-level failure (offline, DNS, timeout).
    throw new TranscriptionError('Could not reach the transcription service. Check your connection.');
  }

  if (!response.ok) {
    // TEMP DIAGNOSTIC — remove before committing. Logs status + body to the
    // dev console so we can see why OpenAI rejected the request.
    const debugBody = await response.text().catch(() => '<no body>');
    console.warn('[transcribe] OpenAI error', response.status, debugBody);
    // Do not surface raw API bodies (may contain sensitive detail) to the UI.
    throw new TranscriptionError('Transcription failed. Please try again.');
  }

  const text = (await response.text()).trim();
  if (!text) {
    throw new TranscriptionError('We didn’t catch that. Please try again.');
  }
  return text;
}
