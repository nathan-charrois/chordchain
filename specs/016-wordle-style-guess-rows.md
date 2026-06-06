# Spec 016 — Wordle-Style Guess Rows

## Goal

Update the game board to display a fixed set of guess rows, similar to Wordle, so players can see all four available attempts from the start of the puzzle.

## Why This Exists

The current board only renders submitted guesses and the current in-progress guess when those values exist. This makes the attempt limit less visible and gives the board less structure before the player starts. Since the game allows four guesses, the board should render four rows on load and populate each row as the player submits guesses.

## Scope

In scope:

- Render four guess rows on initial board load.
- Populate rows with submitted guesses as the player submits them.
- Show the active input row in the next available guess position.
- Preserve existing per-chord status colors for submitted guesses.
- Preserve existing current-entry behavior before submission.
- Keep the layout responsive and consistent with the current board styling.

Out of scope:

- Changing the number of allowed guesses.
- Changing chord grading logic.
- Changing win/loss rules.
- Changing keyboard/palette behavior.
- Persisting incomplete guess rows across refresh.
- Route, auth, database, deployment, or CI changes.
- New npm dependencies.

## Product Behavior

- On puzzle load, the board displays exactly four guess rows.
- Empty rows are visible placeholders before any guess is submitted.
- The first row is the active row before the first submission.
- When a player submits a guess, that row becomes a submitted row with graded chord statuses.
- The next row becomes active until the player submits another guess or the game ends.
- Submitted rows remain visible in their original order.
- Empty remaining rows stay visible after submitted rows.
- When the game is won before all four guesses are used, remaining rows stay visible but inactive.
- When the game is lost, all four submitted rows are visible.
- Completed view-only puzzle state should still render the row layout without enabling replay.

## Functional Requirements

### R1: Fixed row count

- Render rows based on `maxGuesses`, currently `4`, rather than only `guesses.length`.
- The board must show four rows immediately on initial load.
- Row count should continue to derive from existing game constants/state so future limit changes do not require duplicate updates.
- Do not hard-code unrelated game values into presentational components.

### R2: Submitted rows

- A submitted row renders the submitted guess chords in order.
- A submitted row renders each chord with its existing status:
  - `correct`
  - `present`
  - `absent`
- Submitted row status colors must remain consistent with the existing badge/cell styling.
- Submitted rows must not be editable.

### R3: Active row

- The active row is the next unsubmitted row while the game is playable.
- The active row renders the current in-progress chord entry.
- Empty cells in the active row should remain visible until filled.
- The active row should be visually distinguishable enough that the player can identify where the current guess is being built.
- If the game is over, no empty row should appear interactive or active.

### R4: Empty rows and cells

- Empty rows render visible placeholder cells for the target sequence length.
- Placeholder cells should not imply correctness, presence, or absence.
- Empty cells should use neutral styling distinct from submitted status colors.
- Row and cell spacing should avoid layout shift as guesses are entered.

### R5: Sequence length

- Each row should render one cell per expected chord in the puzzle sequence.
- The expected cell count should align with the existing maximum chord count used for guess validation.
- If implementation derives sequence length from the active target, it must remain stable for the active puzzle.

### R6: End-state compatibility

- Winning on an early guess should keep submitted rows visible and leave later rows as inactive placeholders.
- Losing after four guesses should show all four submitted rows.
- Resetting the current puzzle should return to four empty rows.
- Switching daily/history puzzles should return to row state appropriate for the selected puzzle.
- Completed selected puzzles from history should remain blocked by existing completed-state rules.

### R7: Component structure

- Prefer extracting a focused guess-row or guess-grid component if it keeps `Board.tsx` readable.
- Keep game state ownership in the existing provider/context architecture.
- Keep row rendering presentation-focused; do not move grading or submission rules into UI components.
- Use existing types such as `Guess`, `GuessStatus`, and game constants where practical.

## UX/Behavior Expectations

- The board resembles a Wordle-style grid: fixed attempts, stable rows, and clear progression.
- Players can immediately see that they have four guesses.
- The active row communicates current input without replacing submitted rows.
- The empty state should look intentional, not like missing content.
- The layout should remain usable on mobile and desktop.

## Technical Constraints

- Preserve existing game provider and context architecture.
- No new npm dependencies.
- Do not change routing, database schema, auth, deployment config, or CI.
- Keep the diff focused to board rendering and tests.
- Prefer existing Mantine components and existing CSS classes before adding new styling.
- Avoid broad visual redesign beyond the fixed guess-row layout.

## Suggested Implementation Notes

- Build a row model from:
  - submitted guesses
  - current guess
  - `maxGuesses`
  - expected sequence length
  - game status
- Render each row from that model rather than branching separately for submitted/current/empty lists.
- Keep submitted guess status rendering based on existing status values.
- Use stable row keys such as row index plus row state; do not key rows by mutable chord input alone.

## Acceptance Criteria

1. The board renders four guess rows on initial load before the player enters any chords.
2. Each row renders the expected number of chord cells.
3. The first row displays the current in-progress guess before first submission.
4. Submitting a guess populates the current row with graded status cells.
5. After submission, the next row becomes the active current-entry row.
6. Empty unused rows remain visible as neutral placeholders.
7. Winning before four guesses keeps remaining rows visible and inactive.
8. Losing after four guesses shows all four submitted rows.
9. Resetting or switching puzzles clears transient rows according to existing state reset rules.
10. Existing grading, submit validation, hint, playback, history, and end-state behavior are unchanged.
11. Typecheck and build pass.

## Definition of Done

- Acceptance criteria satisfied.
- No unrelated refactors.
- `npm run typecheck` passes.
- `npm run build` passes.
- Added tests pass, or blockers are clearly documented with evidence.
- The final diff is small enough for human review.

## Deliverable for Implementation Task

Produce a focused PR-sized diff that updates the board to render a fixed four-row Wordle-style guess grid, with rows populated by submitted guesses and the current active guess while preserving existing gameplay behavior.
