import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { TasksProvider } from '@/hooks/use-tasks';
import {
  ThemePreferenceProvider,
  useResolvedColorScheme,
} from '@/hooks/use-theme-preference';

/** Inner tree — reads the resolved scheme so the in-app toggle drives chrome too. */
function RootNavigator() {
  const colorScheme = useResolvedColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* One shared task list for every screen (list + Add Task). */}
      <TasksProvider>
        {/* Single stack: Task List (index) is the initial route; Add Task is
            pushed on top. Headers are handled per-screen. */}
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="add-task" options={{ presentation: 'card' }} />
        </Stack>
      </TasksProvider>
      {/* Drive the status bar from the app's resolved scheme (not the OS) so it
          stays readable when the in-app toggle overrides the device setting:
          light text on the dark theme, dark text on the light theme. */}
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    // Persisted light / dark / system choice, resolved for every color hook.
    <ThemePreferenceProvider>
      <RootNavigator />
    </ThemePreferenceProvider>
  );
}
