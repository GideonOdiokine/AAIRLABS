import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { TasksProvider } from '@/hooks/use-tasks';
import {
  ThemePreferenceProvider,
  useResolvedColorScheme,
} from '@/hooks/use-theme-preference';

function RootNavigator() {
  const colorScheme = useResolvedColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <TasksProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="add-task" options={{ presentation: 'card' }} />
        </Stack>
      </TasksProvider>
      {/* Follow the in-app theme choice, not the OS scheme, so the bar stays
          readable when the toggle overrides the device setting. */}
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemePreferenceProvider>
      <RootNavigator />
    </ThemePreferenceProvider>
  );
}
