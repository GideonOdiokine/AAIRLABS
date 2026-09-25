const TRANSCRIBE_URL = 'https://api.groq.com/openai/v1/audio/transcriptions';
const TRANSCRIBE_MODEL = 'whisper-large-v3-turbo';

// Read at call time rather than module load, so tests can stub the env.
function getApiKey(): string | undefined {
  return process.env.EXPO_PUBLIC_GROQ_API_KEY;
}

// Handed silence, Whisper tends to return one of a few stock phrases from its
// caption training data. A transcript that is only one of these counts as no
// speech; a real phrase that merely contains one still passes.
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

export function isNoSpeechHallucination(text: string): boolean {
  const normalized = text.trim().toLowerCase();
  return normalized === '' || NO_SPEECH_HALLUCINATIONS.has(normalized);
}

export class TranscriptionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TranscriptionError';
  }
}

// m4a on native, webm on web.
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
  // Pinning the language and using greedy decoding measurably reduces
  // Whisper's tendency to invent stock phrases on near-silent audio.
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
    // Network-level failure: offline, DNS, timeout.
    throw new TranscriptionError('Could not reach the transcription service. Check your connection.');
  }

  if (!response.ok) {
    // Never surface raw API bodies to the UI.
    throw new TranscriptionError('Transcription failed. Please try again.');
  }

  const text = (await response.text()).trim();
  // An empty transcript, or one that is only a hallucinated phrase, counts as
  // no speech captured, so nothing junk reaches the list.
  if (isNoSpeechHallucination(text)) {
    throw new TranscriptionError('We didn’t catch that. Please try again.');
  }
  return text;
}
