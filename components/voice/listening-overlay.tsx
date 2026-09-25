/**
 * ListeningOverlay — the visual states of the voice pipeline.
 *
 * Presentational only: it renders whatever `state` the VoiceFab is in and
 * forwards user intents (stop, cancel, dismiss, retry) back up. It owns no
 * recording or transcription logic.
 *
 * States: listening (recording, user can stop or cancel), processing
 * (transcribing/splitting), denied (mic permission refused), error
 * (transcription failed or empty). Idle renders nothing.
 */
import { useEffect, useRef } from 'react';
import {
  AccessibilityInfo,
  ActivityIndicator,
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

/** The voice pipeline's UI state, shared with the VoiceFab that owns it. */
export type VoiceState = 'idle' | 'listening' | 'processing' | 'denied' | 'error';

type ListeningOverlayProps = {
  state: VoiceState;
  /** Friendly, user-safe message shown in the `error` state. */
  errorMessage?: string | null;
  /** Stop recording and start transcribing. */
  onStop: () => void;
  /** Abandon the recording and return to idle. */
  onCancel: () => void;
  /** Dismiss the denied/error message and return to idle. */
  onDismiss: () => void;
};

/** A gently pulsing red dot signalling active recording (respects reduced motion). */
function RecordingDot({ color }: { color: string }) {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let cancelled = false;
    let loop: Animated.CompositeAnimation | undefined;

    AccessibilityInfo.isReduceMotionEnabled().then((reduced) => {
      if (cancelled || reduced) return; // hold steady when reduced motion is on
      loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 0.4, duration: 700, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
        ])
      );
      loop.start();
    });

    return () => {
      cancelled = true;
      loop?.stop();
    };
  }, [pulse]);

  return <Animated.View style={[styles.dot, { backgroundColor: color, opacity: pulse }]} />;
}

export function ListeningOverlay({
  state,
  errorMessage,
  onStop,
  onCancel,
  onDismiss,
}: ListeningOverlayProps) {
  const card = useThemeColor({}, 'card');
  const text = useThemeColor({}, 'text');
  const body = useThemeColor({}, 'textBody');
  const primary = useThemeColor({}, 'tint');
  const danger = useThemeColor({}, 'danger');

  // Keep the sheet's content clear of the home indicator / bottom safe area.
  const insets = useSafeAreaInsets();

  const visible = state !== 'idle';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={state === 'listening' ? onCancel : onDismiss}>
      <View style={styles.backdrop}>
        <View
          style={[
            styles.sheet,
            { backgroundColor: card, paddingBottom: Spacing.xxl + insets.bottom },
          ]}
          accessibilityLiveRegion="polite">
          {state === 'listening' && (
            <>
              <View style={styles.indicatorRow}>
                <RecordingDot color={danger} />
                <ThemedText type="subtitle" style={{ color: text }}>
                  Listening…
                </ThemedText>
              </View>
              <ThemedText style={[styles.hint, { color: body }]}>
                Speak your tasks. Say “and” or pause between them.
              </ThemedText>
              <View style={styles.actions}>
                <Pressable
                  onPress={onCancel}
                  style={[styles.secondaryBtn, { borderColor: primary }]}
                  accessibilityRole="button"
                  accessibilityLabel="Cancel voice input">
                  <ThemedText style={{ color: primary, fontWeight: '600' }}>Cancel</ThemedText>
                </Pressable>
                <Pressable
                  onPress={onStop}
                  style={[styles.primaryBtn, { backgroundColor: primary }]}
                  accessibilityRole="button"
                  accessibilityLabel="Stop recording and add tasks">
                  <ThemedText style={styles.primaryBtnLabel}>Done</ThemedText>
                </Pressable>
              </View>
            </>
          )}

          {state === 'processing' && (
            <View style={styles.centered}>
              <ActivityIndicator color={primary} />
              <ThemedText type="subtitle" style={{ color: text }}>
                Adding your tasks…
              </ThemedText>
              <ThemedText style={[styles.hint, { color: body }]}>
                Transcribing what you said.
              </ThemedText>
            </View>
          )}

          {(state === 'denied' || state === 'error') && (
            <View style={styles.centered}>
              <ThemedText type="subtitle" style={{ color: text }}>
                {state === 'denied' ? 'Microphone needed' : 'Didn’t catch that'}
              </ThemedText>
              <ThemedText style={[styles.hint, { color: body }]}>
                {state === 'denied'
                  ? 'Enable microphone access in Settings to add tasks by voice.'
                  : errorMessage ?? 'Something went wrong. Please try again.'}
              </ThemedText>
              <Pressable
                onPress={onDismiss}
                style={[styles.primaryBtn, styles.fullBtn, { backgroundColor: primary }]}
                accessibilityRole="button"
                accessibilityLabel="Dismiss">
                <ThemedText style={styles.primaryBtnLabel}>OK</ThemedText>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    padding: Spacing.xl,
    paddingBottom: Spacing.xxl,
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    gap: Spacing.md,
  },
  indicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: Radius.pill,
  },
  hint: {
    fontSize: 15,
    lineHeight: 21,
  },
  centered: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.xs,
  },
  primaryBtn: {
    flex: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.md,
  },
  fullBtn: {
    alignSelf: 'stretch',
    marginTop: Spacing.sm,
  },
  primaryBtnLabel: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryBtn: {
    flex: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
