# Spec 011 — Implement Daily Completion Streak Feature

## Goal

Add a streak feature that shows how many consecutive days the user has completed the daily puzzle, with data sourced from local storage history (derived and/or persisted).

## Why This Exists

Daily puzzle systems benefit from continuity feedback. A visible streak gives players clear progress motivation and confirms that completion history is being tracked correctly.

## Scope

In scope:

- Compute current streak days from daily puzzle completion history.
- Render streak count in gameplay UI.
- Keep streak stable across refreshes via local storage-backed history.
- Define deterministic streak rules and edge-case behavior.

Out of scope:

- Leaderboards/social sharing.
- Rewards/achievements tied to streak milestones.
- Cross-device sync.
- New dependencies.

## Product Behavior

- UI displays current streak value (days).
- Value updates after user completes today's puzzle.
- Value persists through page refresh because it is derived from (or stored with) local history.

## Functional Requirements

### R1: Streak source of truth

- Primary source of truth is puzzle history in local storage (existing date-keyed completion entries).
- Streak may be:
  - derived on read from history entries, or
  - stored as cached metadata if still validated against history integrity.
- If both are used, derived result must win on mismatch.

### R2: Streak definition

- Current streak is the number of consecutive calendar dates with `completed === true`, counting backward from today.
- Deterministic rule:
  - if today's puzzle is not completed, current streak is `0`.
  - if today is completed, count continuous completed dates for today, yesterday, and so on until first gap.
- Date arithmetic must use the same local date format used by daily puzzle selection.

### R3: Streak recalculation triggers

- Recalculate streak when:
  - history store is loaded on app start,
  - today's puzzle is marked completed,
  - today's history entry is removed/reset.
- Recalculation must not require page refresh.

### R4: UI rendering

- Render streak value in visible game UI (board/header/scale area acceptable).
- Minimum content:
  - label: `Current Streak`
  - value: integer day count
- UI should remain readable on desktop and mobile.

### R5: Refresh persistence

- After winning today and refreshing, streak should still show updated value.
- If reset tooling removes today's completion entry, streak should update accordingly after refresh and in-session.

### R6: Error and fallback handling

- Malformed or missing local storage history must not crash app.
- In invalid-history cases, streak safely defaults to `0`.

## UX/Behavior Expectations

- Streak is understandable at a glance.
- No flicker from incorrect intermediate values during initial load.
- Count transitions are immediate after completion events.

## Technical Constraints

- Reuse existing history/date utilities where possible.
- Preserve existing architecture and context boundaries.
- No new npm dependencies.

## Suggested Files To Inspect

- app/utils/puzzleHistory.ts
- app/utils/date.ts
- app/components/Game/GameProvider.tsx
- app/components/Game/context/GameContext.tsx
- app/components/Board/Board.tsx
- app/components/Scale/Scale.tsx

## Suggested Utility Shape

```ts
type StreakResult = {
  current: number
}

function calculateCurrentStreak(
  entries: Record<string, { completed: boolean }>,
  todayDate: string,
): StreakResult
```

## Acceptance Criteria

1. UI shows a `Current Streak` value.
2. Streak derives from date-keyed completion history and survives refresh.
3. If today is incomplete, streak displays `0`.
4. If today is completed and yesterday completed, streak displays at least `2`.
5. Streak stops at first missing/incomplete date gap.
6. Malformed/missing history does not crash app and yields streak `0`.
7. Typecheck and build pass.

## Test Requirements

Add or update tests for:

- Streak calculation with no history.
- Single-day completion (today only).
- Multi-day consecutive completions including today.
- Gap behavior (today complete, missing yesterday).
- Today incomplete with prior completed days -> streak `0`.
- History parse failure fallback -> streak `0`.
- Integration: winning today updates rendered streak immediately.

If full UI test coverage is unavailable, add strong unit tests around streak calculation and document any remaining UI-test gaps.

## Definition of Done

- Acceptance criteria satisfied.
- No unrelated refactors.
- npm run typecheck passes.
- npm run build passes.
- Added tests pass, or blockers are documented with evidence.

## Deliverable for Implementation Task

Produce a focused PR-sized diff that calculates and renders a daily completion streak using local storage puzzle history and keeps it accurate after completion, reset, and page refresh.
