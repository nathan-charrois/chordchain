# Spec 010 — Create Debug Panel

## Goal

Add a self-contained debug panel pinned to the side of the screen with show/hide behavior, daily puzzle diagnostics, and a debug reset action that clears today's local storage progress and resets game state.

## Why This Exists

As daily puzzle and history mechanics expand, development and QA need a fast way to inspect active puzzle data and force a clean "today" run without manual localStorage editing.

## Scope

In scope:

- Side-pinned debug panel UI.
- Show/hide control for the panel.
- Render current daily puzzle debug details.
- Add debug reset action that:
  - removes today's puzzle completion/history entry from local storage (if present)
  - resets in-memory game state.
- Keep panel implementation self-contained.

Out of scope:

- Production analytics tooling.
- Multi-user admin tools.
- Remote debugging APIs.
- New dependencies.

## Product Behavior

- Debug panel is visible in development workflow and can be collapsed/expanded.
- Panel stays pinned to a screen edge and does not block core gameplay interactions unnecessarily.
- Panel displays current puzzle internals (date, key, mode, target progression, status/history snapshot).
- Clicking debug reset clears today's persisted progress and starts a clean game for the same date.

## Functional Requirements

### R1: Side-pinned debug panel container

- Render panel as a sidecar (left or right edge) with fixed positioning relative to viewport.
- Panel should remain accessible while scrolling/resizing.
- Keep dimensions constrained and readable on desktop; degrade gracefully on smaller screens.

### R2: Show/hide functionality

- Provide explicit toggle control to show/hide debug panel.
- Hidden state should not unmount required app state providers.
- Toggle state can be local component state (no persistence required unless explicitly added later).

### R3: Required debug content

Panel must render at least:

- Active puzzle date.
- Active puzzle key and mode.
- Active target progression (chords list).
- Current game status (`new`, `started`, `won`, `loss`).
- Guess counters (submitted guesses and limits).
- Today's history entry snapshot (completed flag, attempts used, completed timestamp if present).

### R4: Debug reset action (today only)

- Add a button in the panel: `Reset Today` (or similar).
- Action must:
  - clear today's entry from puzzle history store in localStorage if it exists
  - preserve other dates in history store
  - reset current game state through existing game reset pathway
- Operation must be idempotent and non-crashing if no today entry exists.

### R5: Self-contained implementation

- Debug panel should be encapsulated as its own component/module.
- Keep business logic for debug operations localized in panel-related utility or handler code.
- Integrate with game context through explicit props/hooks only (avoid spreading debug logic across unrelated components).

### R6: Safety and environment behavior

- Debug actions must not delete entire localStorage by default.
- Only targeted key/entry mutation is allowed for today reset.
- If desired, gate panel visibility to dev environments; if ungated, maintain low-visual-noise default collapsed state.

## UX/Behavior Expectations

- Panel is easy to discover but does not dominate gameplay UI.
- Debug information updates live as game state changes.
- Reset feedback is clear (for example status text or updated values after reset).

## Technical Constraints

- Preserve existing architecture and state boundaries.
- Reuse existing history utility functions where possible (`read/write` and typed store handling).
- Continue using Mantine components for layout and controls.
- No new npm dependencies.

## Suggested Files To Inspect

- `app/components/Game/GameProvider.tsx`
- `app/components/Game/context/GameContext.tsx`
- `app/components/Board/Board.tsx`
- `app/utils/puzzleHistory.ts`
- `app/utils/date.ts`
- optional new component file under `app/components/` (for example `DebugPanel/`)

## Suggested Data/Handler Shape

```ts
type DebugPanelProps = {
  activePuzzleDate: string
  keyLabel: string
  modeLabel: string
  target: string[]
  status: string
  guessCount: number
  maxGuesses: number
  historyEntry?: {
    completed: boolean
    attemptsUsed?: number
    completedAt?: string
  }
  onResetToday: () => void
}
```

## Acceptance Criteria

1. Debug panel is pinned to screen side and can be shown/hidden.
2. Panel renders current daily puzzle debug info (date, key/mode, progression).
3. Panel renders live game status and guess metrics.
4. `Reset Today` clears only today's puzzle history entry in localStorage.
5. `Reset Today` resets in-memory game state using existing reset path.
6. Other days' history entries remain intact after reset.
7. App remains stable if today entry does not exist.
8. Typecheck and build pass.

## Test Requirements

Add or update tests for:

- Debug panel toggle behavior.
- Debug data rendering from game state.
- Reset handler removes only today's history entry.
- Reset handler triggers game reset state.
- Idempotent reset behavior when today's entry is missing.

If UI automation is unavailable, add unit tests for reset logic and include manual verification notes for panel interactions.

## Definition of Done

- Acceptance criteria satisfied.
- No unrelated refactors.
- `npm run typecheck` passes.
- `npm run build` passes.
- Added tests pass, or blockers are documented with evidence.

## Deliverable for Implementation Task

Produce a focused PR-sized diff that adds a self-contained side debug panel with show/hide controls, daily puzzle diagnostics, and a `Reset Today` action that clears today's persisted progress and resets game state.
