import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { TasksProvider } from '@/hooks/use-tasks';

export default function RootLayout() {
  const colorScheme = useColorScheme();

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
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
