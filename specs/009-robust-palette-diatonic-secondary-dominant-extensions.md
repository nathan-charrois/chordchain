# Spec 009 — Create Robust Palette Component

## Goal

Upgrade the `Pallete` component to render a robust, sectioned chord keyboard for the active puzzle key/mode, including:

- Diatonic
- Secondary/Dominant
- Extensions

All sections must be generated programmatically for every supported key and mode.

## Why This Exists

The current chord palette is static and does not expose richer harmonic options required for broader music gameplay. The palette should reflect harmonic context while staying consistent with active puzzle metadata.

## Scope

In scope:

- Build three palette sections: diatonic, secondary/dominant, extensions.
- Generate section chords from active key/mode context.
- Render these sections in `Pallete` with stable ordering and labels.
- Keep existing input actions (`add chord`, `undo`, `enter`) intact.

Out of scope:

- Audio engine rewrite.
- Non-functional design overhaul (beyond section readability).
- New route, auth, deployment, or CI changes.
- New npm dependencies.

## Product Behavior

- Palette changes when active puzzle key/mode changes.
- Chords are grouped under clear section headers.
- User can click any generated chord to add to current guess (subject to game constraints).

## Functional Requirements

### R1: Key/mode-driven section generation

- Palette data must derive from active puzzle key + mode.
- Generation must support all keys and all modes currently supported by the game.
- If mode/key is unknown, apply deterministic fallback and log non-fatal warning.

### R2: Diatonic section

- Generate 7 diatonic triads (scale degrees I through VII).
- Use consistent chord naming policy:
  - major triad: `Xmaj`
  - minor triad: `Xm`
  - diminished triad: `Xdim`
- Ordering must be scale-degree order.

### R3: Secondary/Dominant section

- Generate dominant-function chords associated with diatonic targets for the current scale context.
- Section should produce musically valid dominant chord set for the active key/mode.
- Ordering must be deterministic and documented.

### R4: Extensions section

- Generate seventh-chord extensions aligned with active scale harmony.
- Minimum supported extension qualities:
  - maj7
  - m7
  - dominant 7 (`7`)
  - half-diminished (`m7b5`)
- Ordering must track scale-degree progression.

### R5: Rendering in `Pallete`

- Render three titled groups in the palette component:
  - `Diatonic`
  - `Secondary/Dominant`
  - `Extensions`
- Keep undo/enter controls available and clearly separated from section chord buttons.
- Preserve lock/disabled behavior tied to game end-state.

### R6: Deterministic note naming policy

- Define and apply consistent accidental policy (use flat-first).
- Ensure enharmonic output is stable across renders.

### R7: Data model and utility boundaries

- Implement generation logic in utility layer (not inline UI mapping logic).
- Keep `Pallete` component focused on rendering and click handling.
- If using lookup maps for special cases, keep them centralized and typed.

## UX/Behavior Expectations

- Section headings are easy to scan.
- Chord buttons remain readable and clickable on desktop and mobile.
- Palette updates without UI flicker when key/mode changes.

## Technical Constraints

- Preserve existing game architecture and provider boundaries.
- Reuse music utilities when practical.
- No new dependencies.

## Suggested Files To Inspect

- `app/components/Pallete/Pallete.tsx`
- `app/components/PalleteButton/PalleteButton.tsx`
- `app/components/Game/context/GameContext.tsx`
- `app/components/Game/GameProvider.tsx`
- `app/utils/music.ts`
- `app/utils/dailyPuzzle.ts`
- optional new utility file in `app/utils/` for palette generation

## Suggested Data Shapes

```ts
type PaletteSections = {
  diatonic: string[]
  secondaryDominant: string[]
  extensions: string[]
}

type PaletteContext = {
  key: string
  mode: string
}
```

## Acceptance Criteria

1. Palette renders three sections: Diatonic, Secondary/Dominant, Extensions.
2. Chords in each section are generated from active key/mode context.
3. Section order and chord ordering are deterministic.
4. Unknown key/mode does not crash app and uses deterministic fallback.
5. Existing game actions (undo/enter/chord click/locked state) continue to function.

## Definition of Done

- Acceptance criteria satisfied.
- No unrelated refactors.

## Deliverable for Implementation Task

Produce a focused PR-sized diff that makes `Pallete` a robust, sectioned, key/mode-aware chord keyboard with diatonic, secondary/dominant, and extension chord sets.
