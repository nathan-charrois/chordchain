# Spec 004 — Add End-State UX and Reset/New Game Flow

## Goal

Provide clear win/loss end-state UX and a reliable reset/new game flow so players can complete a run and immediately start another without manual refresh.

## Why This Exists

Even with correct game logic, the current experience lacks clear completion feedback and recovery path. This prevents the gameplay loop from feeling complete.

## Scope

In scope:

- End-state presentation for `won` and `loss`.
- End-of-run interaction behavior (what remains enabled/disabled).
- New game/reset action that restores a clean game state.
- Ensure audio/playback behavior is coherent on end and reset.

Out of scope:

- Daily puzzle persistence and streak/history systems.
- Major visual redesign beyond required UX clarity.
- New dependencies.
- Routing/architecture changes.

## Current Issues To Address

1. No explicit win/loss messaging in the main gameplay surface.
2. No clear reset/new game action after a run.
3. Inputs can remain active in ways that conflict with end-state intent.
4. Audio sequence behavior at end-state/reset is not explicitly coordinated.

## Functional Requirements

### R1: End-state messaging

- When game status is `won`, show a clear success state.
- When game status is `loss`, show a clear failure state.
- End-state UI should include concise contextual information:
  - attempts used
  - target progression reveal on loss

### R2: End-state interaction model

- After `won` or `loss`, guess input actions must be disabled or ignored.
- Playback controls may remain usable for listening, but behavior must be explicit and consistent.
- Any disabled controls must have clear visual state.

### R3: Reset/New Game control

- Provide a visible reset/new game CTA in end-state.
- On reset, game state returns to clean baseline:
  - status -> `new`
  - submitted guesses cleared
  - current guess cleared
  - active playback/sequence timers safely stopped
- Reset must be idempotent (safe to trigger repeatedly).

### R4: Start-of-new-run behavior

- After reset, player can immediately:
  - play target sequence
  - enter a fresh guess
  - submit according to validation rules from prior spec
- No stale statuses or stale board highlights should remain.

### R5: Minimal accessibility and clarity

- End-state message should be screen-reader discoverable in normal DOM flow.
- Primary next action (new game) should be obvious on desktop and mobile.

## UX/Behavior Expectations

- Win path: player sees confirmation and option to start a new game.
- Loss path: player sees failure state, can review answer, and restart.
- Restart path feels immediate and stable with no visual leftovers from prior run.

## Technical Constraints

- Preserve existing architecture and component hierarchy.
- No new npm dependencies.
- Keep styling changes focused on end-state readability and control clarity.

## Suggested Files To Inspect

- `app/components/Game/context/GameContext.tsx`
- `app/components/Game/GameProvider.tsx`
- `app/components/Board/Board.tsx`
- `app/components/Pallete/Pallete.tsx`
- `app/components/App/AppLayout.tsx`
- any CSS modules used by updated components
- `app/utils/chain.ts` (for safe sequence stop/reset behavior)

## Acceptance Criteria

1. `won` state shows explicit success UI and a new game action.
2. `loss` state shows explicit failure UI, reveals target, and a new game action.
3. Guess-entry interactions are blocked after game end.
4. Reset returns game state and playback to a clean baseline.
5. Starting a new run works without page refresh.
6. Typecheck and build pass.

## Test Requirements

Add or update tests for:

- End-state conditional rendering (`won` vs `loss`).
- Reset behavior clearing game data and status.
- Interaction lock after end-state.
- Playback stop/reset coordination if covered by logic-level tests.

If complete automated coverage is not feasible, add minimal targeted tests and document remaining gaps.

## Definition of Done

- Acceptance criteria met.
- No unrelated refactors.
- `npm run typecheck` passes.
- `npm run build` passes.
- Added tests pass, or blockers are documented with evidence.

## Deliverable for Implementation Task

Produce a focused PR-sized diff that adds end-state UX and reset/new game flow only.
