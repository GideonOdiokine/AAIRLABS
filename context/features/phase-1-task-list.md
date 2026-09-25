# Phase 1 — Task List + Persistence

> First shippable slice. Delivers the Task List screen, the `Task` model, local persistence, and the add/toggle/delete mutations. See [`todo-app-spec-index.md`](./todo-app-spec-index.md) for phase order and shared conventions.

## Goal

A user can open the app, see their tasks, add / complete / delete them, and find the same list after a full restart. No Add Task screen yet (Phase 2) and no voice (Phase 3) — adding in this phase can be a minimal inline affordance so the flow is testable end to end.

## Scope

**In:** `Task` type, AsyncStorage module, `use-tasks` hook, Task List screen with `FlatList`, task rows, empty state.

**Out:** dedicated Add Task screen, voice FAB, due dates, search, animations.

## Files

| File | Responsibility |
| ---- | -------------- |
| `src/lib/types/task.ts` | The `Task` type — single source of truth, imported everywhere |
| `src/lib/storage/tasks-storage.ts` | Read/write the serialized task array to AsyncStorage; only module that touches AsyncStorage |
| `src/hooks/use-tasks.ts` | Task state + persistence glue: hydrate on start, expose `addTask`, `toggleTask`, `deleteTask`, `tasks`, `isLoading` |
| `src/app/index.tsx` | Task List screen (thin — delegates to the hook) |
| `src/components/tasks/task-list.tsx` | `FlatList` wrapper + empty state switch |
| `src/components/tasks/task-row.tsx` | One row: toggle, title, optional description, delete |
| `src/components/tasks/task-toggle.tsx` | Completion checkbox |
| `src/components/tasks/empty-state.tsx` | "No tasks yet" block |

Add dependency: `@react-native-async-storage/async-storage` (confirm the SDK 57–compatible version against <https://docs.expo.dev/versions/v57.0.0/>).

## Data model

```ts
// src/lib/types/task.ts
type Task = {
  id: string;           // uuid or timestamp-based, unique
  title: string;        // required, non-empty (trimmed)
  description?: string; // optional
  completed: boolean;
  createdAt: number;    // epoch ms
  dueDate?: number;     // reserved for Phase 4; unused here
};
```

## Persistence rules

- Single storage key: `@aairlabs/tasks` holding the serialized `Task[]`.
- Hydrate **once** on app start into hook state (`isLoading` until read completes).
- Write on **every** mutation (add, toggle, delete).
- Components never call AsyncStorage directly — only `tasks-storage.ts` does, and only `use-tasks` calls it.
- Corrupt/missing stored data → treat as empty list, do not crash.

## Screen states

| State | Behavior |
| ----- | -------- |
| Loading | Brief loading indicator while hydrating; no flash of empty state |
| Empty | Intentional empty block: "No tasks yet — add one to get started" |
| Populated | Scrollable `FlatList`; completed and incomplete rows clearly distinguishable |
| Completed row | Muted text + strikethrough + checked toggle (colors from theme) |

## UI requirements

- Screen header/title.
- Each row: completion toggle (checkbox), title, optional description, delete action.
- Adequate hit targets and accessibility labels on toggle and delete.
- Delete is destructive — confirm before removing (Alert or equivalent).
- A minimal "add task" entry point so the phase is testable (full screen arrives in Phase 2).
- All colors from `src/constants/theme.ts` via the theme hooks — no hardcoded hex.

## Acceptance criteria

- [ ] Adding a task appends it and it appears in the list.
- [ ] Toggling flips completed state with clear visual distinction.
- [ ] Deleting removes the task (after confirmation).
- [ ] The list survives a full app restart (kill + reopen).
- [ ] Empty state shows when there are no tasks.
- [ ] Runs on iOS, Android, and web with no console errors.
- [ ] `npm run lint` passes.

## Workflow

Follow [`../ai-interaction.md`](../ai-interaction.md): document in `context/current-feature.md`, branch `feature/phase-1`, implement only Phase 1, run and verify on a device/emulator, do not commit without approval.
