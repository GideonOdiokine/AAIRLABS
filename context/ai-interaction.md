# AI Interaction Guidelines

## Communication

- Be concise and direct
- Explain non-obvious decisions briefly
- Ask before large refactors, architecture changes, or scope changes
- Do not add features that are not in the exercise spec (see `context/project-overview.md`)
- Never delete files without clarification
- Flag tradeoffs clearly when a decision affects UX, structure, or maintainability

## Expo First

- This is **Expo SDK 57**. Before writing or changing app code, read the exact versioned docs at <https://docs.expo.dev/versions/v57.0.0/>.
- Verify package versions with `npx expo install`, not hand-picked npm versions.
- Do not assume APIs from older SDKs (`expo-av`, classic React Navigation wiring) still apply.

## Workflow

Default workflow for features and fixes on the AAIRLABS to-do app:

1. **Document** — write the task in `context/current-feature.md`
2. **Review Scope** — confirm it matches the exercise spec in `context/project-overview.md` and does not drift beyond the two-screen to-do app
3. **Branch** — create a new branch for the feature or fix
4. **Implement** — build only what is defined in `context/current-feature.md`
5. **Verify** — run the app (iOS / Android / web) and check the relevant screen
6. **Test** — run `npm run lint` and any unit tests; confirm the app still starts
7. **Iterate** — fix issues, refine behavior, re-run checks
8. **Review** — review AI-generated code for logic, UX consistency, and codebase fit
9. **Commit** — commit only after approval and only when checks pass
10. **Mark Complete** — mark the task complete in `context/current-feature.md` and record it in history

Do **not** commit without permission.

Do **not** commit if the app fails to start or relevant checks are failing.

For frontend-only tasks, prioritize:

- matching the exercise spec in `context/project-overview.md`
- preserving the agreed folder structure
- keeping the UI simple, clean, and accessible

## Branching

- Create a new branch for every feature or fix
- Use names like:
  - `feature/task-list-screen`
  - `feature/add-task-screen`
  - `feature/voice-fab`
  - `fix/asyncstorage-hydration`
- Ask before deleting a branch after merge

## Commits

- Ask before committing
- Use conventional commit messages such as:
  - `feat: add task completion toggle`
  - `feat: persist tasks with AsyncStorage`
  - `fix: block saving empty task title`
  - `chore: extract task-splitting helper`
- Keep commits focused
- Never use AI branding in commit messages

## When Stuck

- If something is not working after 2–3 solid attempts, stop and explain the issue
- Do not keep trying random fixes
- Ask for clarification if the requirement is unclear
- Offer the smallest useful set of next options instead of leaving the problem vague

## Code Changes

- Make minimal changes to accomplish the task
- Do not refactor unrelated code unless asked
- Do not add "nice to have" features outside scope (bonus items only when requested)
- Preserve existing patterns (themed components, theme hooks, expo-router structure)
- Prefer simple, readable solutions over clever abstractions

## Code Review

Review AI-generated code periodically, especially for:

- input validation (empty title, malformed voice input)
- persistence correctness (hydration, writes on every mutation)
- permission and error handling (microphone, transcription failures)
- logic and edge cases (empty list, single vs multi-task dictation)
- consistency with the coding standards and exercise spec

## Secrets

- The speech-to-text API key must never be committed or logged
- Read it from environment / Expo config; keep the value in an untracked file
- Document setup in the README without a real key

## AAIRLABS-Specific Rules

- Do not let implementation drift beyond the agreed flow:
  - Task List screen
  - Add Task screen
  - complete / delete
  - local persistence
  - voice input via FAB
- Keep the task list the hero and chrome minimal
- Preserve clear visual distinction between completed and incomplete tasks
- Follow the agreed folder structure and coding standards
- Remember the submission needs a README with run instructions and a `/screenshots` folder
