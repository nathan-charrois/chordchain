# Spec 015 — Play Incomplete History Puzzles

## Goal

Allow players to select previous puzzles from the puzzle history modal, play incomplete puzzles, and view completed puzzles without replaying them.

## Why This Exists

The daily puzzle history currently communicates completion state but does not let players recover missed or unfinished days or inspect completed days. Players should be able to continue incomplete prior daily puzzles and view completed prior puzzles without undermining the one-completion-per-puzzle rule.

## Scope

In scope:

- Selecting a prior puzzle from the history modal.
- Loading the selected puzzle as the active playable puzzle.
- Recording completion against the selected puzzle's original date.
- Loading completed puzzles as view-only completed state.
- Making selected historical puzzle state visible in the board UI.

Out of scope:

- Replaying completed puzzles.
- Editing or deleting history entries.
- Remote puzzle sync, accounts, or entitlement checks.
- New puzzle catalog generation.
- Route, auth, database, deployment, or CI changes.
- New npm dependencies.

## Product Behavior

- Today remains the default active puzzle on initial page load.
- The history modal lists previous catalog dates and completion state.
- Previous puzzles are selectable from the history modal.
- Selecting a previous puzzle closes the modal and loads that day's puzzle.
- Completing a selected historical puzzle marks that historical date complete.
- Completed puzzles are selectable for viewing and load in completed state.
- Attempting to interact with a completed selected puzzle must not reset or replay it.
- The board clearly indicates when the player is playing a historical puzzle rather than today's puzzle.

## Functional Requirements

### R1: Active puzzle date selection

- Add provider-level state for the currently selected puzzle date.
- Initialize selected puzzle date to today's local date.
- Resolve `activePuzzle` from selected puzzle date, not always today's date.
- Keep `todayDate` available separately for labels, streak calculation, and catalog filtering.
- Changing selected puzzle date must reset transient gameplay state for the newly selected puzzle.

### R2: History modal selectable rows

- Incomplete rows should expose an obvious action such as `Play` or make the row button-like.
- Completed rows should expose an obvious view action such as `View`.
- The currently selected row should be visibly identified and should not trigger a no-op reselection.
- Today may remain listed, but selecting it should behave consistently with selecting any incomplete puzzle.

### R3: Completed puzzle view state

- Completed puzzles can be selected from history for viewing.
- Completed selected puzzles must load in completed/won state.
- Completed selected puzzles must keep guess-entry controls blocked by existing completed-state rules.
- Completed selected puzzle targets should be visible enough for the player to inspect what was completed.
- Completed-state view must use persisted history completion state, not only in-memory game status.

### R4: Historical puzzle gameplay

- Gameplay target, key, mode, hints, guesses, win/loss status, and completion writes must be based on `activePuzzle.date`.
- Completing a historical puzzle writes completion to that historical date's history entry.
- Hints used on a historical puzzle must read and write against that historical date.
- Reset/play-again behavior must not replay completed puzzles or clear completed history unless using existing explicit reset tooling.

### R5: Board and history context labels

- Board UI should distinguish:
  - today's puzzle.
  - selected historical puzzle.
- Minimum historical label content:
  - selected puzzle date.
  - indication such as `Playing previous puzzle`.
- History modal should identify the currently active selected puzzle date.
- Streak display should continue to represent current streak from today, not from the selected historical puzzle date.

### R6: Date catalog boundaries

- History selection should only include catalog dates available up to today.
- Future catalog dates must not be selectable.
- Missing-date fallback behavior in `resolveDailyPuzzle` should remain deterministic, but history modal selection should prefer explicit catalog dates.

### R7: State safety and persistence

- Malformed or missing local storage history must not crash selection or gameplay.
- Selected historical puzzle state does not need to persist across page refresh unless explicitly chosen during implementation.
- On refresh, default behavior should return to today's puzzle unless selected-date persistence is intentionally added and documented.

## UX/Behavior Expectations

- The history modal remains easy to scan on mobile and desktop.
- Incomplete historical puzzles feel like playable make-up puzzles.
- Completed historical puzzles clearly look viewable rather than replayable.
- Completion updates are reflected in the modal without page reload.
- Switching puzzles should not carry over guesses or current chord entry from the previously active puzzle.

## Technical Constraints

- Preserve existing provider/context architecture.
- Reuse `dailyPuzzle.ts` and `puzzleHistory.ts` utilities where possible.
- No new npm dependencies.
- Keep the diff focused to game provider state, context shape, board/history modal UI, and tests.
- Do not change routing, database schema, auth, deployment config, or CI.

## Acceptance Criteria

1. Today remains the default active puzzle on initial load.
2. History modal lets the player choose an incomplete previous catalog puzzle.
3. Selecting an incomplete previous puzzle loads that day's target/key/mode for gameplay.
4. Selecting a different puzzle clears transient guesses/current input for the newly selected puzzle.
5. Winning a selected historical puzzle marks that historical date complete in local storage.
6. Completed puzzles in history can be selected for viewing.
7. Completed selected puzzles load as completed and cannot be replayed.
8. History modal identifies both completed state and the currently selected puzzle.
9. Board UI identifies when the active puzzle is a previous puzzle.
10. Streak calculation remains based on today's date and existing history rules.
11. Malformed/missing history does not crash app and defaults safely.
12. Typecheck and build pass.


## Definition of Done

- Acceptance criteria satisfied.
- No unrelated refactors.
- `npm run typecheck` passes.
- `npm run build` passes.
- Added tests pass, or blockers are documented with evidence.
- Completed-puzzle view-only state is verified from persisted history state.

## Deliverable for Implementation Task

Produce a focused PR-sized diff that lets players launch incomplete prior daily puzzles and view completed prior puzzles from the history modal while recording completion against the selected puzzle's original date.
