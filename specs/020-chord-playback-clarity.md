# Spec 020 — Chord Playback Clarity

## Goal

Review the current `zzfx` playback path and improve chord synthesis so chords sound more full, flush, and clear during sequence playback, especially chords containing more than three notes.

## Why This Exists

The current audio implementation plays every chord tone in the same octave using the same `zzfx` tone settings. This is acceptable for simple triads, but seventh chords and other 4-note or 5-note chords can sound crowded, muddy, or indistinct because all tones are compressed into one register. A consistent bass root under the main chord should make every chord feel grounded while keeping the voicing rule easy to understand.

## Current Implementation Review

### `zzfx` dependency

- The project uses `zzfx` version `^1.3.2` from `package.json`.
- `app/utils/zzfx.ts` wraps the positional `zzfx(...)` API behind a named-parameter helper.
- The wrapper currently passes only the provided sound parameters and leaves all omitted `zzfx` parameters undefined.
- This wrapper is small and appropriate; no library replacement is recommended for this spec.

### Tone generation

- `app/utils/music.ts` owns note and chord synthesis.
- `playTone(pitchClass, octave)` converts pitch class and octave to frequency via:
  - `midiFromPitchClass`
  - `hzFromMidi`
  - `hzFromPitchClass`
- `playTone` currently calls `zzfx` with:
  - `volume: 4`
  - `randomness: 0`
  - `attack: 0.01`
  - `sustain: 0.30`
  - `release: 0.30`
- All notes use the same envelope and volume.

### Chord generation

- `qualityFromChord(chord)` maps chord labels to interval keys.
- `CHORD_INTERVALS` supports:
  - triads: `major`, `minor`, `dim`, `aug`
  - seventh chords: `maj7`, `m7`, `dom7`, `m7b5`
- `pitchClassesFromChord(chord)` applies chord intervals to the root, then normalizes each note with modulo 12.
- Because the output is pitch classes only, interval octave information is discarded.
- `playChord(chord, arpeggiate, sequenceGapMs)` plays every generated pitch class in octave `4`.
- In non-arpeggiated playback, every chord tone starts at the same time.
- In arpeggiated playback, tones are staggered, but still use octave `4`.

## Problem Statement

Chords need a simple, consistent voicing rule. A 4-note chord such as `Cmaj7` currently becomes `C4 E4 G4 B4`. That close-position shape is compact and can be useful, but it is not always grounded with short synthetic tones. A 5-note chord, if added later, would be even denser.

The playback layer needs to preserve enough interval information to place a bass root one octave below the main chord and keep upper chord tones in a predictable register.

## Scope

In scope:

- Review and document current `zzfx` usage.
- Add chord voicing rules for playback.
- Add a consistent bass root one octave below the main chord for every chord.
- Keep upper chord tones in a clear, predictable register.
- Keep existing chord labels, palette generation, sequence timing, and arpeggiation controls.
- Keep `zzfx` as the audio library.
- Keep implementation focused to audio utilities and tests.

Out of scope:

- Replacing `zzfx`.
- Adding samples, WebAudio instruments, MIDI playback, or new audio dependencies.
- Changing puzzle generation, chord labels, palette sections, routing, auth, database schema, deployment config, or CI.
- Adding new chord qualities unless needed by a separate spec.
- Redesigning playback controls.

## Product Behavior

- Triads continue to play recognizably with a bass root below the main chord.
- Four-note chords sound grounded and clearer than the current same-octave-only voicing.
- Five-note chords, if present or added later, continue to use the same bass-plus-main-chord rule.
- Chords remain quick enough for the existing sequence playback cadence.
- Arpeggiation continues to stagger the voiced notes in order.
- Non-arpeggiated playback starts the voiced notes together.

## Functional Requirements

### R1: Preserve interval information for playback

- Add a helper that returns chord tones as semitone offsets from the root, not only normalized pitch classes.
- The helper should reuse existing `rootFromChord`, `qualityFromChord`, and `CHORD_INTERVALS` behavior where practical.
- The existing `pitchClassesFromChord` helper may remain for palette or compatibility use.
- Playback voicing must be derived from root pitch class plus interval offsets so octave placement can be controlled.

### R2: Add voiced chord tone output

- Add a playback-focused helper that returns concrete tones shaped like:
  - pitch class
  - octave
  - optionally MIDI note or semitone offset if useful internally
- The helper must produce deterministic output for the same chord label.
- The helper must handle unknown or malformed chord labels no worse than the current behavior.
- If a root cannot be resolved to a known pitch class, fail safely and avoid crashing playback.

### R3: Add a bass root to every chord

- Every chord should include the root one octave below the main chord.
- Recommended default:
  - bass root in octave `3`
  - main chord tones starting in octave `4`
- This rule should apply to triads, seventh chords, and future five-note chords.
- The implementation should be obvious from the code and avoid hidden voicing heuristics.

### R4: Keep upper chord tones predictable

- Main chord tones should be derived directly from chord intervals starting at octave `4`.
- Intervals greater than one octave may naturally land in octave `5`.
- Do not use root-specific or quality-specific voicing heuristics unless a future spec explicitly asks for them.
- Avoid behavior where some chords get a bass note and others do not.

### R5: Prepare for five-note chords

- The voicing helper should support chord tone arrays longer than four notes even if the current chord catalog only uses triads and sevenths.
- Five-note chords should include the same bass root plus all main chord tones.
- Recommended default for five-note chords:
  - bass root in octave `3`
  - main chord tones in octave `4`
  - ninth or higher extensions may land in octave `5`
- Do not add new five-note chord labels in this spec unless they already exist elsewhere in the project.

### R6: Balance volume for multi-note chords

- Review the current `volume: 4` setting in `playTone`.
- Multi-note chords should not become harsh or clip-like as note count increases.
- Recommended implementation:
  - allow `playTone` to accept an optional volume override, or
  - add a playback helper that scales tone volume based on chord size.
- Suggested starting points:
  - triads: preserve current perceived level.
  - 4-note chords: reduce per-tone volume slightly.
  - 5-note chords: reduce per-tone volume more.
- Do not make volume scaling so aggressive that extended chords sound weak compared with triads.

### R7: Keep envelope clear

- Keep the current short attack unless testing shows audible clicks.
- Review `sustain: 0.30` and `release: 0.30` against the selected voicing.
- If extended chords still smear between sequence steps, reduce sustain/release modestly.
- If chords sound too percussive, keep the existing envelope and rely first on voicing and volume balancing.
- Avoid adding effects such as delay, modulation, bit crush, or randomness for this spec.

### R8: Preserve sequence timing

- `playSequence` and `playSequenceOnce` should not need broad changes.
- `sequenceGapMs` must continue to control chord spacing and arpeggio interval scaling.
- Voicing must not add extra timers beyond the existing per-tone arpeggio stagger.
- Stopping playback must continue to stop future sequence chords as it does today.

### R9: Arpeggiation order

- Arpeggiated playback should use the voiced tone order, not raw pitch-class order.
- The order should generally move low to high.
- For four-note and five-note chords, octave spreading should make the arpeggio more readable.
- The arpeggio interval should continue to derive from `sequenceGapMs`.

## Technical Constraints

- No new npm dependencies.
- Keep changes focused to `app/utils/music.ts`, `app/utils/zzfx.ts` only if wrapper support is needed, and adjacent tests if present.
- Preserve existing exported helpers unless there is a clear replacement path.
- Do not change palette generation or chord naming policy as part of this spec.
- Do not change UI controls or route behavior.
- Use only scripts already defined in `package.json`.

## Suggested Implementation Notes

- Introduce a type such as:
  - `type VoicedTone = { pitchClass: number; octave: number }`
- Add a helper such as:
  - `intervalsFromChord(chord: string): number[]`
  - `voicedTonesFromChord(chord: string): VoicedTone[]`
- Prefer using semitone intervals first, then converting to pitch class and octave.
- One pragmatic algorithm:
  1. Resolve root pitch class and chord intervals.
  2. Add a bass root at octave `3`.
  3. Build main chord tones from root octave `4` plus each interval.
  4. Convert each MIDI note back to `{ pitchClass, octave }`.
- Keep this intentionally simple so audio behavior is easy to audit.
- If tests exist for `music.ts`, add focused tests for voicing output rather than trying to assert actual audio.

## Recommended Voicing Examples

These examples define intent, not mandatory exact MIDI values:

- `Cmaj`: `C3 C4 E4 G4`.
- `Cm`: `C3 C4 Eb4 G4`.
- `Cmaj7`: `C3 C4 E4 G4 B4`.
- `C7`: `C3 C4 E4 G4 Bb4`.
- `Cm7b5`: `C3 C4 Eb4 Gb4 Bb4`.
- Future `C9` or 5-note equivalent: `C3 C4 E4 G4 Bb4 D5`.

## Acceptance Criteria

1. The current `zzfx` usage and chord generation path are documented in the implementation notes or PR summary.
2. Every chord includes a bass root one octave below the main chord.
3. Triads still play in a compact, recognizable main-chord register.
4. Four-note chords include the same bass treatment as triads.
5. Five-note chord tone arrays, if introduced later, are handled by the voicing helper without requiring another playback rewrite.
6. Arpeggiated playback uses the same voiced tones as non-arpeggiated playback.
7. Sequence tempo, looping, play/stop behavior, and active chord highlighting are unchanged.
8. No new dependencies are added.
9. Typecheck passes.
10. Build passes.
11. Manual audio verification confirms extended chords are clearer than the current same-octave playback.

## Definition of Done

- Acceptance criteria satisfied.
- No unrelated refactors.
- `npm run typecheck` passes.
- `npm run build` passes.
- Added tests pass, or the absence of suitable test coverage is documented.
- Manual audio verification notes are included in the PR summary.
- The final diff is small enough for human review.

## Deliverable for Implementation Task

Produce a focused PR-sized diff that keeps `zzfx`, adds deterministic bass-plus-main-chord voicing for playback, balances multi-note chord volume if needed, and preserves existing sequence controls and timing behavior.
