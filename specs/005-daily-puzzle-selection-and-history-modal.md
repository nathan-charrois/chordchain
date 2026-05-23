# Spec 005 — Daily Puzzle Selection and History Modal

## Goal

Add a daily puzzle selection mechanism and a puzzle-history UI so players can review prior days and see completion status by date.

## Why This Exists

The product framing implies a daily puzzle experience, but current gameplay uses a static in-memory target with no date-aware selection or persisted completion history.

## Scope

In scope:

- Date-based daily puzzle selection.
- Hardcoded puzzle catalog (for now) in code.
- Modal UI that lists previous puzzles and completion state.
- Local storage persistence of user completion history by puzzle date.
- Read/write helpers for daily puzzle and history data.

Out of scope:

- Remote puzzle API.
- User accounts, cloud sync, cross-device history.
- Leaderboards, streak rewards, social sharing.
- Large route or architecture rewrites.
- New npm dependencies.

## Product Behavior

- Each calendar date resolves to one puzzle entry.
- Today loads automatically when opening the game.
- Player can open a history modal and browse prior puzzle dates.
- Each listed date shows completion state for this browser profile.
- Completion is recorded when a puzzle is solved.
- Uncompleted days remain marked incomplete.

## Functional Requirements

### R1: Hardcoded daily puzzle catalog

- Define an in-code puzzle catalog keyed by date string (`YYYY-MM-DD`).
- Each puzzle record must include at minimum:
  - `date`
  - `target` chord sequence
  - optional metadata for hint display (for example key/mode)
- Include a fallback behavior when date is missing from catalog:
  - deterministic fallback puzzle, or
  - nearest prior puzzle in catalog
- Fallback behavior must be documented in code comments and in this spec implementation notes.

### R2: Daily puzzle resolution

- App resolves current local date in `YYYY-MM-DD` format.
- Resolved date maps to a single active puzzle for gameplay.
- Active puzzle date is available in game state for UI display and history comparison.

### R3: Local storage history model

- Persist history in local storage under a dedicated key.
- Required storage fields:
  - `version`
  - `entries` map keyed by date
- Each date entry stores at least:
  - `completed` boolean
  - `completedAt` timestamp when completed
  - optional `attemptsUsed`
- Reads must be resilient to malformed JSON or unknown versions.
- On read error, fall back to safe defaults without crashing.

### R4: Completion recording

- When game status transitions to `won`, mark current puzzle date as completed.
- Completion write should be idempotent for already completed dates.
- Losing a puzzle does not set completed to true.
- A reset/new game on same date should not clear existing completion.

### R5: History modal UI

- Add a clearly discoverable control to open a modal.
- Modal lists puzzle dates from the catalog (descending date order).
- Each row displays:
  - puzzle date
  - completion state (`Complete` or `Incomplete`)
  - optional extra details (attempt count/date completed)
- Today should be visually identifiable in the list.
- Modal must be closable via close button and escape key.

### R6: History/time correctness

- Completion status is computed per date, not per session instance.
- Date format used in state, storage, and UI must be consistent.
- The system should avoid timezone drift bugs by using one canonical local-date formatter.

## UX/Behavior Expectations

- Player can always access puzzle history from main game screen.
- Completion updates appear in history without page reload.
- UI remains usable on mobile and desktop.

## Technical Constraints

- Preserve existing architecture and provider/component boundaries.
- No new npm dependencies.
- Keep changes focused to game state, small utility helpers, and modal UI wiring.
- Do not change deployment/build config.

## Suggested Files To Inspect

- app/components/Game/context/GameContext.tsx
- app/components/Game/GameProvider.tsx
- app/components/Game/hooks/useStatus.ts
- app/components/Board/Board.tsx
- app/components/App/AppLayout.tsx
- app/constant.ts
- app/utils (add small date/storage helpers as needed)

## Suggested Data Shapes

```ts
type DailyPuzzle = {
  date: string // YYYY-MM-DD
  target: string[]
  key?: string
  mode?: string
}

type PuzzleHistoryEntry = {
  completed: boolean
  completedAt?: string
  attemptsUsed?: number
}

type PuzzleHistoryStore = {
  version: 1
  entries: Record<string, PuzzleHistoryEntry>
}
```

## Acceptance Criteria

1. App resolves an active puzzle based on current date.
2. Active puzzle can come from hardcoded catalog (with deterministic fallback if missing).
3. History modal opens and lists prior puzzle dates.
4. Each puzzle date in modal shows completion state from local storage.
5. Winning today marks today as completed in local storage.
6. Completion state persists across page refresh.
7. Malformed local storage data does not crash app; defaults are restored safely.
8. Typecheck and build pass.

## Test Requirements

Add or update tests for:

- Date-to-puzzle resolution (including missing-date fallback).
- Local storage parse/write behavior and malformed-data handling.
- Completion recording on win transition.
- History modal rendering of complete/incomplete states.

If automated UI tests are unavailable, add unit tests for selector/storage logic and document remaining UI-test gap.

## Definition of Done

- Acceptance criteria satisfied.
- No unrelated refactors.
- `npm run typecheck` passes.
- `npm run build` passes.
- Added tests pass, or blockers are documented with evidence.

## Deliverable for Implementation Task

Produce a focused PR-sized diff that adds daily puzzle selection plus a history modal backed by date-based local storage completion tracking.
