# Current Feature

Status: Complete

## Phase 4 — Bonus

Spec: `context/features/phase-4-bonus.md`
Feature breakdown: `context/features/todo-app-spec-index.md`
Branch: `feature/phase-4`

### Scope

Final, additive slice. Every item is extra credit and must not regress the core
add / toggle / delete / persist / voice flows. Implementing the **full** bonus set:

1. **Due dates + sorting** — a cross-platform, chip-based due-date picker on the Add
   Task screen (Today / Tomorrow / This weekend / Next week / clear), stored in the
   existing `Task.dueDate` field. The list sorts dated tasks first (soonest due at
   the top), then undated by newest. Each row shows a due badge whose color reflects
   status: `danger` for overdue, `warning` for due soon (today/tomorrow), muted otherwise.
2. **Search / filter** — a filter bar on the list screen: a search box (matches title
   and description) plus All / Active / Done chips. No new route; a distinct
   "no matches" empty state when a query hides everything.
3. **Light / dark theme toggle** — a `ThemePreferenceProvider` holding a persisted
   `light | dark | system` preference; a header toggle cycles the three. All colors
   already flow from the theme, so this is a resolver + toggle, not a restyle.
4. **Unit tests** — Jest (`jest-expo` preset) covering the two highest-value pure
   modules: `lib/voice/split-tasks.ts` (single/multi/filler/commas/"then"/empty) and
   `lib/storage/tasks-storage.ts` (round-trip, corrupt-data fallback, field coercion).
5. **Animations** — reanimated row enter + layout (reorder) transitions and an animated
   completion check, all gated by the OS reduced-motion setting.

- New: `hooks/use-theme-preference.tsx`, `lib/dates.ts`, `components/ui/due-date-picker.tsx`,
  `components/ui/theme-toggle.tsx`, `components/tasks/task-filter-bar.tsx`,
  `hooks/use-visible-tasks.ts`, tests under `__tests__/`.
- Changed: `constants/theme.ts` (+`warning` token), `hooks/use-theme-color.ts` &
  `task-toggle.tsx` (resolve via preference), `app/_layout.tsx` (wrap provider),
  `app/add-task.tsx` (due-date field), `app/index.tsx` (filter bar + sorting),
  `hooks/use-tasks.tsx` (`addTask` accepts `dueDate`), `components/tasks/task-row.tsx`
  (due badge + enter/layout animation), `components/ui/icon-symbol.tsx` (+ mappings).
- Dev deps added: `jest-expo`, `jest`, `@types/jest`; `test` script; jest config.

> **SDK note:** SDK 54 throughout. Animations use the already-installed
> `react-native-reanimated` (~4.1.1, `useReducedMotion`, `FadeInDown`, `LinearTransition`);
> tests use `jest-expo`. The due-date picker is a cross-platform chip control (works in the
> web preview) rather than a native-only `DateTimePicker`, so no web-breaking dependency.

### Out of scope (this phase)

- Editing existing tasks; recurring/repeat tasks; reminders/notifications infrastructure
- A full calendar date picker; multi-field sort UI; per-list themes; screens beyond the two required

### Verification

- [x] Due date: picker sets `dueDate`; list sorts soonest-first; "Due today" amber
      badge shows — verified on web. (Weekend edge case fixed: a "This weekend"
      chip that collapses onto "Today" is deduped away.)
- [x] Search/filter: text search + All/Active/Done narrow the list; a distinct
      "No matching tasks" state appears — verified on web
- [x] Theme toggle: cycles light → dark → system and re-themes the whole app
      (chrome included) — verified light↔dark on web; choice persisted via its own
      AsyncStorage key. No hardcoded colors (all via theme tokens).
- [x] Tests: `npm test` green — 21 tests across splitter, due-date helpers, storage
- [x] Animations: reanimated row enter/reorder + animated check, gated by
      `useReducedMotion`; no regression to add/toggle/delete/persist/voice — verified on web
- [x] Runs with no console errors; `npm run lint` passes and `npx tsc --noEmit` is clean

---

## History

- **Phase 1 — Task List + Persistence** (complete, branch `feature/phase-1`): `Task` model, AsyncStorage storage module, `use-tasks` hook, Task List screen with rows, toggle, delete, and empty state.
- **Phase 2 — Add Task Screen** (complete, branch `feature/phase-2`): dedicated validated Add Task route, shared `TasksProvider`, reusable `PrimaryButton`/`TextField`, list entry point wired to navigation.
- **Phase 3 — Voice Input via FAB** (complete, branch `feature/phase-3`): voice FAB, listening/processing/denied/error overlay, `expo-audio` capture, OpenAI transcription, pure natural-language splitter, each task appended via `useTasks`. API key read from env, never committed.
