# Phase 3 — Voice Input via FAB

> Third shippable slice. Adds a floating action button that turns spoken input into one or more tasks. See [`todo-app-spec-index.md`](./todo-app-spec-index.md) for phase order and shared conventions.

## Goal

On the Task List screen, a bold, always-reachable FAB drives a **listen → transcribe → split → add** pipeline. Speaking "buy provisions and call mom" adds two tasks; speaking a single task adds one. Permission denial and transcription failure are handled gracefully and add nothing.

## Scope

**In:** voice FAB, listening/processing/error overlay, mic permission, audio capture, transcription API call, natural-language splitting, adding each parsed task.

**Out:** editing transcribed text before saving, on-device/offline transcription, multi-language handling.

## Files

| File | Responsibility |
| ---- | -------------- |
| `src/components/voice/voice-fab.tsx` | The FAB affordance floating above the list |
| `src/components/voice/listening-overlay.tsx` | Listening / processing / error visual states |
| `src/lib/voice/transcribe.ts` | Send recording to the speech-to-text API, return text |
| `src/lib/voice/split-tasks.ts` | Split natural language into discrete task titles |
| `src/hooks/use-tasks.ts` | Reuse `addTask` to append each parsed task |
| `src/app/index.tsx` | Mount the FAB + overlay on the list screen |

Add dependency: `expo-audio` (SDK 57 audio API — **not** `expo-av`). Confirm the API against <https://docs.expo.dev/versions/v57.0.0/>.

## Pipeline

1. **Activate** — tap FAB → enter listening mode (visible recording state).
2. **Permission** — request microphone permission first; handle denial gracefully.
3. **Capture** — record audio with `expo-audio`.
4. **Transcribe** — POST recording to the speech-to-text API (OpenAI or equivalent), receive text.
5. **Split** — parse into discrete tasks: handle conjunctions ("and", "then"), commas; trim filler; single-task input returns one item.
6. **Add** — append each parsed task via `use-tasks.addTask`; refresh the list.

## Splitting rules (`split-tasks.ts`)

- Input: raw transcript string. Output: `string[]` of trimmed, non-empty titles.
- "buy provisions and call mom" → `["Buy provisions", "Call mom"]`.
- Split on conjunctions/commas; drop leading filler ("um", "okay", "please"); collapse whitespace.
- Never return empty strings; a single task in → single task out.
- Pure and dependency-free so it is unit-testable in Phase 4.

## Overlay states

| State | Behavior |
| ----- | -------- |
| Idle | FAB visible on the list |
| Listening | Overlay shows active recording indicator; user can stop |
| Processing | Transcribing/splitting indicator; FAB disabled |
| Permission denied | Friendly message explaining mic access is needed; no crash |
| Error / empty | Transcription failed or returned empty → friendly error, **add nothing** |
| Success | Overlay dismisses; new task(s) appear in the list |

## Secrets

- The API key must **never** be committed. Read it from env / Expo config (e.g. `app.config` extra or `EXPO_PUBLIC_*`).
- Document the key setup in the README (aligns with the Phase 4 / submission checklist).

## Acceptance criteria

- [ ] Single-task dictation adds exactly one task.
- [ ] Multi-task dictation ("buy provisions and call mom") adds separate tasks.
- [ ] Denied microphone permission is handled with a clear message; no crash.
- [ ] Failed or empty transcription shows a friendly error and adds nothing.
- [ ] API key is read from config/env and is not present in source control.
- [ ] Added voice tasks persist across a full app restart.
- [ ] Runs on iOS, Android, and web with no console errors (web may degrade gracefully if mic unsupported).
- [ ] `npm run lint` passes.

## Workflow

Follow [`../ai-interaction.md`](../ai-interaction.md): document in `context/current-feature.md`, branch `feature/phase-3`, implement only Phase 3, run and verify, do not commit without approval.
