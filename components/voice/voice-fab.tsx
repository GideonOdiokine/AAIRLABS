/**
 * VoiceFab — the always-reachable voice affordance on the Task List screen.
 *
 * Drives the listen → transcribe → split → add pipeline and owns the UI state
 * (idle / listening / processing / denied / error). The heavy lifting lives in
 * `lib/voice/`: transcription in `transcribe.ts`, splitting in `split-tasks.ts`.
 * On success it hands the split titles up via `onTasks`; the screen appends
 * each through `useTasks`.
 *
 * Recording uses the SDK 54 `expo-audio` API (not the deprecated `expo-av`).
 */
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
} from 'expo-audio';
import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { ListeningOverlay, type VoiceState } from '@/components/voice/listening-overlay';
import { Radius } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { splitTasks } from '@/lib/voice/split-tasks';
import { TranscriptionError, transcribe } from '@/lib/voice/transcribe';

type VoiceFabProps = {
  /** Called with the split task titles once transcription succeeds. */
  onTasks: (titles: string[]) => void;
};

export function VoiceFab({ onTasks }: VoiceFabProps) {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  const [state, setState] = useState<VoiceState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const primary = useThemeColor({}, 'tint');
  const pressedColor = useThemeColor({}, 'primaryPressed');

  // Begin recording: request permission, then capture.
  const startRecording = async () => {
    try {
      const permission = await AudioModule.requestRecordingPermissionsAsync();
      if (!permission.granted) {
        setState('denied');
        return;
      }
      await setAudioModeAsync({ playsInSilentMode: true, allowsRecording: true });
      await recorder.prepareToRecordAsync();
      recorder.record();
      setState('listening');
    } catch {
      setErrorMessage('Could not start recording. Please try again.');
      setState('error');
    }
  };

  // Stop recording and run the transcribe → split → add pipeline.
  const stopAndProcess = async () => {
    setState('processing');
    try {
      await recorder.stop();
      const uri = recorder.uri;
      if (!uri) {
        throw new TranscriptionError('No audio was recorded. Please try again.');
      }

      const transcript = await transcribe(uri);
      const titles = splitTasks(transcript);
      if (titles.length === 0) {
        // Transcript had no usable task content — add nothing.
        setErrorMessage('We didn’t catch any tasks. Please try again.');
        setState('error');
        return;
      }

      onTasks(titles);
      setState('idle');
    } catch (err) {
      setErrorMessage(
        err instanceof TranscriptionError
          ? err.message
          : 'Something went wrong. Please try again.'
      );
      setState('error');
    }
  };

  // Abandon an in-progress recording without transcribing.
  const cancelRecording = async () => {
    try {
      await recorder.stop();
    } catch {
      // Nothing to clean up if it never started.
    }
    setState('idle');
  };

  const dismiss = () => {
    setErrorMessage(null);
    setState('idle');
  };

  const isBusy = state === 'processing';

  return (
    <>
      <Pressable
        onPress={startRecording}
        disabled={isBusy}
        accessibilityRole="button"
        accessibilityLabel="Add tasks by voice"
        accessibilityState={{ disabled: isBusy, busy: isBusy }}
        style={({ pressed }) => [
          styles.fab,
          { backgroundColor: pressed ? pressedColor : primary, opacity: isBusy ? 0.5 : 1 },
        ]}>
        <IconSymbol name="mic.fill" size={26} color="#FFFFFF" />
      </Pressable>

      <ListeningOverlay
        state={state}
        errorMessage={errorMessage}
        onStop={stopAndProcess}
        onCancel={cancelRecording}
        onDismiss={dismiss}
      />
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 92, // clears the "Add Task" footer button below it
    width: 60,
    height: 60,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    // Soft elevation so the FAB reads as the one bold affordance on the list.
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
});
