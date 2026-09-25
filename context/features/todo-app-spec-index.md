# To-Do App Spec Index

The AAIRLABS to-do app is built in four phases. Each phase is an independently shippable slice, built in order, and each carries its own data, states, and acceptance criteria. The full product definition lives in `context/project-overview.md`.

| Phase | Focus | Delivers | Spec |
| ----- | ----- | -------- | ---- |
| 1 | Task List + persistence | Task List screen, `Task` model, AsyncStorage read/write, add/toggle/delete via `use-tasks`, empty state | [`phase-1-task-list.md`](./phase-1-task-list.md) |
| 2 | Add Task screen | Title (required) + optional description inputs, validation, save/cancel, navigation back to list | [`phase-2-add-task.md`](./phase-2-add-task.md) |
| 3 | Voice input (FAB) | FAB, mic permission, `expo-audio` capture, transcription API, natural-language task splitting, listening/processing/error states | [`phase-3-voice-input.md`](./phase-3-voice-input.md) |
| 4 | Bonus | Due dates + sorting, search/filter, theme toggle, unit tests, animations | [`phase-4-bonus.md`](./phase-4-bonus.md) |

## Conventions shared across all phases

- **Expo SDK 57.** Confirm every API against <https://docs.expo.dev/versions/v57.0.0/> before writing code.
- Navigation is expo-router file-based routing in `src/app` (built on React Navigation).
- Screens stay thin: task state + persistence live in `hooks/use-tasks.ts`; storage in `lib/storage/`; voice logic in `lib/voice/`.
- The `Task` type is the single source of truth (`src/lib/types/task.ts`) and is used everywhere.
- Persistence writes on every mutation and hydrates once on start; components never call AsyncStorage directly.
- All colors come from `src/constants/theme.ts` via the theme hooks — no hardcoded hex.
- Every phase keeps the app running on iOS, Android, and web with no console errors, and passes `npm run lint`.
- Completed and incomplete tasks stay clearly distinguishable; empty/loading/error states are designed intentionally.

## Phase details

Each phase has its own spec with data model, states, files, and acceptance criteria:

- **Phase 1 — Task List + persistence** → [`phase-1-task-list.md`](./phase-1-task-list.md). `Task` model, `tasks-storage.ts`, `use-tasks.ts`, and the Task List screen with `FlatList`, rows, and empty state.
- **Phase 2 — Add Task screen** → [`phase-2-add-task.md`](./phase-2-add-task.md). Required title + optional description, inline validation, save/cancel, navigation.
- **Phase 3 — Voice input via FAB** → [`phase-3-voice-input.md`](./phase-3-voice-input.md). FAB, mic permission, `expo-audio` capture, transcription, natural-language splitting, listening/processing/error states.
- **Phase 4 — Bonus (optional)** → [`phase-4-bonus.md`](./phase-4-bonus.md). Due dates + sorting, search/filter, theme toggle, unit tests, animations — additive, no core regressions.

## Workflow reminder

Before starting a phase, follow `context/ai-interaction.md`: document the task in `context/current-feature.md`, branch (`feature/<phase>`), implement only what the phase defines, run and verify the app, and do not commit without approval.

## Submission checklist (exercise deliverables)

- README with run instructions and API-key setup, screenshots embedded.
- `/screenshots` folder: empty list, mixed completed/incomplete, Add Task, voice listening + resulting tasks, any bonus feature.
- Optional short GIF/MP4 of the voice flow (in addition to screenshots).
