# Spec 012 — Harden Sequence Timer Lifecycle

## Goal

Make sequence playback timing resilient by tracking and cancelling all sequence-related timeouts (including delayed insert), and ensuring playback controls are idempotent and race-safe.

## Why This Exists

Current sequence control uses multiple timeout channels that can overlap during rapid interactions (`Play`, `Stop`, `Reset`, loop toggles, and submit-triggered insert). Without strict timeout ownership and cleanup, stale callbacks can leak playback and stale highlight state.

## Scope

In scope:

- Track every timeout created by sequence playback lifecycle.
- Cancel all pending timeouts from a single shared cleanup pathway.
- Include delayed insert timeout in lifecycle management.
- Ensure `reset`, `stop`, and `end` pathways are idempotent.
- Ensure rapid control interactions do not produce stale UI highlights or orphan playback.

Out of scope:

- Audio synthesis changes.
- Musical-content changes (chord generation, puzzle logic).
- UI redesign.
- New dependencies.

## Product Behavior

- Repeatedly clicking `Play` should restart cleanly from the latest intent.
- Clicking `Stop` should immediately halt future scheduled playback and clear active highlight state.
- Clicking `Reset` should always leave playback in a neutral state, regardless of previous race conditions.
- Toggling loop or triggering insert during active timing should not create stacked schedules.

## Functional Requirements

### R1: Centralized timeout tracking

- Maintain explicit tracking for all timeout categories used by sequence flow:
  - per-chord timeouts
  - loop restart timeout
  - loop-end/clear-highlight timeout
  - delayed insert timeout
- Tracking must support replacing existing timeout handles safely.

### R2: Unified cancellation contract

- Implement a single cancellation pathway that clears every tracked timeout.
- `stop`, `end`, and reset-related flows must reuse this pathway.
- Cancellation must be safe when no timeout is currently registered.

### R3: Delayed insert lifecycle safety

- Delayed insert scheduling must be cancellable before execution.
- New playback actions (`Play`, `Stop`, `Reset`, `End`) must invalidate any pending insert timeout.
- Insert callback must not execute stale callbacks after lifecycle invalidation.

### R4: Idempotent control behavior

- Calling `stop` repeatedly produces the same stable result without side effects.
- Calling `end` repeatedly produces the same stable result without side effects.
- Calling reset repeatedly is safe and does not revive prior schedules.

### R5: Race-safe highlight/index updates

- Active index/highlight updates must only come from currently valid playback sessions.
- Stale timeout callbacks from prior sessions must not mutate highlight state.
- Stopping or resetting should leave index in neutral state (`null`) consistently.

### R6: Playback restart determinism

- Starting new playback while another schedule exists must first invalidate old schedule.
- Looping playback must not accumulate duplicate loop timers over repeated starts.

## UX/Behavior Expectations

- No phantom chord playback after `Stop` or `Reset`.
- No delayed highlight flashes from canceled sequences.
- Rapid interaction (play/stop/play/reset) remains predictable.

## Technical Constraints

- Preserve existing architecture boundaries (`Board` hook + `app/utils/chain.ts`).
- No new npm dependencies.
- Keep changes focused to playback lifecycle and related state synchronization.

## Suggested Files To Inspect

- `app/utils/chain.ts`
- `app/components/Board/hooks/useSequence.ts`
- `app/components/Board/Board.tsx`
- `app/components/Game/GameProvider.tsx`

## Suggested Implementation Notes

- Prefer a session/token approach or generation counter so stale callbacks can self-disqualify.
- Store timeout handles in one internal structure and clear them atomically.
- Ensure index-reset semantics are explicit in `stop` and reset pathways.

## Acceptance Criteria

1. All sequence-related timeouts are tracked, including delayed insert timeout.
2. `stop`, `end`, and reset pathways clear all pending sequence timeouts.
3. Repeated calls to `stop`/`end`/reset are idempotent and do not throw.
4. Rapid `play -> stop -> play -> reset` interaction does not leak playback.
5. Rapid interaction does not leave stale active chord highlights.
6. Loop mode restarts do not accumulate duplicate loop timers.
7. Typecheck and build pass.

## Test Requirements

Add or update tests for:

- Timeout cancellation coverage by control action (`play`, `stop`, `end`, reset).
- Delayed insert cancellation when superseded by another action.
- Idempotency of repeated control calls.
- Race scenario coverage for rapid interaction orderings.
- Highlight/index neutrality after cancellation/reset.

If full timer/UI automation is unavailable, add logic-level tests around scheduling/cancellation and include concise manual verification steps for rapid interaction scenarios.

## Definition of Done

- Acceptance criteria satisfied.
- No unrelated refactors.
- `npm run typecheck` passes.
- `npm run build` passes.
- Added tests pass, or blockers are clearly documented with evidence.

## Deliverable for Implementation Task

Produce a focused PR-sized diff that hardens sequence timeout lifecycle management so rapid playback interactions never leak playback or stale highlights.
