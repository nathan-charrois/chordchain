# Spec 003 — Implement Chord-Sequence Grading and Connect Status to UI

## Goal

Implement per-chord grading for submitted guesses and surface grading status clearly in the existing UI so players can improve across attempts.

## Why This Exists

The game currently accepts and lists guesses, but it does not evaluate guesses into actionable feedback. Existing status helpers are present but not wired to the chord-sequence model.

## Scope

In scope:

- Grade each submitted guess chord-by-chord against target sequence.
- Persist grade results on each submitted guess.
- Connect grade status to visible UI elements.
- Ensure status precedence is meaningful (`correct` should not be downgraded by prior `present`/`absent`).

Out of scope:

- End-state messaging and reset flow (handled by separate spec).
- Daily puzzle generation/persistence.
- New dependencies.
- Architecture/routing changes.

## Current Issues To Address

1. Submitted guesses currently store an empty `status` array.
2. Existing grading helper assumes string-character semantics, not chord-token arrays.
3. Existing UI does not render per-chord grade feedback.
4. Status-to-style mapping utilities exist but are not consistently integrated.

## Functional Requirements

### R1: Chord-token grading algorithm

- Implement grading against two arrays of chord tokens:
  - `guess: Chord[]`
  - `target: Chord[]`
- Status domain remains:
  - `correct` = chord matches at same index.
  - `present` = chord exists in target at remaining unmatched index.
  - `absent` = chord does not exist in remaining unmatched target pool.
- Duplicate chord handling must be count-aware:
  - A chord can only be marked `present` up to remaining count after `correct` assignments.

### R2: Submission writes graded results

- On valid submit, each saved guess must include:
  - submitted chord tokens
  - computed `GuessStatus[]` with same length as guess
- Grading must execute exactly once per valid submission.

### R3: Guess-row UI feedback

- Submitted guess rows must show status-linked visual feedback for each chord token.
- Current in-progress guess should remain visually distinct from submitted rows.
- Visual status should be understandable without inspecting internal debug state.

### R4: Palette/key status feedback

- Chord buttons should reflect best-known status from all submitted guesses.
- Status precedence for a chord should be:
  - `correct` > `present` > `absent` > undefined
- Once a chord reaches `correct`, later guesses must not downgrade that chord button.

### R5: Status utility alignment

- Keep status helper names/types aligned with `GameContext` types.
- Remove or refactor grading helpers that are incompatible with token-array grading.

## UX/Behavior Expectations

- After each valid submit, player sees immediate per-chord feedback.
- Feedback updates are stable across rerenders.
- Palette hints become progressively more informative across attempts.

## Technical Constraints

- Preserve existing architecture and provider/component boundaries.
- No new npm dependencies.
- Keep changes focused to logic + UI wiring required for grading visibility.

## Suggested Files To Inspect

- `app/components/Game/context/GameContext.tsx`
- `app/components/Game/GameProvider.tsx`
- `app/components/Game/logic/game.ts`
- `app/components/Board/Board.tsx`
- `app/components/Pallete/Pallete.tsx`
- `app/components/PalleteButton/PalleteButton.tsx`
- related CSS module files used for status classes

## Acceptance Criteria

1. Submitted guesses include a status array equal in length to submitted chords.
2. Grading correctly handles exact matches, partial matches, misses, and duplicates.
3. Board renders per-chord status for submitted guesses.
4. Palette buttons reflect best-known status across all guesses.
5. Palette status never regresses from `correct` to lower states.
6. Typecheck and build pass.

## Test Requirements

Add or update tests for:

- Chord grading algorithm including duplicate-chord cases.
- Status precedence merge for palette hints.
- Guess serialization ensuring chords/status length parity.

If test infrastructure is not available, include minimal unit-level coverage where feasible and document any testing gap.

## Definition of Done

- Acceptance criteria met.
- No unrelated refactors.
- `npm run typecheck` passes.
- `npm run build` passes.
- Added tests pass, or blockers are documented with evidence.

## Deliverable for Implementation Task

Produce a focused PR-sized diff that implements chord-sequence grading and status-connected UI feedback only.
