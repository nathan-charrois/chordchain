# Spec 017 — Improved Audio Controls

## Goal

Improve target-chain playback controls by replacing separate play and stop buttons with one state-aware button and adding a player-controlled tempo slider.

## Why This Exists

The current playback UI exposes separate `Play` and `Stop` buttons and plays the target sequence at a fixed interval. This makes the control state less clear and gives players no way to slow down difficult chains or speed up familiar ones. A single toggle button plus tempo control makes listening more predictable and gives the player direct control over playback speed.

## Scope

In scope:

- Replace separate `Play` and `Stop` controls with one button.
- Render the button label as `Play` when playback is idle.
- Render the button label as `Stop` when the chain is currently playing.
- Add a tempo slider controlled by the player.
- Default tempo to `120 BPM`.
- Use the selected tempo to determine sequence playback timing.
- Preserve existing loop and arpeggiate controls.
- Preserve existing target highlighting behavior during playback.

Out of scope:

- Changing chord synthesis or instrument tone.
- Changing guess submission, grading, hints, history, or end-state rules.
- Changing target reveal rules.
- Adding metronome clicks, count-in behavior, or beat visualization.
- Persisting tempo across page refresh.
- Route, auth, database, deployment, or CI changes.
- New npm dependencies.

## Product Behavior

- On initial load, playback controls show one button labeled `Play`.
- The tempo slider defaults to `120 BPM`.
- The tempo value is visible near the slider.
- Moving the tempo slider changes how quickly the target chain plays.
- Clicking `Play` starts playback and changes the button label to `Stop`.
- Clicking `Stop` stops playback, clears the active target highlight, and changes the button label back to `Play`.
- If looping is enabled, playback remains in the playing state until the player stops it or another lifecycle event stops it.
- If looping is disabled, playback returns to idle after the sequence finishes.
- Playback controls remain available after win/loss for listening, consistent with current behavior.

## Functional Requirements

### R1: Single play/stop button

- Replace the two-button playback UI with one toggle button.
- The button must call the existing play pathway when playback is idle.
- The button must call the existing stop pathway when playback is active.
- The button label must reflect playback state:
  - `Play` when idle.
  - `Stop` when active.
- The button state must not rely only on click history; it must synchronize with sequence lifecycle events.

### R2: Playback active state

- Track whether the target chain is currently playing.
- Set playing state to active when sequence playback starts.
- Set playing state to idle when playback is stopped manually.
- Set playing state to idle when playback naturally completes without looping.
- Keep playing state active between loop iterations while looping is enabled.
- Set playing state to idle when the active puzzle target changes.
- Set playing state to idle when reset, history selection, or other existing stop/end pathways stop playback.

### R3: Tempo slider

- Add a slider to `PlaybackControls`.
- Default tempo must be `120 BPM`.
- The selected tempo must be controlled by React state owned near the existing playback control state.
- The slider must show the current BPM value.
- Use a practical tempo range that supports both learning and quick review.
- Suggested range:
  - minimum `60 BPM`
  - maximum `200 BPM`
  - step `5 BPM`
- Keep the UI compact and usable on mobile and desktop.

### R4: Tempo-driven timing

- Sequence scheduling must derive chord spacing from selected BPM rather than the fixed `SEQUENCE_GAP_MS` value.
- At `120 BPM`, playback should preserve the current effective chord spacing unless the implementation intentionally maps one chord to one beat and documents the changed timing.
- Tempo changes should apply to the next playback start.
- If tempo changes during active playback, the implementation may either:
  - restart playback using the new tempo, or
  - apply the new tempo on the next play/loop cycle.
- The chosen behavior must be deterministic and documented in code or tests.

### R5: Existing playback options

- Preserve the existing loop checkbox behavior.
- Preserve the existing arpeggiate checkbox behavior.
- Loop and arpeggiate state must continue to be passed into playback start.
- Disabling loop during playback should keep existing `endSequence` behavior or an equivalent safe stop-at-end behavior.
- Existing active target highlight behavior must remain coherent at different tempos.

### R6: Sequence lifecycle safety

- Starting playback while already active must not create duplicate timers.
- Stopping playback must cancel all pending sequence timers.
- Switching puzzles must stop playback and clear active highlight state.
- Resetting gameplay must stop playback and clear active highlight state.
- Rapid toggling of the single button must remain race-safe.
- Existing hardened timeout cleanup behavior from spec 012 must not regress.

### R7: Component boundaries

- Keep presentation changes focused in `PlaybackControls`.
- Keep sequence lifecycle behavior in `useSequence` and `app/utils/chain.ts`.
- Do not move game rules into playback UI components.
- Prefer existing Mantine components before adding new styling.
- Avoid introducing new abstractions unless they clearly reduce local complexity.

## UX/Behavior Expectations

- The playback control reads as one clear toggle rather than two competing actions.
- Players can slow the chain down while learning a progression.
- Players can speed the chain up once familiar with the target.
- The displayed BPM makes the selected playback speed explicit.
- Controls remain visually aligned with the current board styling.
- Playback status and target highlighting should not contradict each other.

## Technical Constraints

- Preserve existing provider/context architecture.
- No new npm dependencies.
- Do not change routing, database schema, auth, deployment config, or CI.
- Keep the diff focused to playback controls, sequence hook/state, chain timing, and tests.
- Use only scripts already defined in `package.json`.
- Avoid broad visual redesign beyond the improved audio controls.

## Suggested Implementation Notes

- Add local `tempoBpm` state in `Board.tsx` near `isLooping` and `isArpeggiate`.
- Add playback active state in `useSequence`, or expose it from the hook if lifecycle ownership fits there best.
- Pass `tempoBpm` into `playSequence`.
- Replace fixed sequence gap scheduling with a function derived from BPM.
- Consider a named default such as `DEFAULT_TEMPO_BPM = 120`.
- Consider a named range such as `MIN_TEMPO_BPM`, `MAX_TEMPO_BPM`, and `TEMPO_STEP_BPM`.
- Keep `PlaybackControls` controlled through props:
  - playing state.
  - toggle callback.
  - tempo value.
  - tempo change callback.
  - loop state.
  - arpeggiate state.

## Acceptance Criteria

1. Playback controls render a single button instead of separate `Play` and `Stop` buttons.
2. The button displays `Play` before playback starts.
3. Clicking `Play` starts target-chain playback and changes the button label to `Stop`.
4. Clicking `Stop` stops playback, clears active highlighting, and changes the label back to `Play`.
5. The tempo slider renders with a default value of `120 BPM`.
6. The current BPM value is visible to the player.
7. Starting playback uses the selected tempo to schedule chord spacing.
8. Non-looping playback returns the button to `Play` after the sequence completes.
9. Looping playback keeps the button labeled `Stop` across loop iterations until stopped.
10. Existing loop and arpeggiate controls continue to work.
11. Puzzle switching, reset, and history selection stop playback and reset the button to `Play`.
12. Rapid play/stop toggling does not leak playback timers or stale active highlights.
13. Typecheck and build pass.

## Definition of Done

- Acceptance criteria satisfied.
- No unrelated refactors.
- `npm run typecheck` passes.
- `npm run build` passes.
- Added tests pass, or blockers are clearly documented with evidence.
- The final diff is small enough for human review.

## Deliverable for Implementation Task

Produce a focused PR-sized diff that replaces separate play/stop controls with a single state-aware playback button and adds a player-controlled tempo slider defaulting to `120 BPM`, while preserving existing loop, arpeggiate, timer cleanup, and target-highlight behavior.
