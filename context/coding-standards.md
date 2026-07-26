# AAIRLABS Coding Standards

> Coding standards for the AAIRLABS To-Do List app (React Native + Expo SDK 57, expo-router)

---

## 📋 Table of Contents

- [Expo & SDK Version](#-expo--sdk-version)
- [TypeScript](#-typescript)
- [React & React Native](#-react--react-native)
- [Navigation (expo-router)](#-navigation-expo-router)
- [State & Persistence](#-state--persistence)
- [Voice Input](#-voice-input)
- [Styling & Theming](#-styling--theming)
- [File Organization](#-file-organization)
- [Naming](#-naming)
- [Error Handling](#-error-handling)
- [Accessibility](#-accessibility)
- [Testing](#-testing)
- [Code Quality](#-code-quality)
- [Security & Secrets](#-security--secrets)

---

## 📦 Expo & SDK Version

**Critical:** this project runs on **Expo SDK 57**. Expo has changed.

- Read <https://docs.expo.dev/versions/v57.0.0/> before writing or reviewing app code.
- Use SDK 57 APIs: `expo-audio` for recording (not the deprecated `expo-av`), `expo-router` for navigation.
- Confirm every added package's version is SDK-57 compatible (`npx expo install <pkg>`), not a hand-picked npm version.
- Do not introduce a classic bare React Navigation setup — routing goes through expo-router files in `src/app`.

---

## 🔷 TypeScript

- Strict mode enabled
- No `any` types — use `unknown` when a type is genuinely uncertain
- Define types for:
  - the `Task` model
  - component props
  - storage payloads
  - voice transcription / split results
- Prefer inference where obvious; add explicit types where they aid readability
- Keep shared types in `src/lib/types/`

---

## ⚛️ React & React Native

- Functional components only
- Use hooks for state and side effects
- One responsibility per component — a task row renders a task; it does not own list or storage logic
- Extract shared behavior into custom hooks only when there is real reuse (`use-tasks`)
- Prefer composition over large multi-purpose components
- Keep screens (route files) thin: they wire hooks and components together, they do not contain persistence or API code
- Use `FlatList` (not `.map` in a `ScrollView`) for the task list

---

## 🧭 Navigation (expo-router)

- Routes live in `src/app` as files; the root navigator is `src/app/_layout.tsx`
- Task List is the initial route (`index.tsx`); Add Task is a pushed route (`add-task.tsx`)
- Use the expo-router `router` / `<Link>` and typed routes (enabled via `experiments.typedRoutes` in `app.json`)
- Return to the list on save/cancel with `router.back()` rather than re-pushing
- expo-router is built on React Navigation — this satisfies the exercise's navigation requirement

---

## 💾 State & Persistence

- Task state and its persistence glue live in `hooks/use-tasks.ts`
- AsyncStorage access is isolated in `lib/storage/tasks-storage.ts` — components and screens never import AsyncStorage directly
- Hydrate state once on app start; write on every mutation (add / toggle / delete)
- Serialize with a single well-named key (e.g. `@aairlabs/tasks`)
- Never block the first render on storage — show a sensible state while hydrating
- Keep task IDs stable and unique (uuid or timestamp-based)

---

## 🎙️ Voice Input

- Recording, transcription, and task-splitting each live in their own module under `lib/voice/`
- Request microphone permission before recording and handle denial gracefully
- The FAB component owns UI state (idle / listening / processing / error), not the transcription logic
- Task-splitting (`split-tasks.ts`) is a pure function — easy to unit test
- Never add tasks from an empty or failed transcription

---

## 🎨 Styling & Theming

- Style with React Native `StyleSheet.create`; no inline style objects except truly dynamic values
- Read all colors from the theme in `src/constants/theme.ts` via `use-theme` / `use-color-scheme`
- No hardcoded hex values in components
- Light mode is the primary target; keep dark-mode tokens working since the hooks already support it
- Respect reduced-motion for any animation
- Use consistent spacing and radius tokens; avoid one-off magic numbers

---

## 📁 File Organization

Follow the structure in `context/project-overview.md`.

- Routes: `src/app/[route].tsx`
- Feature components: `src/components/[group]/...` (`tasks/`, `voice/`)
- Shared primitives: `src/components/ui/...` and existing themed components
- Hooks: `src/hooks/[name].ts`
- Storage / voice / types: `src/lib/[domain]/...`
- Theme tokens: `src/constants/theme.ts`

---

## 🏷️ Naming

- Components: PascalCase (`TaskRow`, `VoiceFab`)
- Files: kebab-case (`task-row.tsx`, `split-tasks.ts`)
- Hooks: `use-` prefix, camelCase export (`useTasks`)
- Functions: camelCase
- Constants: SCREAMING_SNAKE_CASE
- Types / interfaces: PascalCase

---

## 🚨 Error Handling

- Design empty, loading, and error states intentionally — never leave a blank screen
- Validate inputs: block saving a task with an empty title and show an inline message
- Show user-friendly messages; never surface raw API or storage errors in the UI
- Handle denied microphone permission, offline transcription failures, and empty transcripts explicitly
- Wrap storage and network calls in try/catch and fail safely (keep existing tasks intact)

---

## ♿ Accessibility

- Every interactive element has an `accessibilityLabel` / `accessibilityRole`
- Task toggle and delete controls have hit targets ≥ 44pt
- The voice FAB announces its state (listening / processing)
- Sufficient contrast for completed (muted) task text
- Respect the OS reduced-motion setting for animations

---

## ✅ Testing

- Prefer testing pure logic first: `split-tasks.ts` and `tasks-storage.ts` are the highest-value targets
- Use Jest + React Native Testing Library for component behavior (bonus scope)
- Test user-visible behavior (add, toggle, delete, empty state), not implementation details
- Add a regression test with every bug fix
- Keep tests near the source file when practical

---

## 🧼 Code Quality

- No commented-out code, unused imports, or dead variables
- Keep components small and readable; split when a file gets hard to scan
- Prefer clear names over clever abstractions
- Comment non-obvious decisions (e.g. the splitting heuristic), not obvious code
- Run `npm run lint` before committing; keep the app running on iOS, Android, and web

---

## 🔐 Security & Secrets

- The speech-to-text API key must **never** be committed
- Read it from environment / Expo config (e.g. `expo-constants` extra), and keep the value in an untracked file
- Do not log the API key, raw audio, or full API responses
- Document key setup in the README without including a real key

---

## 🟢 AAIRLABS-Specific Rules

- Keep the app to the two required screens plus optional voice/confirm overlays — do not sprawl
- The task list is the hero; keep chrome minimal
- Completed and incomplete tasks must stay clearly distinguishable
- The voice FAB is the one bold affordance on the list — keep it always reachable
- Build the cleanest version of the core flow first; add bonus features only after it is solid
