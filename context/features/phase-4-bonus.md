# Phase 4 — Bonus (optional)

> Optional final slice. Each bonus is **additive** and must not regress the core flow (Phases 1–3). See [`todo-app-spec-index.md`](./todo-app-spec-index.md) for phase order and shared conventions.

## Goal

Extend the working app with advanced-skill features — due dates + sorting, search/filter, a theme toggle, unit tests, and animations — picking any subset. None are required for a passing submission; they are evaluated as extra credit for innovation, testing, and polish.

## Scope

**In (choose any):** due dates + sorting, search/filter, light/dark toggle, unit tests, add/remove/check animations.

**Out:** anything in [Out of Scope](../project-overview.md#out-of-scope) — backend, auth, sync, sharing, reminders infrastructure, screens beyond the two required.

## Bonus items

### Due dates + sorting

- Use the existing `Task.dueDate?: number` (epoch ms) field — no model change needed.
- Add a due-date picker to the Add Task screen (Phase 2).
- Sort the list by due date; surface due-soon state with `theme.warning`.

### Search / filter

- Filter the list by title/description text and/or by completed state.
- Keep it on the list screen; no new route.

### Light / dark theme toggle

- Reuse the existing `use-theme` / `use-color-scheme` hooks and `src/constants/theme.ts` tokens.
- All colors already come from the theme, so this should be a toggle, not a refactor.

### Unit tests

- Best targets: `src/lib/voice/split-tasks.ts` (pure, high value) and `src/lib/storage/tasks-storage.ts`.
- Tooling: Jest + React Native Testing Library (confirm SDK 57 compatibility against <https://docs.expo.dev/versions/v57.0.0/>).
- Cover: splitter edge cases (single task, conjunctions, commas, filler, empty); storage round-trip and corrupt-data fallback.

### Animations / transitions

- Task add/remove and check transitions; respect reduced-motion.

## Acceptance criteria

- [ ] Each implemented bonus works and is additive.
- [ ] No regression to add / toggle / delete / persist / voice flows.
- [ ] Any added tests pass; splitter and storage are covered if tests are attempted.
- [ ] Theme toggle (if implemented) switches light/dark with no hardcoded colors.
- [ ] Runs on iOS, Android, and web with no console errors.
- [ ] `npm run lint` passes.

## Submission checklist (exercise deliverables)

- [ ] README with run instructions and API-key setup, screenshots embedded.
- [ ] `/screenshots` folder: empty list, mixed completed/incomplete, Add Task, voice listening + resulting tasks, any bonus feature.
- [ ] Optional short GIF/MP4 of the voice flow (in addition to screenshots).

## Workflow

Follow [`../ai-interaction.md`](../ai-interaction.md): document in `context/current-feature.md`, branch `feature/phase-4`, implement only the chosen bonuses, run and verify, do not commit without approval.
