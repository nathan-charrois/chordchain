# Spec 002 — Fix Game Outcome Logic and Submission Constraints

## Goal

Make game outcomes deterministic and correct by fixing win/loss logic and enforcing submission constraints in the existing gameplay loop.

This spec is implementation-focused but intentionally narrow in scope.

## Why This Exists

The current game prototype allows invalid submissions and has incorrect win detection behavior. These issues block a reliable first-playable loop and make status feedback untrustworthy.

## Scope

In scope:

- Correct win detection for chord-sequence guesses.
- Correct loss detection based on max guesses.
- Submission guards for:
  - exact required guess length
  - max guess limit
  - non-empty and valid submissions
- Ensure status transitions are coherent with these rules.
- Ensure post-end-state submissions are blocked.

Out of scope:

- Guess grading visuals (per-chord absent/present/correct rendering).
- New UI themes, animation redesign, or layout overhaul.
- Daily puzzle generation/persistence.
- New dependencies.
- Routing/architecture changes.

## Current Issues To Address

1. Win logic compares array references instead of value equality.
2. Enter can submit guesses that are too short, empty, or beyond game end.
3. Status lifecycle is inconsistent (`started` not clearly used, end-state behavior weak).
4. End-state can be reached without enforcing interaction lockout.

## Functional Requirements

### R1: Win detection must be value-based

- A guess wins when and only when:
  - guess length equals target length, and
  - each chord token matches target token at the same index.
- Sequence equality must not depend on object or array reference identity.

### R2: Loss detection must be deterministic

- Loss triggers when submitted valid guesses reach `GAME_MAX_GUESSES` without a win.
- A winning guess on the final allowed attempt must produce `won`, not `loss`.

### R3: Submission validation rules

- `submitGuess()` must be a no-op when any of the following is true:
  - current game status is `won` or `loss`
  - current guess is empty
  - current guess length is not exactly `maxLength`
  - submitted guess count is already at `maxGuesses`
- No invalid guess should be appended to `guesses`.

### R4: Input guard consistency

- `addCurrent()` must not add chords when:
  - game is in `won` or `loss`, or
  - current guess is already at `maxLength`
- `removeCurrent()` should continue to work only while game is active.

### R5: Status consistency

- Status must be predictable and derived from state transitions:
  - `new` on initial/reset
  - `started` once player begins entering a guess or submits first valid guess
  - `won` after valid winning submission
  - `loss` after final non-winning valid submission
- Status logic must not oscillate incorrectly on rerender.

## UX/Behavior Expectations

- Pressing Enter with an incomplete chain must not submit.
- Pressing Enter after game end must not submit.
- Guess counter should only increment for valid submissions.
- After win/loss, gameplay inputs should effectively lock (except reset when implemented elsewhere).

## Technical Constraints

- Preserve existing architecture and component structure.
- No new npm dependencies.
- Keep changes focused to game state/logic and minimal UI touchpoints needed for guard enforcement.
- Do not change routes, deployment config, or build setup.

## Suggested Files To Inspect

- `app/components/Game/context/GameContext.tsx`
- `app/components/Game/GameProvider.tsx`
- `app/components/Game/hooks/useStatus.ts`
- `app/components/Game/logic/game.ts`
- `app/components/Pallete/Pallete.tsx`
- `app/components/Board/Board.tsx`
- `app/constant.ts`

## Acceptance Criteria

1. Correct sequence submission (same chords in same order) sets status to `won`.
2. Incorrect valid submissions reaching max guesses set status to `loss`.
3. Incomplete guesses are not submitted.
4. Empty guesses are not submitted.
5. Submissions after `won` or `loss` are ignored.
6. Guess list length increases only on valid submissions.
7. Chord additions cannot exceed `maxLength`.
8. Typecheck and build pass.

## Test Requirements

Add or update tests for at least:

- Sequence equality helper behavior.
- Win/loss precedence (especially final attempt win case).
- Submission guard matrix:
  - empty
  - short
  - full valid
  - after game end
  - at max guesses
- Input max-length enforcement.

If project test infrastructure is unavailable, include minimal unit-level coverage where feasible and document the gap in the final task report.

## Definition of Done

- All acceptance criteria satisfied.
- No unrelated refactors.
- `npm run typecheck` passes.
- `npm run build` passes.
- Any added tests pass (or blockers are explicitly documented with evidence).

## Deliverable for Implementation Task

Produce a focused PR-sized diff that fixes game outcome correctness and submission constraints only.
