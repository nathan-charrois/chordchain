# Spec 018 — Daily Puzzle Difficulty

## Goal

Add a difficulty value to each daily puzzle and use it to communicate puzzle complexity and constrain the chord palette available during gameplay.

## Why This Exists

The daily puzzle catalog currently defines the puzzle name, target, key, and mode, but every puzzle exposes the full generated chord palette. That makes easy puzzles look more complex than intended and gives players more possible inputs than the puzzle design requires. A puzzle-level difficulty lets the app show expectations clearly and progressively limit available chord groups.

## Scope

In scope:

- Add a `difficulty` field to daily puzzle catalog entries.
- Support exactly three difficulty values:
  - `Easy`
  - `Medium`
  - `Hard`
- Expose the resolved difficulty on `DailyPuzzle`.
- Render the difficulty below the puzzle name.
- Use puzzle difficulty to determine which palette sections are enabled.
- Keep disabled palette sections visible or clearly unavailable, based on the existing UI pattern chosen during implementation.
- Preserve existing key/mode, hint, history, grading, and board behavior.

Out of scope:

- Changing target sequences or puzzle names.
- Generating new daily puzzles.
- Changing chord grading logic.
- Changing guess count or sequence length.
- Changing hint unlock rules for key and mode.
- Route, auth, database, deployment, or CI changes.
- New npm dependencies.

## Product Behavior

- Each daily puzzle has a visible difficulty: `Easy`, `Medium`, or `Hard`.
- The board renders difficulty directly below the puzzle name.
- Easy puzzles only allow chords from the `Diatonic` section.
- Medium puzzles allow chords from `Diatonic` and `Secondary/Dominant` sections.
- Hard puzzles allow chords from all palette sections.
- Players cannot add chords from palette sections disabled by the active puzzle difficulty.
- Switching daily/history puzzles updates the displayed difficulty and enabled palette sections for the newly active puzzle.
- Completed selected puzzles still display their difficulty.

## Functional Requirements

### R1: Difficulty model

- Add a typed difficulty model, suggested as `DailyPuzzleDifficulty = 'Easy' | 'Medium' | 'Hard'`.
- Add `difficulty` to the `DailyPuzzle` type.
- Add `difficulty` to daily puzzle catalog entries.
- Resolve catalog entries so every active puzzle has a valid difficulty.
- If a catalog entry is missing or has malformed difficulty, use a deterministic fallback and avoid crashing.
- Suggested fallback is `Medium`, because it preserves a moderate existing palette surface while making the missing value obvious during review.

### R2: Catalog data

- Every explicit daily puzzle catalog entry must define `difficulty`.
- Difficulty should be part of puzzle authoring data, not inferred from target chord qualities at runtime.
- Historical puzzle selection must preserve the original puzzle's difficulty for that date.
- `resolveDailyPuzzle` fallback behavior must continue to return a complete `DailyPuzzle`, including difficulty.

### R3: Board difficulty display

- Render the active puzzle difficulty below the existing puzzle name.
- Minimum label content: `Difficulty: Easy`, `Difficulty: Medium`, or `Difficulty: Hard`.
- The difficulty display must update when selecting a different daily/history puzzle.
- Keep the styling consistent with the current board card; avoid a broad visual redesign.
- Difficulty should remain visible in playable, won, loss, and completed view-only states.

### R4: Palette section gating

- Gate palette sections from the active puzzle difficulty:
  - `Easy`: enable `Diatonic` only.
  - `Medium`: enable `Diatonic` and `Secondary/Dominant`.
  - `Hard`: enable `Diatonic`, `Secondary/Dominant`, and `Extensions`.
- Disabled sections must not allow chord input.
- Disabled chords must not be accepted through `addCurrent`, even if a future UI bug leaves a disabled button clickable.
- The source of truth for accepted chords must be the provider/context game state, not only button disabled props.
- Section titles must continue to use the existing labels: `Diatonic`, `Secondary/Dominant`, and `Extensions`.

### R5: Palette UI behavior

- Enabled sections should behave exactly as they do today.
- Disabled sections may either:
  - remain visible with disabled buttons and muted styling, or
  - be hidden if the UI clearly communicates which sections are enabled for the active difficulty.
- Prefer visible disabled sections if it makes difficulty progression clearer without cluttering the layout.
- Undo and Enter controls should remain governed by game status and existing submission rules, not directly by difficulty.
- Existing per-chord status styling for prior guesses should still render for enabled chords.

### R6: Target validation compatibility

- Puzzle target validation must use the difficulty-gated palette for the active puzzle.
- Every catalog target must be valid for its declared difficulty.
- If a puzzle target contains a chord outside the enabled sections for its difficulty, the existing safe fallback/warning behavior must remain deterministic and should identify the puzzle date.
- Do not silently broaden an Easy or Medium puzzle to accept more sections just because the target is invalid.

### R7: Context and component boundaries

- Keep daily puzzle data ownership in `app/utils/dailyPuzzle.ts`.
- Keep palette acceptance rules in the game provider/context layer so UI and validation use the same allowed chord set.
- Keep palette rendering in the existing `Pallete` component unless a small helper improves clarity.
- Reuse `getPaletteSections` and `flattenPaletteSections` where practical.
- Avoid adding broad new abstractions for a three-level difficulty mapping.

## UX/Behavior Expectations

- Difficulty is visible where players already look for puzzle identity.
- Easy puzzles present a smaller, less noisy chord surface.
- Medium puzzles introduce secondary/dominant options without exposing extensions.
- Hard puzzles preserve the full current palette behavior.
- Puzzle switching does not leave stale enabled sections from the previous puzzle.
- Disabled or hidden palette sections should not make the layout feel broken or incomplete.

## Technical Constraints

- Preserve existing game provider and context architecture.
- No new npm dependencies.
- Do not change routing, database schema, auth, deployment config, or CI.
- Keep the diff focused to daily puzzle data/types, game palette derivation, board display, palette UI, and tests.
- Use only scripts already defined in `package.json`.
- Avoid unrelated refactors or visual redesign.

## Suggested Implementation Notes

- Add a small helper such as `normalizeDifficulty` in `dailyPuzzle.ts`.
- Add a helper such as `getEnabledPaletteSectionIds(difficulty)` or `getPaletteSectionsForDifficulty(sections, difficulty)` near the existing palette utilities or game logic.
- Consider representing section IDs separately from display titles to avoid coupling rules to UI text.
- Derive `paletteChords` from difficulty-enabled sections, not from all generated sections.
- Pass enough section availability metadata to `Pallete` so it can disable or hide unavailable sections consistently.
- Add a development warning when a catalog target uses chords outside the difficulty-enabled palette.

## Acceptance Criteria

1. `DailyPuzzle` includes a typed difficulty value of `Easy`, `Medium`, or `Hard`.
2. Every daily puzzle catalog entry defines a difficulty.
3. `resolveDailyPuzzle` always returns a puzzle with a valid difficulty, including fallback dates.
4. The board renders `Difficulty: <value>` below the puzzle name.
5. Changing the selected puzzle updates the displayed difficulty.
6. Easy puzzles enable only the `Diatonic` palette section.
7. Medium puzzles enable `Diatonic` and `Secondary/Dominant` palette sections.
8. Hard puzzles enable `Diatonic`, `Secondary/Dominant`, and `Extensions` palette sections.
9. Chords from disabled sections cannot be added to the current guess.
10. Catalog target validation respects difficulty-gated allowed chords.
11. Existing hint, history selection, guessing, grading, reset, win, and loss behavior are unchanged.
12. Typecheck and build pass.

## Definition of Done

- Acceptance criteria satisfied.
- No unrelated refactors.
- `npm run typecheck` passes.
- `npm run build` passes.
- Added tests pass, or blockers are clearly documented with evidence.
- The final diff is small enough for human review.

## Deliverable for Implementation Task

Produce a focused PR-sized diff that adds daily puzzle difficulty data, displays the active difficulty below the puzzle name, and gates available palette sections by Easy/Medium/Hard while preserving existing gameplay behavior.
