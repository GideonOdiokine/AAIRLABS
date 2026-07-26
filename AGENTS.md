<!-- BEGIN:expo-agent-rules -->
# This is NOT the Expo you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing any code. Heed deprecation notices.

> This project is pinned to **Expo SDK 54** (React Native 0.81). The reason is environmental, not preference: the only available iOS simulator is capped at **iOS 16.2** (Xcode 14.2 on macOS 12, a 2016 Mac that cannot run a newer macOS), and Expo Go for SDK 57 requires iOS 16.4+. SDK 54's Expo Go is the newest that installs on iOS 16.2. Do not bump the SDK past 54 without changing the hardware/toolchain.
<!-- END:expo-agent-rules -->

# AAIRLABS — To-Do List App

AAIRLABS is a simple, clean **React Native** to-do list: add, complete, and delete tasks; browse them on a dedicated list screen; persist everything locally; and dictate new tasks by voice through a floating action button.

This repository is a **single-surface mobile app** — Expo SDK 54 + expo-router + strict TypeScript — that runs on iOS, Android, and web from one codebase. There is no backend, no auth, and no remote database. Every task lives on the device; the only network call is the optional voice-to-text transcription request.

## Context Files

Read the following to get the full context of the project:
@context/project-overview.md
@context/coding-standards.md
@context/ai-interaction.md
@context/current-feature.md

The build is planned in four phases; the index and per-phase specs live in `context/features/` — read the relevant one before starting work on that phase.
@context/features/todo-app-spec-index.md

## Repository Layout

```txt
app/                     # expo-router routes (file-based, built on React Navigation)
  _layout.tsx            # root stack / navigator
  (tabs)/                # tab group (scaffold; app targets a two-screen flow)
  index.tsx              # Task List Screen (initial route)
  add-task.tsx           # Add Task Screen (Phase 2)
  modal.tsx
components/              # presentational components
  themed-text.tsx        # existing themed primitives
  themed-view.tsx
  tasks/                 # task row, toggle, list, empty state (to add)
  voice/                 # voice FAB, listening overlay (to add)
  ui/                    # shared primitives (icon-symbol, collapsible, …)
constants/
  theme.ts               # colors + spacing tokens — single source for styling
hooks/
  use-color-scheme.ts    # existing
  use-theme-color.ts     # existing
  use-tasks.ts           # task state + persistence glue (to add)
lib/                     # non-UI logic (to add)
  storage/tasks-storage.ts   # AsyncStorage read/write
  voice/transcribe.ts        # transcription API call
  voice/split-tasks.ts       # natural-language task splitting
  types/task.ts              # the Task type — single source of truth
assets/  scripts/  app.json
```

## Hard Rules

- **Confirm every package version and API** against <https://docs.expo.dev/versions/v54.0.0/> before use — especially audio and navigation. Do not bump the SDK past 54 (see the pinning note above).
- **Screens stay thin.** Task state and persistence live in `hooks/use-tasks.ts` and `lib/`, never in route files. A component never touches AsyncStorage or the transcription API directly.
- **Persistence is isolated** behind `lib/storage/tasks-storage.ts`. Reads hydrate once on start; writes happen on every mutation (add, toggle, delete).
- The **`Task` type** (`lib/types/task.ts`) is the single source of truth and is used everywhere.
- **No hardcoded hex.** All colors come from `constants/theme.ts` through the theme hooks. Light-first, with dark mode supported.
- **Keep the API key out of source control.** Read it from env / Expo config; never commit it. If transcription fails or returns empty, surface a friendly error and add nothing.
- **Request and gracefully handle** denied microphone permission; design intentional empty / listening / processing / error states.
- Completed and incomplete tasks stay **clearly distinguishable** (strikethrough + muted, checked state). Validate inputs — no empty task titles.
- One responsibility per component; a task row does not own list logic.

## Commands

| Task              | Command                     |
| ----------------- | --------------------------- |
| Dev server        | `npm start`                 |
| Run on iOS        | `npm run ios`               |
| Run on Android    | `npm run android`           |
| Run on web        | `npm run web`               |
| Lint              | `npm run lint`              |
| Typecheck         | `npx tsc --noEmit`          |
| Reset scaffold    | `npm run reset-project`     |

Run `npm run lint` (and confirm the app starts on iOS/Android/web with no console errors) before considering a change done.

## Build Order

Phase 1 — Task List + persistence → Phase 2 — Add Task screen → Phase 3 — Voice input (FAB) → Phase 4 — Bonus (due dates, search/filter, theme toggle, tests, animations).

Each phase is an independently shippable slice. Before starting one, follow `context/ai-interaction.md`: document the task in `context/current-feature.md`, branch (`feature/<phase>`), implement only what the phase defines, run and verify the app, and do not commit without approval.
