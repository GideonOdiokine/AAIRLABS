# Current Feature

Status: In progress

## Phase 1 — Task List + Persistence

Spec: `context/features/phase-1-task-list.md`
Feature breakdown: `context/features/todo-app-spec-index.md`
Branch: `feature/phase-1`

### Scope

First shippable slice: the Task List screen plus local persistence.

- `Task` type — single source of truth (`lib/types/task.ts`)
- AsyncStorage read/write isolated in `lib/storage/tasks-storage.ts`
- `use-tasks` hook: hydrate on start, expose `tasks`, `isLoading`, `addTask`, `toggleTask`, `deleteTask`
- Task List screen (`app/index.tsx`) — thin, delegates to the hook
- `FlatList` wrapper + empty-state switch, task row (toggle / title / optional description / delete), completion toggle
- Minimal inline "add task" affordance so the flow is testable end to end (full Add Task screen is Phase 2)
- Loading / empty / populated / completed-row states; theme tokens only (no hardcoded hex)

> **Note on paths & SDK:** the repo uses root-level directories with the `@/` alias (no `src/` prefix), so the spec's `src/app/...` maps to `app/...`. The project is pinned to **Expo SDK 54** (RN 0.81) per `AGENTS.md`; APIs are confirmed against <https://docs.expo.dev/versions/v54.0.0/>, not the SDK 57 the older overview docs mention.

> **Structural change:** the demo `(tabs)` group is removed and the root navigator becomes a single stack with the Task List as the initial route, matching the spec's two-screen flow (Task List → Add Task in Phase 2).

### Out of scope (this phase)

- Add Task screen (Phase 2)
- Voice FAB and transcription (Phase 3)
- All bonus features (Phase 4)

### Verification

- [x] Adding a task appends it and it appears in the list — verified on web
- [x] Toggling flips completed state with clear visual distinction — verified (green check + strikethrough + muted)
- [x] Deleting removes the task after confirmation — verified (web `window.confirm`; native uses `Alert`)
- [x] List survives a full app restart — verified via page reload (tasks + completed state rehydrated)
- [x] Empty state shows when there are no tasks — verified
- [x] Runs with no console errors — verified on web (no errors in console)
- [x] `npm run lint` passes and `npx tsc --noEmit` is clean

> Verified thoroughly on web (Metro). iOS/Android not yet run here, but the code is cross-platform (RN `Alert` on native, `window.confirm` on web; SafeAreaView, FlatList, standard RN primitives).

---

## History

- **Phase 1 — Task List + Persistence** (in progress, branch `feature/phase-1`): implementing the `Task` model, AsyncStorage storage module, `use-tasks` hook, and the Task List screen with rows, toggle, delete, and empty state.
