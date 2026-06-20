# Spec 023 — User Stats and Stats Modal

## Goal

Add a user statistics view that summarizes local puzzle history and renders it in a modal launched from a new `Stats` button in the header.

The initial statistics are:

- games played;
- games won;
- win rate;
- current streak;
- last played date.

## Why This Exists

ChordChain already persists puzzle outcomes and submitted guesses in local storage, and it derives the current streak from that history. The app does not yet summarize that data for the player.

A dedicated Stats modal gives the player a compact view of their overall results without adding another page or changing the gameplay flow. Statistics should remain deterministic projections of puzzle history so they cannot drift from the stored wins, losses, guesses, and activity timestamps.

## Current Implementation Review

### Puzzle history

- `app/utils/puzzleHistory.ts` owns the versioned local-storage schema.
- `PuzzleHistoryEntry` stores completion, failure, attempts, and submitted guesses.
- A completed entry represents a win.
- A failed entry represents a loss.
- An entry with guesses but no terminal outcome represents an in-progress puzzle.
- `calculateCurrentStreak` already derives the current streak from date-keyed history entries.
- Completed and failed entries have outcome timestamps, but in-progress entries do not record when they were last played.

### Game context

- `GameProvider` owns the in-memory history store and exposes `historyEntries`.
- `GameProvider` derives and exposes `currentStreak`.
- History updates already cause context consumers to rerender without a page refresh.

### Header modal pattern

- `History.tsx` owns local modal open/close state.
- It uses the shared `Icon` component as the trigger and a centered Mantine `Modal`.
- `Header.tsx` mounts header tools inside individual `Card` components in its right-side `Group`.

## Problem Statement

User statistics must have one unambiguous definition and must update from the same history state used by gameplay and the History modal.

Persisting aggregate counters such as total games, wins, or win rate would duplicate information already present in puzzle history and could produce conflicting values after a reset or storage sanitization. The aggregate statistics must therefore be derived.

The existing schema cannot accurately identify the latest gameplay activity for an in-progress puzzle. Outcome timestamps cover wins and losses, but a submitted guess on an unfinished puzzle has no corresponding activity timestamp. Add a focused per-entry activity timestamp rather than a separate global stats store.

## Scope

In scope:

- Add a pure user-stats calculation based on puzzle history.
- Define games played, games won, win rate, current streak, and last played date.
- Record the latest valid gameplay activity on each history entry.
- Render the statistics in a new Stats modal.
- Launch the modal from a new `Stats` button in `Header`.
- Update the modal immediately when history changes.
- Handle empty, malformed, and partially populated history safely.

Out of scope:

- Accounts, remote persistence, cross-device sync, or leaderboards.
- Achievements, streak rewards, sharing, or social comparisons.
- Charts, trend lines, difficulty breakdowns, or per-mode statistics.
- Changing puzzle rules, grading, routing, the History modal, or the calendar.
- Resetting or editing history from the Stats modal.
- New npm dependencies.

## Required Data Model

### History activity timestamp

Extend `PuzzleHistoryEntry` with one optional field:

```ts
type PuzzleHistoryEntry = {
  completed: boolean
  completedAt?: string
  failed?: boolean
  failedAt?: string
  attemptsUsed?: number
  guesses?: PuzzleHistoryGuess[]
  lastPlayedAt?: string
}
```

`lastPlayedAt` is an ISO 8601 timestamp representing the most recent user gameplay action recorded for that puzzle.

It is entry metadata, not an aggregate statistic.

### Derived user stats

Add a serializable result type equivalent to:

```ts
type UserStats = {
  gamesPlayed: number
  gamesWon: number
  winRate: number
  currentStreak: number
  lastPlayedAt?: string
}
```

`UserStats` is derived at runtime. It must not be written to local storage or added as a second source of truth in provider state.

## Statistic Definitions

### Games won

- Count entries where `completed === true`.
- A completed entry must count as a win even if malformed legacy data also contains `failed === true`; sanitization should continue to normalize contradictory terminal state where practical.

### Games lost

- A loss is an entry where `failed === true` and `completed !== true`.
- Losses are needed to calculate games played and win rate but do not need to be displayed as a separate initial statistic.

### Games played

- `gamesPlayed = gamesWon + gamesLost`.
- In-progress entries do not count as games played because they do not yet have a final result.
- An entry must never count as both a win and a loss.

### Win rate

- `winRate = gamesWon / gamesPlayed * 100`.
- Return a whole-number percentage rounded to the nearest integer.
- If `gamesPlayed` is `0`, return `0`.
- In-progress entries are excluded from both numerator and denominator.
- Display the value with a percent sign, for example `75%`.

### Current streak

- Reuse the existing current-streak definition and implementation.
- The Stats modal should consume `currentStreak` from game context rather than introducing a competing streak calculation.

### Last played

- Select the latest valid `lastPlayedAt` timestamp across all history entries.
- Compare timestamps chronologically, not lexicographically.
- Invalid timestamp strings must be ignored.
- For an existing terminal entry without `lastPlayedAt`, use its valid `completedAt` or `failedAt` as a fallback candidate.
- For an existing in-progress entry without `lastPlayedAt`, use its puzzle date as a final compatibility fallback.
- The fallback puzzle date represents that puzzle's local calendar date and should be converted deterministically for comparison without introducing a UTC date shift.
- Return `undefined` when there is no played or in-progress history.
- Display the selected value using the existing date formatting utilities.
- The initial modal displays a calendar date only; it does not need to display the time of day.

## Functional Requirements

### R1: Add a pure stats calculator

- Add a pure utility equivalent to:

```ts
calculateUserStats(
  entries: Record<string, PuzzleHistoryEntry> | null | undefined,
  currentStreak: number,
): UserStats
```

- Keep the calculator in `app/utils/puzzleHistory.ts` or a narrowly scoped history-stats utility.
- Derive aggregate values from entries on every calculation.
- Do not mutate the input entries.
- Do not read from or write to local storage inside the calculator.
- Missing or invalid input must return zero counts, a zero win rate, the supplied valid streak or `0`, and no last-played timestamp.

### R2: Record gameplay activity

- Set `lastPlayedAt` when a valid submitted guess changes the stored guesses for a puzzle.
- Use the time of the user action, not the puzzle's authored date.
- Winning and losing writes must preserve the activity timestamp from the guess that produced the terminal result.
- If a terminal write occurs without a preceding guess timestamp, use the terminal action time.
- Rehydrating a session, opening a modal, switching puzzles, refreshing the page, or sanitizing storage must not advance `lastPlayedAt`.
- An ignored or invalid submit action must not advance `lastPlayedAt`.
- Updating one puzzle must not change another puzzle's timestamp.

### R3: Preserve storage safety

- Treat `lastPlayedAt` as an additive optional field.
- Existing version `2` history entries without the field must remain readable.
- Validate `lastPlayedAt` as a parseable ISO timestamp string during sanitization.
- Invalid `lastPlayedAt` values should be omitted without crashing the app.
- Do not bump the storage version solely for this optional field.
- Existing completion, failure, guesses, attempts, and reset behavior must remain unchanged.
- Removing a puzzle history entry must also remove its contribution to every derived statistic.

### R4: Create the Stats component

- Add a focused component at `app/components/Stats/Stats.tsx`.
- Follow the existing `History.tsx` interaction pattern:
  - local `isOpen` state;
  - shared `Icon` trigger;
  - centered Mantine `Modal`;
  - close on Escape;
  - no route changes.
- Use the exact trigger label `Stats`.
- Use the exact modal title `User Stats`.
- Use a suitable statistics/chart icon already available from `@hugeicons/core-free-icons`.
- Do not add a dependency for the icon or modal.

### R5: Derive stats in the modal component

- Read `historyEntries` and `currentStreak` through `useGame()`.
- Derive `UserStats` with `useMemo` or an equivalently focused calculation.
- Do not add aggregate user stats to `GameContext` or `GameProvider`.
- The modal must reflect history changes in the current session without requiring a refresh or reopen.

### R6: Render the initial stats

- Render these labels and values:
  - `Games Played`
  - `Games Won`
  - `Win Rate`
  - `Current Streak`
  - `Last Played`
- Display counts as non-negative integers.
- Display win rate as a whole-number percentage.
- Display current streak as a day count, using singular/plural copy where the layout includes a unit.
- Display last played as a readable calendar date using `formatDisplayDate` or an equivalent existing formatter.
- When no last-played value exists, display `Never`.
- Keep the layout readable on desktop and mobile.
- Prefer existing Mantine layout and typography components over custom CSS.
- The modal must not list individual history entries; that remains the responsibility of the History modal.

### R7: Mount Stats in the Header

- Import and render `Stats` in `app/components/Header/Header.tsx`.
- Wrap it in the same `Card` pattern used by the existing header tools.
- Place the Stats button in the existing right-side header tool group.
- Preserve the current History and About buttons and their behavior.
- Keep the header responsive after adding the third tool.

### R8: Keep reset and live updates consistent

- A submitted guess should update `Last Played` immediately.
- A completed puzzle should update games played, games won, win rate, current streak, and last played immediately.
- A failed puzzle should update games played, win rate, and last played immediately.
- Removing/resetting an entry should immediately remove that entry from all derived values.
- Refreshing the page should reproduce the same statistics from persisted history.
- Opening the Stats modal must not itself alter any statistic.

## UX and Accessibility Expectations

- The trigger must retain the shared `Icon` component's accessible label behavior.
- Every statistic must have a visible text label; meaning must not depend on an icon or color alone.
- Values should be easy to scan without looking like editable controls.
- The empty state must remain useful: zero values are shown and `Last Played` displays `Never`.
- Modal focus management, overlay behavior, Escape handling, and close controls should come from Mantine's existing `Modal`.

## Technical Constraints

- Preserve `GameProvider` as the owner of history state and existing game context wiring.
- Keep aggregate stats derived rather than persisted.
- Reuse `calculateCurrentStreak`; do not create a second streak rule.
- Reuse existing date formatting utilities.
- Follow the existing Header/Card/Icon/Modal component patterns.
- Do not change routing, database schema, auth, deployment config, or CI.
- Do not introduce new dependencies.
- Keep the implementation PR-sized and avoid unrelated refactors.
- Use only scripts defined in `package.json`.

## Suggested Files To Change

- `app/utils/puzzleHistory.ts`
- `app/components/Stats/Stats.tsx`
- `app/components/Header/Header.tsx`
- focused tests, if a test harness is added or already available

Changes to `GameProvider` or `GameContext` should not be necessary because the Stats component can consume the existing `historyEntries` and `currentStreak` values.

## Suggested Implementation Notes

- Keep the stats calculator independent from React so its boundary cases can be tested directly.
- Consider a small helper that resolves an entry's last-played candidate in this order:
  1. valid `lastPlayedAt`;
  2. valid terminal outcome timestamp;
  3. date key when the entry has submitted guesses or a terminal outcome.
- Pass a single action timestamp through guess persistence and terminal persistence when one submission causes a win or loss. This avoids tiny timestamp differences for the same action.
- Keep `lastPlayedAt` stable when persistence receives guesses equal to those already stored.
- A compact grid or grouped cards inside the modal is sufficient; charts are intentionally out of scope.

## Acceptance Criteria

1. A new `Stats` button is visible in the Header alongside the existing header tools.
2. Activating the button opens a centered modal titled `User Stats`.
3. The modal displays Games Played, Games Won, Win Rate, Current Streak, and Last Played.
4. Games Played counts only terminal wins and losses.
5. Games Won counts completed entries.
6. Win Rate is wins divided by terminal games, rounded to a whole-number percentage.
7. With no terminal games, Win Rate displays `0%`.
8. In-progress entries do not affect games played or win rate.
9. Current Streak matches the existing streak value used elsewhere in the app.
10. Submitting a valid guess records and immediately displays the latest gameplay date.
11. Existing history without `lastPlayedAt` produces a deterministic last-played fallback.
12. With no history, counts display `0`, win rate displays `0%`, and Last Played displays `Never`.
13. Winning, losing, resetting, and refreshing keep the modal consistent with puzzle history.
14. Opening or closing the modal does not write history or change stats.
15. Existing History, About, gameplay, calendar, storage sanitization, and routing behavior remain unchanged.
16. No new npm dependencies are added.
17. Typecheck passes.
18. Build passes.

## Test Requirements

Add focused utility tests where practical for:

- empty or missing history;
- one win;
- one loss;
- mixed wins and losses;
- whole-number win-rate rounding;
- in-progress entries excluded from games played and win rate;
- completed entries taking precedence over contradictory failed flags;
- latest valid `lastPlayedAt` selection;
- fallback to completion/failure timestamps;
- fallback to an in-progress puzzle date;
- invalid activity timestamps ignored;
- current streak passed through without changing its definition;
- reset/removal changing derived totals;
- equal saved guesses not advancing `lastPlayedAt`;
- a valid submitted guess advancing `lastPlayedAt`.

If the project still has no automated test script, document that limitation and perform the manual verification below.

## Manual Verification

1. Start with empty local storage, open User Stats, and confirm all counts are `0`, Win Rate is `0%`, and Last Played is `Never`.
2. Submit an incorrect guess without finishing the puzzle and confirm only Last Played changes.
3. Win a puzzle and confirm Games Played, Games Won, Win Rate, Current Streak, and Last Played update without refreshing.
4. Lose a puzzle and confirm Games Played, Win Rate, and Last Played update without refreshing.
5. Open and close the modal repeatedly and confirm history storage is unchanged.
6. Refresh and confirm all displayed values are reproduced from local storage.
7. Remove/reset a history entry and confirm its result and activity no longer contribute to the stats.
8. Verify the Header remains usable at desktop and mobile widths with History, Stats, and About present.

## Definition of Done

- Acceptance criteria are satisfied.
- Statistics are derived from puzzle history and are not separately persisted.
- `lastPlayedAt` is updated only by valid gameplay actions.
- Empty and malformed history remain non-crashing.
- `npm run typecheck` passes.
- `npm run build` passes.
- Added tests pass, or the lack of an automated test harness is documented.
- Manual verification results are included in the PR summary.
- The diff remains focused and small enough for human review.

## Deliverable for Implementation Task

Produce a focused PR-sized diff that derives user statistics from local puzzle history, accurately records last-played activity, renders the values in a `User Stats` modal, and launches that modal from a new `Stats` button in the Header.
