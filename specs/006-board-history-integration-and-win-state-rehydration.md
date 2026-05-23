# Spec 006 — Board History Integration and Win State Rehydration

## Goal

Use daily puzzle history data directly in the game board experience and ensure that refreshing the page preserves and displays win status for completed daily puzzles.

## Why This Exists

Daily puzzle selection and history persistence can exist without fully affecting gameplay UX. Players need the board to reflect historical completion immediately, including after page refresh, so the app behaves like a true daily puzzle game.

## Scope

In scope:

- Integrate daily puzzle history state into board-level UI.
- Rehydrate game status on initial load using persisted completion for the active daily puzzle date.
- Show completed-state UX on board after refresh when today's puzzle was already solved.
- Keep board interactions consistent with rehydrated end-state.

Out of scope:

- New puzzle-generation system.
- Account sync or cross-device persistence.
- Major visual redesign of the board.
- New dependencies.

## Product Behavior

- If the active daily puzzle date is already marked complete in local storage:
  - page load should show board in `won` end-state UX.
  - guess-entry controls should reflect completed-state behavior.
- If active date is not completed:
  - board behaves as normal active puzzle.
- History-derived completion should be visible in board context (for example status badge/text section) without requiring modal open.

## Functional Requirements

### R1: Rehydrate end-state from history

- On game/provider initialization for active puzzle date:
  - read history entry for that date.
  - if `completed === true`, initialize game status as `won`.
- Rehydration must happen before first meaningful board render to avoid status flicker.

### R2: Preserve game state semantics

- Rehydrated `won` state must follow same interaction rules as runtime `won`:
  - submissions blocked/ignored
  - chord-entry controls disabled or no-op
  - board clearly indicates completion
- Existing reset/new-game flow (if available) must still work and remain idempotent.

### R3: Board-level history visibility

- Board UI should surface daily history context for active date, such as:
  - `Today's puzzle: Complete` or `Incomplete`
  - optional completed timestamp/attempts if present
- This display should update immediately when completion is recorded during the same session.

### R4: Refresh consistency

- Completing a puzzle, refreshing the page, and reopening should keep board in completed state for that date.
- Refresh must not erase completion status or regress board to `new` for completed date.

### R5: Loss does not auto-convert to win

- Rehydration logic must only restore `won` for explicit completed entries.
- `loss` on refresh should only appear if intentionally persisted by product decision; otherwise default to active puzzle state.

### R6: Data safety and fallback behavior

- If history storage is missing or malformed:
  - app must not crash.
  - board falls back to non-complete active puzzle state.
- Unknown schema/version should degrade safely to defaults.

## UX/Behavior Expectations

- Completed daily puzzle feels "already solved" after refresh.
- Board communicates completion without forcing user to inspect modal/history list.
- Active incomplete puzzle remains playable with normal controls.

## Technical Constraints

- Preserve existing architecture and provider boundaries.
- Reuse existing daily puzzle/history utilities where possible.
- No new npm dependencies.
- Keep changes focused to game state hydration and board UI wiring.

## Suggested Files To Inspect

- app/components/Game/context/GameContext.tsx
- app/components/Game/GameProvider.tsx
- app/components/Game/hooks/useStatus.ts
- app/components/Board/Board.tsx
- app/utils/dailyPuzzle.ts
- app/utils (history storage helper module, if present)

## Acceptance Criteria

1. If today's puzzle is marked complete in local storage, page load shows board in `won` state.
2. Completed board state is visible without opening history modal.
3. Guess input/submission are blocked in rehydrated `won` state.
4. If today's puzzle is incomplete, board initializes as active puzzle (not `won`).
5. Completing a puzzle then refreshing retains `won` board state.
6. Malformed or missing local storage does not crash app and defaults safely.
7. Typecheck and build pass.

## Test Requirements

Add or update tests for:

- Provider/game initialization with completed history entry.
- Initialization without completed entry.
- Initialization with malformed history payload.
- Board rendering completed-state indicator from rehydrated status.
- Refresh-equivalent flow: write completion -> re-init -> status `won`.

If full UI automation is unavailable, add unit/integration tests for hydration and board-state derivation and document remaining UI-test gaps.

## Definition of Done

- Acceptance criteria satisfied.
- No unrelated refactors.
- `npm run typecheck` passes.
- `npm run build` passes.
- Added tests pass, or blockers are clearly documented.

## Deliverable for Implementation Task

Produce a focused PR-sized diff that integrates daily history status into the board and rehydrates `won` state after refresh for completed daily puzzles.
