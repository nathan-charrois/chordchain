# Spec 007 — Common Modes and Mode-Aware On-Screen Keyboard

## Goal

Implement support for all common diatonic modes in gameplay and make the on-screen keyboard (palette) dynamically show chords available for the current key and mode.

## Why This Exists

The game currently uses a mostly fixed chord palette and does not consistently derive available chords from the active puzzle's key/mode. This limits musical correctness and weakens puzzle variety.

## Scope

In scope:

- Support all common diatonic modes:
  - Ionian
  - Dorian
  - Phrygian
  - Lydian
  - Mixolydian
  - Aeolian
  - Locrian
- Generate mode-correct diatonic chord set for current key/mode.
- Render keyboard/palette buttons from generated chord set instead of static chord list.
- Keep puzzle target and palette aligned to same key/mode context.

Out of scope:

- Non-diatonic borrowing/chromatic substitutions.
- Extended jazz harmony (7ths/9ths/altered dominants) unless already in puzzle data model.
- Custom tuning/temperament systems.
- New dependencies.

## Product Behavior

- Each active puzzle includes key + mode metadata.
- The board/palette shows available chords for that exact key/mode.
- Player can only select chords shown by current keyboard/palette.
- Changing active puzzle date (and therefore key/mode) updates available chords automatically.

## Functional Requirements

### R1: Mode normalization

- Define canonical mode IDs (lowercase):
  - `ionian`, `dorian`, `phrygian`, `lydian`, `mixolydian`, `aeolian`, `locrian`
- Accept display labels in UI (`Ionian`, etc.) while internal logic uses canonical IDs.
- Unknown mode values must fail safely to a deterministic default (`ionian`) and log a non-fatal warning.

### R2: Diatonic scale and chord derivation

- Build scale degrees from root pitch class + mode interval pattern.
- Derive triads for scale degrees 1..7 using mode-consistent interval stacking (1-3-5 over scale degrees).
- Chord quality must be determined from generated triad intervals, not hardcoded by degree tables alone.
- Chord naming must be stable and user-readable (for example: `C`, `Dm`, `Bdim`).

### R3: Palette generation from key/mode

- Replace static hardcoded palette chord list with generated chord list for active puzzle key/mode.
- Palette should preserve existing control actions:
  - chord buttons
  - Undo
  - Enter
- Chord button order should be deterministic and musically sensible (scale-degree order 1..7).

### R4: Puzzle and palette alignment

- Active puzzle target chords must be representable by generated palette for the puzzle's key/mode.
- If target includes chord not in generated palette, app should fail safely with a clear non-crashing fallback path and log.

### R5: UI key/mode display consistency

- On-screen key/mode display (for example in scale/header area) must come from active puzzle metadata.
- Display formatting should be consistent (for example `C Major, Ionian` or `C Ionian`).

### R6: History/date compatibility

- Mode-aware palette must work with daily puzzle selection flow.
- Opening prior dates (if supported by UI flow) should use that date's key/mode for palette generation.

## UX/Behavior Expectations

- Palette updates are immediate and flicker-free when active puzzle changes.
- Mode differences are reflected in available chord qualities.
- Existing gameplay flow (guess entry, submit, status coloring) continues to work.

## Technical Constraints

- Reuse existing music utility patterns where possible.
- Preserve architecture boundaries between game state, utils, and UI components.
- No route/deployment/CI changes.
- No new npm dependencies.

## Suggested Files To Inspect

- app/utils/music.ts
- app/utils/dailyPuzzle.ts
- app/components/Game/context/GameContext.tsx
- app/components/Game/GameProvider.tsx
- app/components/Pallete/Pallete.tsx
- app/components/PalleteButton/PalleteButton.tsx
- app/components/Scale/Scale.tsx

## Suggested Data Shapes

```ts
type ModeId =
  | 'ionian'
  | 'dorian'
  | 'phrygian'
  | 'lydian'
  | 'mixolydian'
  | 'aeolian'
  | 'locrian'

type DailyPuzzle = {
  date: string
  target: string[]
  key: string
  mode: string // normalized to ModeId at runtime
}
```

## Acceptance Criteria

1. All seven common diatonic modes are supported for puzzle metadata and palette generation.
2. Palette chord buttons are generated dynamically from active puzzle key/mode.
3. Static hardcoded chord rows are removed for gameplay chord selection.
4. Generated palette remains deterministic and ordered by scale degree.
5. Scale/key label in UI matches active puzzle key/mode metadata.
6. Invalid/unknown mode values do not crash app and use deterministic fallback.
7. Typecheck and build pass.

## Test Requirements

Add or update tests for:

- Scale generation per mode (all seven modes).
- Triad quality derivation and chord-name mapping.
- Palette generation for representative keys/modes.
- Unknown mode fallback behavior.
- Integration: active puzzle change updates palette set.

If full component tests are not available, add unit tests for generation logic and document any remaining UI-test gap.

## Definition of Done

- Acceptance criteria satisfied.
- No unrelated refactors.
- `npm run typecheck` passes.
- `npm run build` passes.
- Added tests pass, or blockers are documented with evidence.

## Deliverable for Implementation Task

Produce a focused PR-sized diff that adds common mode support and makes the on-screen keyboard/palette fully key+mode aware.
