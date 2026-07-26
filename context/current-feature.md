# Current Feature

Status: In progress

## Phase 2 — Add Task Screen

Spec: `context/features/phase-2-add-task.md`
Feature breakdown: `context/features/todo-app-spec-index.md`
Branch: `feature/phase-2`

### Scope

Second shippable slice: a dedicated, validated Add Task screen reached by stack
navigation, replacing the Phase 1 inline add affordance.

- `app/add-task.tsx` — Add Task screen (thin): local form state, persistence via `useTasks`
- Title input (required, trimmed) + description input (optional, multiline, trimmed → `undefined` when empty)
- Inline validation: empty/whitespace title blocks save and shows a message near the field
- Save appends via `useTasks.addTask` then `router.back()`; cancel / back gesture discards
- `app/_layout.tsx` — register `add-task` as a pushed route (list stays the initial route)
- `app/index.tsx` — replace the inline add bar with a primary "Add Task" entry point that navigates
- Reusable UI primitives extracted to `components/ui/`: `PrimaryButton`, `TextField`

> **Shared task state:** `useTasks` is lifted into a `TasksProvider` (in `hooks/use-tasks.ts`)
> wrapped at the root layout, so the list and Add Task screens share one in-memory
> instance. Without this, each screen's hook would hold a separate list and a task
> added on the Add Task screen would not appear after `router.back()`. No new
> persistence code — the Phase 1 storage/hook logic is reused unchanged.

> **Note on paths & SDK:** the repo uses root-level directories with the `@/` alias
> (no `src/` prefix), so the spec's `src/app/...` maps to `app/...`. Pinned to
> **Expo SDK 54** (RN 0.81) per `AGENTS.md`.

### Out of scope (this phase)

- Voice FAB and transcription (Phase 3)
- Editing existing tasks; due-date picker (Phase 4 bonus)

### Verification

- [ ] Tapping "Add Task" on the list navigates to the Add Task screen
- [ ] Saving with a valid title appends to storage and returns to the list with the task visible
- [ ] Empty/whitespace title is blocked with an inline message; nothing is saved
- [ ] Description is optional; saving without one works
- [ ] Cancel (and back gesture) discards input and returns to the list unchanged
- [ ] Saved task persists across a full app restart
- [ ] Runs with no console errors
- [ ] `npm run lint` passes and `npx tsc --noEmit` is clean

---

## History

- **Phase 1 — Task List + Persistence** (complete, branch `feature/phase-1`): `Task` model, AsyncStorage storage module, `use-tasks` hook, Task List screen with rows, toggle, delete, and empty state.
- **Phase 2 — Add Task Screen** (in progress, branch `feature/phase-2`): dedicated validated Add Task route, shared `TasksProvider`, reusable `PrimaryButton`/`TextField`, list entry point wired to navigation.
