# Spec 014 — Create Board Subcomponents

## Goal

Refactor the current board implementation by extracting focused subcomponents from `Board.tsx` while preserving all existing behavior.

## Why This Exists

`Board.tsx` currently combines multiple concerns (playback controls, hints, daily puzzle status, streak display, history modal entry, and run-state UI), making the file harder to read, test, and evolve. This spec introduces clear component boundaries without changing game rules.

## Scope

In scope:

- Extract and integrate these components:
  1. `DailyPuzzle`
  2. `Streak`
  3. `Hints`
  4. `PlaybackControls`
- Keep current board behavior and interactions intact.
- Keep history modal entry mounted from `DailyPuzzle`.
- Keep all existing game state hooks and callbacks compatible.

Out of scope:

- Gameplay logic changes (win/loss, grading, hint count policy).
- Visual redesign beyond parity-level layout cleanup.
- New dependencies.
- Route/provider architecture changes.

## Product Behavior

- The board should look and behave the same as before from a player perspective.
- `DailyPuzzle` shows current date, label `Daily Puzzle`, and countdown text `Puzzle resets in {hh:mm:ss}`.
- `DailyPuzzle` provides the entry point for opening puzzle history modal.
- `Streak` displays current streak with label `Day Streak`.
- `Hints` displays hint button and preserves current reveal behavior.
- `PlaybackControls` renders play/stop buttons and loop/arpeggiator checkboxes with existing behavior.

## Functional Requirements

### R1: Extract `DailyPuzzle` component

- Create `DailyPuzzle` component responsible for:
  - rendering current date
  - rendering `Daily Puzzle` label
  - rendering countdown text in `hh:mm:ss` format
  - rendering history-entry trigger control (for opening modal)
- Countdown must update over time without requiring parent rerenders.
- Countdown must be timezone-consistent with local date logic used elsewhere.

### R2: Extract `Streak` component

- Create `Streak` component that renders:
  - streak numeric value
  - label `Day Streak`
- Component must accept value via props and remain presentation-focused.

### R3: Extract `Hints` component

- Create `Hints` component responsible for rendering hint control with existing functionality.
- Preserve button disabled state and label behavior based on hint progress.
- Keep callback wiring explicit (`onRevealHint`, `disabled`, `label` or equivalent props).

### R4: Extract `PlaybackControls` component

- Create `PlaybackControls` component responsible for:
  - Play button
  - Stop button
  - Loop checkbox
  - Arpeggiate checkbox
- Preserve current event behavior and checked-state bindings.
- Keep controls accessible and keyboard-operable.

### R5: Board orchestration responsibility

- `Board.tsx` remains orchestration layer for:
  - game state consumption
  - callback definitions
  - modal open/close state
  - composition of extracted subcomponents
- No duplication of core logic across subcomponents.

### R6: History modal entry relocation

- Move history-open trigger from generic board controls to `DailyPuzzle` component.
- Existing modal implementation and content may remain in `Board.tsx` unless separately extracted.
- Opening and closing behavior must remain unchanged.

### R7: Refactor safety constraints

- Refactor must preserve current output and behavior parity as closely as practical.
- Keep prop contracts typed and minimal.
- Avoid creating hidden coupling between new components.

## UX/Behavior Expectations

- No regressions in controls responsiveness.
- Countdown is readable and continuously updates.
- Daily puzzle and streak information are clearer and easier to scan.
- Hint and playback controls continue to behave exactly as before.

## Technical Constraints

- Preserve existing architecture and state ownership.
- No new npm dependencies.
- Prefer colocated component folders under board feature area for maintainability.
- Keep diff focused on component extraction and light wiring changes.

## Suggested Files To Inspect

- `app/components/Board/Board.tsx`
- `app/components/Board/hooks/useSequence.ts`
- `app/components/Game/hooks/useGame.ts`
- `app/components/Game/context/GameContext.tsx`
- `app/utils/date.ts`

## Suggested File Structure

```txt
app/components/Board/
  Board.tsx
  components/
    DailyPuzzle.tsx
    Streak.tsx
    Hints.tsx
    PlaybackControls.tsx
  hooks/
    useSequence.ts
```

## Suggested Prop Shapes

```ts
type DailyPuzzleProps = {
  date: string
  onOpenHistory: () => void
}

type StreakProps = {
  value: number
}

type HintsProps = {
  label: string
  disabled: boolean
  onRevealHint: () => void
}

type PlaybackControlsProps = {
  onPlay: () => void
  onStop: () => void
  isLooping: boolean
  onToggleLooping: () => void
  isArpeggiate: boolean
  onToggleArpeggiate: () => void
}
```

## Acceptance Criteria

1. `Board.tsx` no longer directly renders the extracted JSX blocks for daily puzzle, streak, hints, and playback controls.
2. `DailyPuzzle` renders date, `Daily Puzzle`, and `Puzzle resets in {hh:mm:ss}`.
3. History modal open action is triggered from `DailyPuzzle`.
4. `Streak` renders current streak with `Day Streak` label.
5. `Hints` renders and preserves existing reveal-hint behavior.
6. `PlaybackControls` renders play/stop and loop/arpeggiate controls with existing behavior.
7. No gameplay-regression behavior changes in board flow.
8. Typecheck and build pass.

## Test Requirements

Add or update tests for:

- `DailyPuzzle` countdown render/update behavior.
- `DailyPuzzle` history trigger callback invocation.
- `Hints` disabled and click behavior parity.
- `PlaybackControls` callback and checkbox state wiring.
- Integration sanity: `Board` composes subcomponents and maintains existing interactions.

If full component testing is unavailable, add minimal logic-level coverage and include manual verification steps for play/stop, loop/arpeggiate toggles, hint reveal, and history modal entry.

## Definition of Done

- Acceptance criteria satisfied.
- No unrelated refactors.
- `npm run typecheck` passes.
- `npm run build` passes.
- Added tests pass, or blockers are clearly documented with evidence.

## Deliverable for Implementation Task

Produce a focused PR-sized diff that decomposes board UI into `DailyPuzzle`, `Streak`, `Hints`, and `PlaybackControls` components while preserving current functionality.
