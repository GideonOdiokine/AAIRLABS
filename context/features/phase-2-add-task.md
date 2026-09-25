# Phase 2 — Add Task Screen

> Second shippable slice. Replaces the Phase 1 inline add affordance with a dedicated, validated Add Task screen reached by navigation. See [`todo-app-spec-index.md`](./todo-app-spec-index.md) for phase order and shared conventions.

## Goal

From the Task List, the user taps "Add Task", lands on a dedicated screen, enters a required title and an optional description, and saves — which appends to storage and returns to the list with the new task visible. Cancel discards and returns without saving.

## Scope

**In:** Add Task route, title + description inputs, inline validation, save/cancel, stack navigation to and from the list.

**Out:** voice input, due-date picker (Phase 4 bonus), editing existing tasks.

## Files

| File | Responsibility |
| ---- | -------------- |
| `src/app/add-task.tsx` | Add Task screen (thin — form state local, persistence via `use-tasks`) |
| `src/app/_layout.tsx` | Root stack: list is initial route, `add-task` pushed on top |
| `src/app/index.tsx` | Wire the primary "Add Task" entry point to navigate to the route |
| `src/hooks/use-tasks.ts` | Reuse `addTask` from Phase 1 — no new persistence code |

Reuse shared primitives (primary button, text input, screen header) — extract to `src/components/ui/` if not already present.

## Navigation

- expo-router file-based routing (built on React Navigation) satisfies the "use React Navigation" requirement.
- List (`index`) is the initial route; `add-task` is pushed on top and dismissed on save or cancel.
- Back gesture / hardware back behaves like cancel (discards, does not save).

## Inputs & validation

| Field | Rules |
| ----- | ----- |
| Title | Required. Trimmed. Empty or whitespace-only blocks save and shows an inline error message. |
| Description | Optional. Multiline. Trimmed; empty stored as `undefined`, not `""`. |

- Validation is inline (message near the field), not a blocking modal.
- Save is disabled or no-ops until the title is valid; error appears on attempted save.

## Screen states

| State | Behavior |
| ----- | -------- |
| Empty form | Title focused (or clearly the first field); save inert until valid |
| Invalid | Inline error under title; task not saved; user stays on screen |
| Valid + save | Append via `use-tasks.addTask`, then navigate back to the list |
| Cancel | Discard input, navigate back, list unchanged |

## Acceptance criteria

- [ ] Tapping "Add Task" on the list navigates to the Add Task screen.
- [ ] Saving with a valid title appends to storage and returns to the list with the task visible.
- [ ] Empty/whitespace title is blocked with an inline message; nothing is saved.
- [ ] Description is optional; saving without one works.
- [ ] Cancel (and back gesture) discards input and returns to the list unchanged.
- [ ] Saved task persists across a full app restart.
- [ ] Runs on iOS, Android, and web with no console errors.
- [ ] `npm run lint` passes.

## Workflow

Follow [`../ai-interaction.md`](../ai-interaction.md): document in `context/current-feature.md`, branch `feature/phase-2`, implement only Phase 2, run and verify, do not commit without approval.
