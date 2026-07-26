/**
 * TaskToggle — the completion checkbox for a task row.
 * Presentational: it renders checked/unchecked state and reports taps upward.
 */
import { StyleSheet, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Radius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';

type TaskToggleProps = {
  completed: boolean;
};

export function TaskToggle({ completed }: TaskToggleProps) {
  const theme = useColorScheme() ?? 'light';
  const success = useThemeColor({}, 'success');
  const border = useThemeColor({}, 'border');
  const inverse = theme === 'light' ? '#FFFFFF' : '#151718';

  return (
    <View
      style={[
        styles.box,
        completed
          ? { backgroundColor: success, borderColor: success }
          : { borderColor: border },
      ]}>
      {completed ? <IconSymbol name="checkmark" size={16} color={inverse} /> : null}
    </View>
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
