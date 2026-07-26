/**
 * Unit tests for the no-speech guard in the transcription module.
 *
 * Whisper hallucinates stock phrases ("Thank you", "Thanks for watching") when
 * handed silence. `isNoSpeechHallucination` catches those so they never become
 * junk tasks — while leaving real phrases that merely contain such words alone.
 */
import { isNoSpeechHallucination } from '@/lib/voice/transcribe';

describe('isNoSpeechHallucination', () => {
  it('flags an empty or whitespace-only transcript', () => {
    expect(isNoSpeechHallucination('')).toBe(true);
    expect(isNoSpeechHallucination('   ')).toBe(true);
  });

  it('flags bare silence-hallucination phrases regardless of case/punctuation', () => {
    expect(isNoSpeechHallucination('Thank you.')).toBe(true);
    expect(isNoSpeechHallucination('thank you')).toBe(true);
    expect(isNoSpeechHallucination('Thanks for watching!')).toBe(true);
    expect(isNoSpeechHallucination('You')).toBe(true);
    expect(isNoSpeechHallucination('.')).toBe(true);
  });

  it('passes a real phrase that merely contains a hallucination word', () => {
    expect(isNoSpeechHallucination('write a thank you note')).toBe(false);
    expect(isNoSpeechHallucination('call mom and buy milk')).toBe(false);
  });
});
