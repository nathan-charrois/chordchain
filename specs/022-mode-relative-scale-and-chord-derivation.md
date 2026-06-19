# Spec 022 — Mode-Relative Scale and Chord Derivation

## Goal

Refactor puzzle authoring and gameplay so scales, chords, answer progressions, and palette sections are derived from a puzzle's key, mode, difficulty, and mode-relative scale degrees.

Puzzle definitions must no longer store concrete chord names. A progression stores degree numbers that refer to positions inside the selected mode, allowing the same progression pattern to produce different concrete chords for different keys and modes.

## Why This Exists

The current daily puzzle catalog stores concrete target strings such as `Cmaj`, `Dm`, and `G7`. The music utility layer separately generates string-only palette sections, and game logic normalizes puzzle targets against those generated strings. This duplicates musical information and allows puzzle answers, palette choices, chord notes, naming, and playback to drift apart.

A mode-relative model makes puzzle data describe musical intent instead of rendered chord labels. The daily puzzle's `key`, `mode`, and `progression` are the source of truth and the internal musical language used across the app.

Concrete scale notes, chord names, chord notes, and palette display items are projections of that source. They should be derived close to the component or playback boundary that needs them, not promoted into shared application state.

## Current Implementation Review

### Puzzle data

- `app/utils/dailyPuzzle.ts` defines `DailyPuzzle.target` and catalog entry `target` as `string[]`.
- Every catalog entry hard-codes concrete chord names.
- Difficulty currently uses title-case values: `Easy`, `Medium`, and `Hard`.
- `getEnabledPaletteSectionIds` maps difficulty to the existing `diatonic`, `secondaryDominant`, and `extensions` sections.

### Music derivation

- `app/utils/music.ts` contains mode interval data under `SCALE_INTERVALS`.
- Scale generation currently returns numeric pitch classes rather than spelled scale-note names.
- Native triads and sevenths are generated separately and returned as strings.
- Secondary dominants are generated chromatically.
- Chord-to-note conversion later reparses a chord name to recover root and quality.
- Major triads currently render with a `maj` suffix, such as `Cmaj`.

### Game state and UI

- `Chord` is currently an alias for `string`.
- `GameProvider` separately derives palette strings and puzzle target strings.
- `getPuzzleTarget` validates hard-coded puzzle target names against the generated palette and falls back when they do not match.
- `Pallete` renders string arrays and currently shows a hard-coded `iv` sublabel.
- Guess grading, history persistence, and sequence playback all consume concrete chord strings.

### Debug panel

- `DebugPanel` renders selected fields from `activePuzzle`.
- It currently shows the original concrete `target` but does not distinguish source puzzle data from derived musical data.

## Problem Statement

Puzzle data should contain only the information that must be authored:

- date;
- name;
- key;
- mode;
- difficulty;
- a progression of mode-relative degree and chord-type instructions.

All concrete musical data must be derived from that source. Gameplay should continue to speak in mode-relative `{ degree, type }` identities. Components should use shared pure music-theory helpers to derive concrete display or playback data locally.

Derived data must not be:

- added to the resolved daily puzzle model;
- stored in game or session state;
- exposed through game context;
- persisted in local storage;
- passed between components as an alternate chord model.

Backwards compatibility is not required. Existing hard-coded target data and incompatible persisted guess data may be removed rather than migrated.

## Canonical Example

Puzzle definition:

```ts
{
  date: '2026-05-23',
  name: 'Open Roads',
  key: 'C',
  mode: 'mixolydian',
  difficulty: 'easy',
  progression: [
    { degree: 1, type: 'triad' },
    { degree: 7, type: 'triad' },
    { degree: 4, type: 'triad' },
    { degree: 1, type: 'triad' },
  ],
}
```

Derived scale:

```ts
['C', 'D', 'E', 'F', 'G', 'A', 'Bb']
```

Derived concrete progression names:

```ts
['C', 'Bb', 'F', 'C']
```

The derived degree-seven triad:

```ts
{
  name: 'Bb',
  degree: 7,
  type: 'triad',
  notes: ['Bb', 'D', 'F'],
}
```

## Scope

In scope:

- Replace hard-coded puzzle targets with mode-relative progression instructions.
- Add one typed music-theory derivation layer.
- Derive correctly spelled scale notes from key and mode.
- Derive chord notes by applying scale-step recipes with wrapping.
- Derive chord names from the resulting notes and requested chord type.
- Derive concrete answer labels and notes locally where they are displayed or played.
- Derive difficulty-allowed palette sections.
- Update game state to use mode-relative chord identities.
- Update UI components to derive their own concrete display data from the active puzzle.
- Update playback to derive notes at the playback boundary.
- Update persisted guesses to use the new chord identity model.
- Update the debug panel to show original puzzle data and derived data.
- Remove obsolete target normalization, old palette generation, secondary-dominant generation, and hard-coded chord catalog data.

Out of scope:

- Chromatic secondary dominants or borrowed chords.
- Chord types beyond `triad`, `seventh`, `sus2`, and `sus4`.
- User-authored custom scales, modes, or chord recipes.
- Microtonal notes or alternate tuning systems.
- Changing sequence length, guess count, grading rules, routing, auth, deployment, or CI.
- New npm dependencies.

## Required Data Model

### Puzzle authoring types

```ts
// music.ts
type ModeId =
  | 'ionian'
  | 'dorian'
  | 'phrygian'
  | 'lydian'
  | 'mixolydian'
  | 'aeolian'
  | 'locrian'

type PuzzleDifficulty = 'easy' | 'medium' | 'hard'

type ChordType = 'triad' | 'seventh' | 'sus2' | 'sus4'

type ChordDegree = 1 | 2 | 3 | 4 | 5 | 6 | 7

type ChordId = {
  degree: ChordDegree
  type: ChordType
}

// dailyPuzzle.ts
type PuzzleDefinition = {
  date: string
  name: string
  key: string
  mode: ModeId
  difficulty: PuzzleDifficulty
  progression: ChordId[]
}
```

Catalog entries use `PuzzleDefinition` and must not contain `target`, concrete chord names, chord notes, or precomputed palette data.

### Daily puzzle type

```ts
type DailyPuzzle = PuzzleDefinition
```

`resolvePuzzleEntry` normalizes and returns source puzzle data only. It must not attach a scale, concrete solution, chord names, chord notes, or palette sections.

Game context exposes the active `DailyPuzzle`. Its `key`, `mode`, and `progression` are the shared musical contract.

### Component-local derived types

```ts
type DisplayChord = {
  name: string
  notes: string[]
}

type DisplayPaletteSections = {
  triad: DisplayChord[]
  seventh: DisplayChord[]
  extension: DisplayChord[]
}
```

These types describe temporary values produced by a component for rendering or playback. They are not part of `DailyPuzzle`, game context, session state, or the storage schema.

### Stable gameplay and persistence identity

- A chord selection's stable identity is its `degree + type` pair within the active puzzle's key and mode.
- Game state, guesses, answer comparison, and component communication use `ChordId`.
- A component may temporarily derive `DisplayChord` values from `activePuzzle.key`, `activePuzzle.mode`, and a `ChordId`.
- Guess comparison must compare stable chord identity, not object reference.
- Persisted guesses store only serializable chord identities (`degree` and `type`), never duplicated names and notes.
- Guess feedback statuses are deterministic and must not be stored in session or puzzle history.
- On history load, persisted identities remain identities in session state. The component that renders or plays them derives concrete data when needed.
- Because backwards compatibility is not required, increment the puzzle-history storage version or otherwise discard entries using the old string-based guess schema.

## Data Flow

The required flow is:

```text
DAILY_PUZZLE_CATALOG
  -> resolveDailyPuzzle(date)
  -> DailyPuzzle { key, mode, progression, difficulty, metadata }
  -> GameProvider / GameContext
  -> session and history use ChordId values only
  -> each consumer derives its local concrete view
```

Consumer responsibilities:

```text
Board
  activePuzzle.key + activePuzzle.mode
  + guess/progression ChordId values
  -> local chord names for cells and answer reveal

Pallete
  activePuzzle.key + activePuzzle.mode + activePuzzle.difficulty
  -> local palette identities
  -> local names and notes for buttons

Scale
  activePuzzle.key + activePuzzle.mode
  -> local scale-note labels

SequenceProvider / audio boundary
  activePuzzle.key + activePuzzle.mode
  + progression/guess ChordId values
  -> local chord notes
  -> playback

DebugPanel
  activePuzzle
  -> local scale, concrete progression, and palette diagnostics

puzzleHistory
  submitted ChordId values
  -> localStorage
```

The arrows into components carry source puzzle data and chord identities. They must not carry pre-derived `DisplayChord`, scale, solution, or palette objects from another component or from the provider.

Shared pure helpers prevent duplicated theory logic. Calling the same helper independently in multiple components is preferred over caching its concrete result in shared state.

A feature component may pass a final primitive render value such as button text to an immediate presentational child. It must not pass reusable derived music objects upward, through context, or across feature boundaries.

## Derivation Constants

Use these mode interval formulas:

```ts
const MODE_INTERVALS = {
  ionian: [0, 2, 4, 5, 7, 9, 11],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  aeolian: [0, 2, 3, 5, 7, 8, 10],
  locrian: [0, 1, 3, 5, 6, 8, 10],
} as const
```

Use scale-step recipes, not chromatic interval recipes, to select native chord notes:

```ts
const CHORD_RECIPES = {
  triad: [0, 2, 4],
  seventh: [0, 2, 4, 6],
  sus2: [0, 1, 4],
  sus4: [0, 3, 4],
} as const
```

Use difficulty to determine available chord types:

```ts
const DIFFICULTY_CHORD_TYPES = {
  easy: ['triad'],
  medium: ['triad', 'seventh'],
  hard: ['triad', 'seventh', 'sus2', 'sus4'],
} as const
```

## Functional Requirements

### R1: Replace puzzle target data

- Remove `target: string[]` from `DailyPuzzle` and catalog entry types.
- Remove every hard-coded puzzle chord-name array from `DAILY_PUZZLE_CATALOG`.
- Add `progression: ChordId[]` to every catalog entry.
- Every progression degree must be an integer from 1 through 7.
- Every progression type must be one of the supported `ChordType` values.
- Every puzzle progression must contain the existing required answer length.
- Convert difficulty values to canonical lowercase IDs: `easy`, `medium`, and `hard`.
- Difficulty display components may format those IDs as `Easy`, `Medium`, and `Hard`.
- Catalog authoring must remain the source of truth for progression patterns; do not derive a puzzle's progression pattern from its name, date, or previous concrete target.

### R2: Derive scale notes from key and mode

- Add a pure function equivalent to:

```ts
buildScale(key: string, mode: ModeId): string[]
```

- Use `MODE_INTERVALS[mode]` relative to the normalized key tonic.
- Return exactly seven note names in scale-degree order.
- Note spelling must preserve diatonic letter order rather than selecting labels only from a flat-first chromatic array.
- Accidentals must be deterministic and musically readable:
  - `C Mixolydian` produces `C, D, E, F, G, A, Bb`.
  - `G Ionian` produces `G, A, B, C, D, E, F#`.
- Support natural, sharp, and flat tonic names used by the app.
- Normalize enharmonic input deterministically without producing duplicate scale-degree letters.
- Invalid key or mode input must use the existing deterministic fallback policy and emit a non-fatal warning.

### R3: Derive chord notes from scale degree and type

- Add a pure function equivalent to:

```ts
buildChord(
  scale: string[],
  chord: ChordId,
): DisplayChord
```

- Convert the one-based degree to a zero-based scale index.
- Select notes using `CHORD_RECIPES[chord.type]`.
- Each recipe offset is relative to the chord root's index inside the selected mode.
- Wrap every selected index modulo seven.
- Preserve note order with the chord root first.
- Do not use `CHORD_INTERVALS` to choose native chord notes.
- Example in C Mixolydian:
  - degree 7 triad produces `Bb, D, F`;
  - degree 7 seventh produces `Bb, D, F, A`.
- Invalid degrees, chord types, or malformed scales must fail deterministically and must not silently return an unrelated chord.

### R4: Derive chord names

- Name the chord from its root note, derived notes, and requested type.
- Determine triad and seventh quality by measuring chromatic intervals between the derived note names after scale-step selection.
- Apply these exact naming rules:
  - major triad: `C`;
  - minor triad: `Cm`;
  - diminished triad: `Bdim`;
  - major seventh: `Cmaj7`;
  - minor seventh: `Cm7`;
  - dominant seventh: `C7`;
  - half-diminished seventh: `Bm7b5`;
  - suspended second: `Csus2`;
  - suspended fourth: `Csus4`.
- Major triads must not use the old `maj` suffix.
- Suspended names are determined by the requested type after notes are derived from the mode-relative recipe.
- Keep naming logic centralized; UI components must not append or parse quality suffixes.
- A future add-chord type should follow names such as `Cadd9`, but `add9` is not part of the generated palette in this spec.
- If a derived note set does not match a supported quality for its type, fail clearly in development rather than silently naming it as a different supported quality.

### R5: Keep the authored progression as the gameplay answer

- `activePuzzle.progression` is the answer used by session state and grading.
- Do not create or store a separate concrete `solution`.
- Compare submitted `ChordId[]` values directly with `activePuzzle.progression`.
- Preserve repeated degrees and types.
- Validate authored progression types against the puzzle difficulty:
  - `easy` answers may use only `triad`;
  - `medium` answers may use `triad` or `seventh`;
  - `hard` answers may use any supported type.
- Invalid authored puzzle data should identify the puzzle date and fail clearly during development. It must not replace the answer with the first palette chords.
- Components that need concrete answer data may locally call a pure helper equivalent to:

```ts
buildDisplayProgression(
  key: string,
  mode: ModeId,
  progression: ChordId[],
): DisplayChord[]
```

- `Board`, `DebugPanel`, and the playback boundary call this helper independently when they need names or notes.
- The resulting `DisplayChord[]` must remain local to the caller.
- Remove `normalizeChordLabel` and the current invalid-target fallback path from puzzle answer generation.

### R6: Derive palette sections

- Add a pure identity helper equivalent to:

```ts
buildPaletteChordIds(
  difficulty: PuzzleDifficulty,
): {
  triad: ChordId[]
  seventh: ChordId[]
  extension: ChordId[]
}
```

- For each chord type allowed by `DIFFICULTY_CHORD_TYPES[difficulty]`, produce one `ChordId` for every scale degree 1 through 7.
- Keep degree order deterministic within each section.
- Return these exact section keys:

```ts
{
  triad: [],
  seventh: [],
  extension: [],
}
```

- Section mapping:
  - `triad` contains type `triad`;
  - `seventh` contains type `seventh`;
  - `extension` contains types `sus2` and `sus4`.
- Within `extension`, render all `sus2` chords in degree order followed by all `sus4` chords in degree order.
- Easy palettes contain seven triads and empty `seventh`/`extension` arrays.
- Medium palettes contain seven triads, seven sevenths, and an empty `extension` array.
- Hard palettes contain seven triads, seven sevenths, seven `sus2` chords, and seven `sus4` chords.
- Do not generate secondary dominants or other chromatic chords.
- `Pallete` derives its local scale, maps these identities through `buildChord`, and renders temporary `DisplayPaletteSections`.
- `DebugPanel` independently performs the same derivation for diagnostics.
- Provider/session input validation must not receive the rendered palette. It validates a `ChordId` directly by checking:
  - degree is 1 through 7; and
  - type is included in `DIFFICULTY_CHORD_TYPES[activePuzzle.difficulty]`.

### R7: Establish local derivation boundaries

- Keep authoring and date/slug resolution in `app/utils/dailyPuzzle.ts`.
- Put reusable music-theory constants, note spelling, chord derivation, naming, progression derivation, and palette derivation in the utility layer.
- `resolvePuzzleEntry` returns a normalized `DailyPuzzle` containing source data only.
- `GameProvider` remains the composition root for route selection, history, session state, and exposing the active source puzzle through context.
- `GameProvider` must not derive or expose `scale`, `solution`, concrete chord names/notes, or display palette sections.
- Components read `activePuzzle` and relevant `ChordId` values from context, then derive their own display data with `useMemo` where useful.
- Do not pass a component's derived result to sibling components or lift it into context merely to avoid repeating a pure helper call.
- Playback derivation belongs in `SequenceProvider` or the lowest practical audio boundary because that is where notes become necessary.
- Remove obsolete or duplicate functions after all consumers use the new layer, including old string-only palette generation and target normalization paths.
- Do not introduce a second provider or a parallel puzzle model.

### R8: Update game state and grading

- Replace the `Chord = string` runtime assumption with `ChordId`.
- Current guesses and submitted guesses contain `ChordId[]`.
- Compare guesses to the answer by ordered `degree + type` identity.
- Presence/correct grading must continue to handle duplicate chords with the existing count-aware behavior.
- `addCurrent` accepts a `ChordId` and validates it against the active puzzle's difficulty.
- Membership and grading checks compare stable identity, not object reference or display name.
- Board cells and end-state reveal UI derive names locally from `activePuzzle.key`, `activePuzzle.mode`, and each `ChordId`.
- Guess feedback may be computed in game logic as status values, but it must be computed from `ChordId` sequences rather than concrete chord names.
- Existing win, loss, reset, history selection, and max-length behavior must remain unchanged apart from the intentional data-model replacement.

### R9: Update persisted guesses

- Replace persisted concrete chord strings with serializable `{ degree, type }` values.
- Rehydrate stored guesses as `ChordId[]`; do not resolve names or notes during storage reads.
- Validate degree and type on storage read.
- Reject a stored chord identity if it is not available for that puzzle's difficulty.
- Persist only arrays of chord identities; do not store `correct`, `present`, or `absent` feedback.
- Never persist scale notes, chord names, chord notes, concrete progressions, or palette sections.
- Compute guess feedback from each guess and `activePuzzle.progression` when rendering or evaluating status.
- Increment or replace the current history storage schema so old string-based guesses are discarded safely.
- Preserve compatible completion/failure metadata only if the chosen versioning approach can do so without ambiguous old guess data; full old-entry removal is acceptable because backwards compatibility is explicitly not required.
- Malformed storage must remain non-crashing.

### R10: Update palette UI

- Render only non-empty derived palette sections allowed by the active puzzle's difficulty.
- Use section labels:
  - `Triads`;
  - `Sevenths`;
  - `Extensions`.
- `Pallete` builds identity sections from `activePuzzle.difficulty`, derives its scale from `activePuzzle.key + activePuzzle.mode`, and derives display chords locally.
- Render `DisplayChord.name` as the main button label.
- Render useful mode-relative metadata from the item, such as `Degree 7`, instead of the current hard-coded `iv` sublabel.
- Clicking a button must send only the selected `ChordId` to `addCurrent`.
- Do not pass `DisplayChord` objects into game context or session state.
- Existing status coloring must resolve by stable chord identity.
- Undo, submit, game-over disabling, and responsive layout behavior remain unchanged.

### R11: Keep playback aligned with derived chords

- Sequence state receives `ChordId[]`, not names, notes, or `DisplayChord[]`.
- `SequenceProvider` reads the active puzzle's key and mode and derives the notes required for playback locally.
- Pass derived note arrays only within the playback implementation after that local derivation.
- Do not add derived notes to `SequenceContext` or send them back through `GameContext`.
- Remove chord-name parsing from playback where the same notes can be derived directly from key, mode, degree, and type.
- Preserve the current explicit voicing policy unless a small adaptation is required for derived note arrays.
- Switching puzzles must continue to stop playback and clear active playback state.

### R12: Update the debug panel

- Show two clearly labeled groups:
  1. `Puzzle Definition`
  2. `Puzzle Music`
- `Puzzle Definition` must include at least:
  - date;
  - name;
  - key;
  - mode;
  - difficulty;
  - authored progression as degree/type values.
- `Puzzle Music` must include at least:
  - scale notes;
  - derived progression, including each chord's name, degree, type, and notes;
  - derived `triad`, `seventh`, and `extension` palette sections.
- Debug output may use structured JSON or readable rows, but it must not collapse the derived data to names only.
- `DebugPanel` derives all `Puzzle Music` values locally from `activePuzzle`; game context exposes only the source puzzle and gameplay identities.
- Existing live game status, guess count, history snapshot, and `Reset Today` behavior must remain available.
- Debug rendering must update when the active puzzle changes.

### R13: Remove obsolete hard-coded and chromatic paths

- Remove all hard-coded concrete chord arrays from daily puzzle definitions.
- Remove the old `target` property.
- Remove the old `diatonic`, `secondaryDominant`, and `extensions` palette contract after consumers migrate.
- Remove secondary-dominant generation from the active palette path.
- Remove old major-triad `maj` normalization.
- Remove code that derives chord notes by reparsing a hard-coded puzzle target.
- Do not replace removed hard-coded data with cached concrete chord data in `DailyPuzzle`, context, session state, or storage.
- Retain low-level pitch, MIDI, frequency, and playback utilities that remain useful.

## UX and Behavior Expectations

- Players see only chords allowed by the active puzzle's difficulty.
- The palette updates immediately when selecting a puzzle with a different key, mode, or difficulty.
- Degree ordering is stable and easy to scan.
- Chord labels follow the exact shorthand rules in this spec.
- The same authored progression pattern visibly transposes and changes quality according to the selected key and mode.
- The board, palette, revealed answer, debug panel, and audio independently derive consistent concrete output from the same source puzzle data.
- No stale palette or target data remains after switching between today's puzzle, history-selected puzzles, or slug-loaded puzzles.

## Error Handling and Validation

- Normalize key, mode, and difficulty at the puzzle-resolution boundary.
- Validate all catalog entries during derivation in development.
- Include the puzzle date in errors for invalid progression length, degree, type, or difficulty/type mismatch.
- Do not silently substitute unrelated chords for invalid puzzle data.
- Public low-level derivation functions must either:
  - return a valid typed result; or
  - fail with an explicit error for structurally invalid input.
- Existing non-fatal fallback behavior may remain for unknown external key/mode strings, but resolved catalog data should be valid before gameplay starts.

## Technical Constraints

- Preserve the existing provider, session hook, history utility, and component ownership model.
- Do not change routing, auth, deployment config, or CI.
- No new npm dependencies.
- Keep changes focused to puzzle data, music derivation, game/context/session types, history serialization, palette/board/debug rendering, playback adaptation, and tests.
- Use shared pure naming and note-spelling helpers across board, palette, debug UI, and audio.
- Keep shared state normalized: store and pass source puzzle fields and `ChordId` values only.
- Derived display and playback data should be local `const`/`useMemo` values, not React state.
- Do not pass concrete chord names, notes, scales, concrete solutions, or display palette sections between components.
- Avoid broad visual redesign.

## Acceptance Criteria

1. `DailyPuzzle` no longer contains `target: string[]`.
2. Every daily puzzle catalog entry stores a mode-relative `progression` of degree/type objects.
3. No puzzle definition stores a concrete chord name or note array.
4. `DailyPuzzle.key`, `DailyPuzzle.mode`, and `DailyPuzzle.progression` are the source of truth and internal musical language.
5. Resolved daily puzzles do not contain `scale`, `solution`, concrete chord objects, or palette sections.
6. Game context does not expose derived scale, solution, chord-name/note, or display-palette data.
7. Session state and component communication use `ChordId` values.
8. Difficulty uses canonical `easy`, `medium`, and `hard` IDs.
9. Scale derivation supports all seven specified modes.
10. `buildScale('C', 'mixolydian')` returns `['C', 'D', 'E', 'F', 'G', 'A', 'Bb']`.
11. Scale spelling preserves diatonic letters and appropriate sharps/flats.
12. Chord-note derivation uses the specified scale-step recipes with modulo-seven wrapping.
13. C Mixolydian degree 7 triad derives `Bb, D, F`.
14. C Mixolydian degree 7 seventh derives `Bb, D, F, A`.
15. Every component-local display chord includes `name`, `degree`, `type`, and `notes`.
16. Chord naming follows the exact shorthand rules in this spec, including `C` rather than `Cmaj`.
17. `activePuzzle.progression` is used directly as the gameplay answer.
18. Easy palettes expose only seven triads.
19. Medium palettes expose seven triads and seven sevenths.
20. Hard palettes expose seven triads, seven sevenths, seven `sus2` chords, and seven `sus4` chords.
21. Palette sections use the `triad`, `seventh`, and `extension` keys.
22. Secondary dominants and old chromatic palette chords are no longer generated.
23. `Pallete` derives its concrete display sections locally and renders only non-empty sections allowed by active difficulty.
24. Palette buttons render derived names and mode-relative degree metadata but submit only `ChordId`.
25. Provider-side input validation checks degree/type validity directly and does not consume a derived palette.
26. Guess comparison and palette status use stable degree/type identity rather than object reference or display-name parsing.
27. Persisted guesses use the new degree/type identity schema, and old string-based guesses are safely discarded.
28. Local storage contains no scale notes, chord names, chord notes, concrete progression, display palette, or feedback statuses.
29. Board, scale, palette, playback, and debug consumers derive concrete data locally from the active puzzle.
30. Derived concrete data is not passed between components or stored in shared React state.
31. Playback receives identities and derives notes at its own boundary.
32. The debug panel shows both source puzzle data and locally derived diagnostics.
33. Selecting today's, historical, or slug-loaded puzzles updates every local derivation consistently.
34. Existing win, loss, reset, history selection, and game-over behavior otherwise remains unchanged.
35. No obsolete hard-coded puzzle chord data remains.
36. Typecheck passes.
37. Build passes.

## Manual Verification

Verify at least these flows:

1. Load the canonical C Mixolydian example and confirm the displayed scale is `C, D, E, F, G, A, Bb` and the answer derives as `C, Bb, F, C`.
2. Confirm the degree-seven triad displays `Bb`, reports degree `7`, and plays `Bb, D, F`.
3. Load an easy puzzle and confirm only the `Triads` section appears.
4. Load a medium puzzle and confirm `Triads` and `Sevenths` appear.
5. Load a hard puzzle and confirm `Triads`, `Sevenths`, and `Extensions` appear, with `sus2` before `sus4`.
6. Select two puzzles that share a degree pattern but use different key/mode values and confirm their concrete names and notes differ.
7. Submit a guess, refresh, and confirm the degree/type identities rehydrate to the correct derived chord names.
8. Switch among today's puzzle, a history-selected puzzle, and a slug-loaded puzzle and confirm no target or palette data leaks between them.
9. Play the answer and a submitted guess and confirm audio follows the displayed derived chords.
10. Open the debug panel and confirm original puzzle data and full derived data are both visible.

## Definition of Done

- Acceptance criteria satisfied.
- Existing hard-coded puzzle chord data and obsolete palette paths are removed.
- `npm run typecheck` passes.
- `npm run build` passes.
- No unrelated refactors or new dependencies.

## Deliverable for Implementation Task

Produce a refactor that replaces concrete puzzle chord targets with mode-relative degree/type progressions. Keep each daily puzzle's key, mode, and progression as the source of truth and shared internal language, while components and playback derive concrete names, notes, scales, and palette views locally without persisting or passing those derived values through shared state.
