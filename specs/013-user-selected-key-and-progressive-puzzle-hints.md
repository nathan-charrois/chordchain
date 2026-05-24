# Spec 013 — User-Selected Key and Progressive Puzzle Hints

## Goal

Introduce a progressive hint system that hides puzzle key/mode by default and reveals hints in order (key, then mode), while allowing players to choose a key from a dropdown that drives palette chord generation.

## Why This Exists

The current game exposes puzzle key/mode immediately, reducing discovery difficulty. This feature adds controlled hinting and a player-driven key selection workflow while preserving daily puzzle integrity and history tracking.

## Scope

In scope:

- Hide active puzzle key and mode by default in gameplay UI.
- Add `Reveal hint` action with progressive reveal order:
  - first reveal: key
  - second reveal: mode
- Disable/ignore further reveal attempts after both hints are revealed.
- Add key-selection dropdown for palette generation.
- Regenerate palette chords when selected key changes.
- Persist hints-used count in local storage as part of puzzle history.

Out of scope:

- New puzzle-generation algorithm.
- Audio engine changes.
- New dependencies.
- Route/architecture changes.

## Product Behavior

- At puzzle start, key and mode are hidden.
- Player can click `Reveal hint` once to reveal key.
- Player can click `Reveal hint` a second time to reveal mode.
- After second reveal, hint action becomes disabled or no-op with clear state.
- Palette key dropdown is always available during active gameplay.
- Changing selected key immediately updates palette chord buttons for that key and the current mode context.
- Hint usage count for the active date persists in local storage and survives refresh.

## Functional Requirements

### R1: Hidden-by-default puzzle hints

- Active puzzle metadata (`key`, `mode`) remains in state, but is not shown by default in player-facing UI.
- Existing scale/key display components must respect hint visibility state.

### R2: Progressive reveal flow

- Introduce hint reveal state for active puzzle date with integer progression:
  - `0`: none revealed
  - `1`: key revealed
  - `2`: key and mode revealed
- `Reveal hint` increments state by exactly one per click until max `2`.
- Additional clicks at max must not mutate state.

### R3: Reveal button UX behavior

- Add `Reveal hint` control in primary gameplay surface (board-level controls).
- Button label/state should reflect progress, for example:
  - `Reveal hint (1/2)` when none revealed
  - `Reveal hint (2/2)` after first reveal
  - `All hints revealed` (disabled) after second reveal
- Control must be accessible and keyboard-usable.

### R4: User-selected key dropdown

- Add key dropdown with deterministic key list (flat-first naming policy).
- Selection state must be managed in game state or board-level state with explicit ownership.
- Palette generation must use selected key + active mode context.
- Selection changes must re-render palette deterministically without flicker.

### R5: Puzzle-mode interaction with user-selected key

- Puzzle solution validation remains based on active puzzle target chords (do not alter target by key selection).
- Key selection affects available chord palette options only.
- If selected key causes palette mismatch with target, app must remain stable and playable.

### R6: History model update for hints usage

- Extend puzzle history entry shape to include hints usage for the puzzle date:
  - `hintsUsed?: number` (0..2)
- Persist increments safely in existing local storage store version strategy.
- Updating hints usage must preserve existing completion fields (`completed`, `completedAt`, `attemptsUsed`).
- Reads must tolerate missing `hintsUsed` from prior entries.

### R7: Lifecycle and rehydration

- On load, hint usage for active date should hydrate from local storage.
- Hint usage should reset for a new puzzle date.
- Reset behavior policy must be explicit:
  - standard reset/new run should not clear hints used for that date unless product decision says otherwise.
  - debug reset-today should clear that date entry including hints usage.

## UX/Behavior Expectations

- Players are not shown key/mode unless they opt into hints.
- Hint reveal progression is obvious and irreversible for current puzzle date.
- Key selection is clear and responsive.
- History and hint usage remain consistent after refresh.

## Technical Constraints

- Preserve existing architecture boundaries (`GameProvider`, board/palette components, utils).
- Reuse existing history read/write helpers in `app/utils/puzzleHistory.ts`.
- Reuse existing music utilities for palette generation.
- No new npm dependencies.

## Suggested Files To Inspect

- `app/components/Game/context/GameContext.tsx`
- `app/components/Game/GameProvider.tsx`
- `app/components/Board/Board.tsx`
- `app/components/Scale/Scale.tsx`
- `app/components/Pallete/Pallete.tsx`
- `app/utils/music.ts`
- `app/utils/puzzleHistory.ts`
- `app/utils/dailyPuzzle.ts`

## Suggested Data Shapes

```ts
type HintProgress = 0 | 1 | 2

type PuzzleHistoryEntry = {
  completed: boolean
  completedAt?: string
  attemptsUsed?: number
  hintsUsed?: number
}
```

## Acceptance Criteria

1. Key and mode are hidden by default for active puzzle.
2. First `Reveal hint` reveals only key.
3. Second `Reveal hint` reveals mode.
4. Further reveal attempts do not change state beyond 2 hints.
5. Palette includes a key dropdown that updates displayed chords when selection changes.
6. Puzzle validation remains stable and does not break when selected key differs from puzzle key.
7. Hints used count persists in local storage history for the active date.
8. Existing history fields remain intact when hints data is written.
9. Rehydrating the app restores hints-used state for current puzzle date.
10. Typecheck and build pass.

## Test Requirements

Add or update tests for:

- Progressive hint state transitions (0 -> 1 -> 2, then stable).
- Hint button disabled/no-op behavior at max reveals.
- Key dropdown interaction updates palette chord sections.
- History parsing backward compatibility for entries without `hintsUsed`.
- History write behavior preserving existing fields while updating `hintsUsed`.
- Refresh-equivalent rehydration of hint usage for active date.

If full UI automation is unavailable, add logic-level tests for hint and history transitions and provide concise manual verification notes for reveal and dropdown interactions.

## Definition of Done

- Acceptance criteria satisfied.
- No unrelated refactors.
- `npm run typecheck` passes.
- `npm run build` passes.
- Added tests pass, or blockers are clearly documented with evidence.

## Deliverable for Implementation Task

Produce a focused PR-sized diff that adds progressive hint reveal, user-selected palette key, and persisted hints-used history without changing core architecture.
