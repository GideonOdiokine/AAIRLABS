/**
 * TaskToggle — the completion checkbox for a task row.
 * Presentational: it renders checked/unchecked state and reports taps upward.
 *
 * The box fill and the check-mark animate in/out on toggle (Phase 4 bonus); the
 * animation is skipped when the OS reduced-motion setting is on.
 */
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Radius } from '@/constants/theme';
import { useResolvedColorScheme } from '@/hooks/use-theme-preference';
import { useThemeColor } from '@/hooks/use-theme-color';

type TaskToggleProps = {
  completed: boolean;
};

export function TaskToggle({ completed }: TaskToggleProps) {
  const theme = useResolvedColorScheme();
  const success = useThemeColor({}, 'success');
  const border = useThemeColor({}, 'border');
  const inverse = theme === 'light' ? '#FFFFFF' : '#151718';

  const reduceMotion = useReducedMotion();
  // Drives both the fill and the check: 0 = empty, 1 = complete.
  const progress = useSharedValue(completed ? 1 : 0);

  useEffect(() => {
    const target = completed ? 1 : 0;
    progress.value = reduceMotion ? target : withTiming(target, { duration: 160 });
  }, [completed, reduceMotion, progress]);

  const boxStyle = useAnimatedStyle(() => ({
    backgroundColor: progress.value > 0.5 ? success : 'transparent',
    borderColor: progress.value > 0.5 ? success : border,
  }));

  const checkStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: 0.6 + progress.value * 0.4 }],
  }));

  return (
    <Animated.View style={[styles.box, boxStyle]}>
      <Animated.View style={checkStyle}>
        <IconSymbol name="checkmark" size={16} color={inverse} />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: 24,
    height: 24,
    borderRadius: Radius.sm,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
