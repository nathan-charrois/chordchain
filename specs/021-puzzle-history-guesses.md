# Spec 021 - Persist Puzzle Guesses In History

## Goal

Update puzzle history local storage so each puzzle can store the player's submitted guesses. When a puzzle is loaded, the game board should restore those guesses so incomplete puzzles can be resumed and won/lost puzzles can be viewed with their final board state.

## Why This Exists

Puzzle history currently records completion and failure metadata, but it does not persist the guesses that led to that state. Refreshing the page or selecting a historical puzzle can restore `won` or `loss`, but the board has no submitted rows to show. Incomplete puzzles also lose progress when the player leaves the puzzle. Persisting submitted guesses per puzzle date makes history state match the visible board and lets players continue unfinished daily puzzles.

## Current Implementation Review

### History storage

- `app/utils/puzzleHistory.ts` owns the local storage schema under `PUZZLE_HISTORY_STORAGE_KEY`.
- `PuzzleHistoryEntry` currently stores:
  - `completed`
  - `completedAt`
  - `failed`
  - `failedAt`
  - `attemptsUsed`
- `readPuzzleHistory` validates stored entries and rewrites malformed storage to a sanitized version.
- `markPuzzleCompleted` and `markPuzzleFailed` write terminal metadata, including `attemptsUsed`.

### Session state

- `app/components/Game/GameProvider.tsx` owns `guesses`, `current`, and `status`.
- Submitted guesses are created in `handleSubmitGuess` with `createSubmittedGuess(current.chords, target)`.
- `useStatus` derives `won` or `loss` from submitted guesses.
- Puzzle selection calls `resetSession(getStoredPuzzleStatus(date))`, which clears submitted guesses and current input.
- Completed or failed history entries currently hydrate only the status, not the submitted guess rows.

### Board rendering

- `app/components/Board/Board.tsx` renders rows from `buildGuessRows`.
- Submitted rows already render stored `Guess` data correctly when `guesses` is populated.
- The board does not need a special display path if provider state is rehydrated with valid guesses.

## Problem Statement

The history entry for a puzzle should contain enough submitted guess data to rebuild the board for that puzzle. The implementation needs to persist valid guesses as they are submitted, rehydrate them when the puzzle becomes active, and preserve existing end-state behavior for completed and failed puzzles.

The stored data must be validated because local storage can be missing, malformed, stale, or hand-edited. Invalid stored guesses should be ignored or sanitized without crashing gameplay.

## Scope

In scope:

- Add submitted guesses to each `PuzzleHistoryEntry`.
- Persist submitted guesses for the active puzzle as valid guesses are submitted.
- Rehydrate submitted guesses when loading today's puzzle, a selected historical puzzle, or a slug-loaded puzzle.
- Populate the board with restored guesses for incomplete, won, and lost puzzles.
- Preserve terminal history metadata for won/lost puzzles.
- Validate and sanitize stored guesses when reading local storage.
- Keep malformed storage from crashing the app.

Out of scope:

- Persisting the current unsubmitted chord row.
- Replaying won or lost puzzles.
- Editing, deleting, or manually repairing individual guesses from the UI.
- Remote sync, accounts, database storage, auth, deployment config, or CI changes.
- Changing puzzle routing behavior.
- Changing guess grading rules, max guesses, sequence length, target generation, or palette generation.
- New npm dependencies.

## Product Behavior

- When a player submits a guess, that submitted guess is saved to the active puzzle's history entry.
- If the player leaves an incomplete puzzle and later selects it again, the board shows the submitted guesses and the next row is active.
- If the player refreshes on a puzzle with saved guesses, the board shows those guesses after load.
- If saved guesses already include a winning guess, the puzzle loads in `won` state and shows the submitted guesses.
- If saved guesses fill all attempts without a win, the puzzle loads in `loss` state and shows the submitted guesses.
- Won and lost puzzles remain non-playable using existing game-over rules.
- Incomplete puzzles with saved guesses remain playable until they are won or lost.
- The history modal's `Attempts used` value should match the restored submitted guess count when guesses are available.

## Functional Requirements

### R1: Extend the history entry model

- Add an optional `guesses` field to `PuzzleHistoryEntry`.
- The field should store submitted guesses only, using the existing `Guess` shape:
  - `chords: string[]`
  - `status: GuessStatus[]`
- Do not store the current unsubmitted guess row.
- Existing history entries without `guesses` must remain valid.
- The store version may remain `1` if the parser treats `guesses` as an additive optional field; only bump the version if the implementation introduces an incompatible migration.

### R2: Validate stored guesses

- `readPuzzleHistory` must validate stored guess data before exposing it to the app.
- A valid stored guess must have:
  - `chords` as an array of strings.
  - `status` as an array containing only `absent`, `present`, or `correct`.
  - matching `chords.length` and `status.length`.
  - a chord count no greater than the current guess length limit.
- A history entry must store no more than the current maximum guess count.
- Invalid guesses should be dropped or cause the entry's `guesses` field to be omitted, but must not crash the app.
- Sanitized storage should continue to be written back through the existing cleanup path when practical.

### R3: Persist submitted guesses

- Submitting a valid guess should update local storage for `activePuzzle.date`.
- The persisted guesses should include the newly submitted guess in order.
- Persistence should happen for every valid submitted guess, not only when the puzzle reaches `won` or `loss`.
- Existing completion/failure writes must preserve the saved guesses for the same date.
- `attemptsUsed` should be derived from the saved submitted guess count when terminal state is recorded.

### R4: Rehydrate guesses on puzzle load

- Loading a puzzle should read that puzzle date's stored guesses and initialize provider `guesses` from them.
- This must apply to:
  - today's default puzzle.
  - history-selected puzzles.
  - route-slug-selected puzzles.
- Switching from one puzzle to another should replace the submitted guesses with the selected puzzle's stored guesses, not carry over the previous puzzle's guesses.
- If there are no valid stored guesses for the selected date, initialize with an empty submitted guess list.
- The current unsubmitted guess should always start empty after loading or switching puzzles.

### R5: Derive status from stored guesses and terminal metadata

- If the stored entry is completed, the puzzle should load as `won`.
- If the stored entry is failed, the puzzle should load as `loss`.
- If the stored entry is not terminal but restored guesses contain a winning row, the puzzle should resolve to `won` and history should be brought into alignment.
- If the stored entry is not terminal but restored guesses reach the maximum attempt count without a win, the puzzle should resolve to `loss` and history should be brought into alignment.
- If the stored entry is not terminal and restored guesses are below the attempt limit, the puzzle should load as `started` when at least one guess exists, otherwise `new`.
- Restored terminal puzzles must remain locked by existing game-over input rules.

### R6: Preserve grading correctness

- Stored guess statuses should be trusted only after validation, but the implementation may recompute statuses from stored chords and the active target during rehydration.
- Prefer recomputing statuses on load if it keeps persisted data resilient to future grading changes.
- If statuses are recomputed, local storage should be updated with the normalized guess rows.
- Restored guesses must render with the same per-chord feedback as guesses submitted in the current session.
- Palette button status should continue to derive from restored submitted guesses.

### R7: Keep history metadata consistent

- Completing a puzzle should store:
  - `completed: true`
  - `completedAt`
  - `failed: false`
  - `attemptsUsed`
  - `guesses`
- Failing a puzzle should store:
  - `completed: false`
  - `failed: true`
  - `failedAt`
  - `attemptsUsed`
  - `guesses`
- Saving a non-terminal submitted guess should preserve any existing non-conflicting metadata for that date.
- Existing completed entries must not be downgraded by later persistence effects.
- Existing failed entries must not be cleared unless the player uses an explicit reset/debug flow that already removes the entry.

### R8: Reset behavior

- The normal reset action should reload the active puzzle from stored history, including saved guesses.
- The existing `resetToday`/debug removal flow should remove the active puzzle history entry and clear restored guesses for that puzzle.
- Resetting one puzzle must not remove guesses from another puzzle date.
- Historical view-only completed or failed puzzles must not become replayable because guesses were restored.

### R9: Storage safety

- Missing local storage must continue to produce an empty history store.
- Malformed local storage must continue to be sanitized without throwing.
- Unknown extra fields in entries should not break parsing.
- If local storage writes fail, gameplay should continue in memory as it does today.
- Server-side rendering must keep returning the empty store when `window` is unavailable.

## UX/Behavior Expectations

- Restored incomplete puzzles feel like paused games: previous submitted rows are visible and the next row is ready.
- Restored won and lost puzzles show the final board state immediately.
- The board should not flicker from empty rows to restored rows after a selected puzzle is loaded.
- History remains easy to scan and does not need to display every saved guess.
- Attempts metadata should not contradict the number of visible restored submitted rows.

## Technical Constraints

- Preserve the existing provider/context architecture.
- No new npm dependencies.
- Do not change routing, database schema, auth, deployment config, or CI.
- Keep changes focused to history storage utilities, game provider/session initialization, and focused tests if practical.
- Prefer existing `Guess`, `GuessStatus`, `createSubmittedGuess`, and status helpers over duplicate models.
- Use only scripts already defined in `package.json`.

## Suggested Implementation Notes

- Add a helper in `puzzleHistory.ts` such as `savePuzzleGuesses(store, date, guesses)` that upserts a non-terminal entry with persisted guesses.
- Consider adding validation helpers in `puzzleHistory.ts`:
  - `isValidStoredGuess`
  - `sanitizeStoredGuesses`
- Keep type-only imports from game context out of runtime utility code if needed to avoid cycles.
- In `GameProvider`, add a small function that derives a session state for a puzzle date from:
  - stored history entry.
  - active target.
  - max guesses.
- Recompute restored guesses with `createSubmittedGuess(storedGuess.chords, target)` so status data is normalized against the active puzzle.
- Replace `resetSession(getStoredPuzzleStatus(date))` with a load helper that sets status, submitted guesses, and an empty current guess together.
- Be careful with effects that mark completion/failure: after rehydration, they should not repeatedly rewrite terminal metadata unless the normalized stored state actually changed.
- If circular imports become a concern, move shared serializable guess types or validation helpers to a narrow module rather than broadening component imports.

## Acceptance Criteria

1. `PuzzleHistoryEntry` can store submitted guesses for a puzzle date.
2. Existing local storage entries without guesses remain valid.
3. Invalid stored guess payloads are sanitized without crashing the app.
4. Submitting a valid guess persists that guess for `activePuzzle.date`.
5. Refreshing a puzzle with saved non-terminal guesses restores those submitted rows.
6. Selecting a historical incomplete puzzle restores that puzzle's submitted rows and allows play to continue.
7. Switching puzzles replaces restored guesses with the newly selected puzzle's saved guesses or an empty list.
8. Won puzzles load in `won` state and show the submitted guesses used to win.
9. Lost puzzles load in `loss` state and show the submitted guesses used before failure.
10. Restored won/lost puzzles remain locked by existing input rules.
11. `Attempts used` remains consistent with saved/restored submitted guesses for terminal entries.
12. The existing reset/debug entry removal flow clears restored guesses for the active puzzle.
13. Existing history completion, failure, streak, routing, palette, grading, and playback behavior are otherwise unchanged.
14. Typecheck passes.
15. Build passes.

## Test Requirements

Add or update tests where practical for:

- Parsing history entries with valid guesses.
- Sanitizing malformed guesses, invalid statuses, mismatched chord/status lengths, and too many guesses.
- Saving submitted guesses without marking the puzzle complete or failed.
- Preserving guesses when marking a puzzle completed.
- Preserving guesses when marking a puzzle failed.
- Rehydrating incomplete puzzle guesses into provider state.
- Rehydrating completed puzzle guesses into `won` state.
- Rehydrating failed puzzle guesses into `loss` state.
- Switching selected puzzle dates without carrying guesses across dates.

If full provider or UI tests are not available in the project, add focused utility tests if a test harness exists, and document remaining manual verification gaps.

## Manual Verification

Verify at least these flows:

1. Submit one incorrect guess on today's puzzle, refresh, and confirm the same submitted row is visible and the next row is active.
2. Select another historical incomplete puzzle, submit a guess, switch away, switch back, and confirm only that puzzle's guesses are restored.
3. Win a puzzle, refresh or reselect it from history, and confirm the winning board is visible and input remains blocked.
4. Lose a puzzle, refresh or reselect it from history, and confirm all submitted rows are visible and input remains blocked.
5. Corrupt the stored `guesses` payload manually, reload, and confirm the app sanitizes history instead of crashing.

## Definition of Done

- Acceptance criteria satisfied.
- No unrelated refactors.
- `npm run typecheck` passes.
- `npm run build` passes.
- Added tests pass, or the absence of a suitable test harness is documented.
- Manual verification notes are included in the PR summary.
- The final diff is small enough for human review.

## Deliverable for Implementation Task

Produce a focused PR-sized diff that persists submitted guesses per puzzle date in local storage, restores those guesses when puzzles load, allows incomplete puzzles to resume, and shows final submitted boards for won and lost puzzles.
