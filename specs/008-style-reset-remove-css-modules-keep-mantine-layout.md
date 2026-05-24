# Spec 008 — Style Reset: Remove Component CSS Modules and Keep Mantine Layout

## Goal

Remove the current custom styling layer in preparation for a full visual rewrite, while preserving working layout and interaction structure through Mantine components and Mantine props.

## Why This Exists

The current UI styling mixes CSS modules and global background/container styles that are now slated for replacement. We need a clean baseline so a new design pass can be implemented safely and incrementally.

## Scope

In scope:

- Remove component-level CSS module usage from active UI components.
- Remove CSS module files associated with components once no longer referenced.
- Reset app container/global visual styling to a neutral baseline.
- Keep Mantine and Mantine components as the primary layout/styling mechanism.

Out of scope:

- Full redesign or theme overhaul.
- New visual language implementation.
- Functional game-logic changes unrelated to styling migration.
- New dependencies.

## Product Behavior

- App remains usable and structurally consistent after style removal.
- Core screens render with neutral, readable defaults.
- No component should depend on removed CSS module class names.

## Functional Requirements

### R1: Remove component CSS module imports and class bindings

- Remove imports of `*.module.css` from active components in scope.
- Replace class-based styling with Mantine props and/or neutral inline styles where needed to preserve spacing and readability.
- Ensure interactive components remain clearly clickable and legible.

### R2: Delete unused component CSS module files

- After migration, remove CSS module files that are no longer referenced.
- Confirm no broken imports remain.

Initial known files to target:

- `app/components/Header/Header.module.css`
- `app/components/Pallete/Pallete.module.css`
- `app/components/PalleteButton/PalleteButton.module.css`
- `app/components/Scale/Scale.module.css`

### R3: Reset global app container visuals

- Remove global background image and associated background styling from app container/global CSS.
- Replace with neutral defaults that avoid visual coupling to previous design pass.
- Keep typography readable and stable (font stack can remain if desired, but no legacy decorative background treatment).

### R4: Preserve layout structure with Mantine

- Continue using Mantine primitives for page structure (cards, groups, stacks, app shell, spacing).
- Preserve core content hierarchy so gameplay flow remains unchanged.
- Avoid reintroducing CSS modules during this migration.

### R5: Prevent style regressions from breaking UX

- Buttons, status badges, inputs, and modal content must remain visually distinguishable.
- Ensure basic desktop/mobile readability after style reset.
- Avoid hidden text or collapsed spacing caused by removed class dependencies.

## UX/Behavior Expectations

- UI may look simplified, but should remain coherent and functional.
- No decorative legacy background image appears.
- Board, palette, header, and scale areas still render in an understandable layout.

## Technical Constraints

- Keep the diff focused on styling migration.
- Preserve existing architecture and component boundaries.
- No new npm dependencies.
- Do not change routes, deployment config, or CI.

## Suggested Files To Inspect

- `app/app.css`
- `app/root.tsx`
- `app/components/Header/Header.tsx`
- `app/components/Pallete/Pallete.tsx`
- `app/components/PalleteButton/PalleteButton.tsx`
- `app/components/Scale/Scale.tsx`
- `app/components/App/AppLayout.tsx`

## Acceptance Criteria

1. No active component imports a `*.module.css` file.
2. Component CSS module files in scope are removed or confirmed unused.
3. Global background image styling is removed from app container/global CSS.
4. App remains functional and readable using Mantine-based layout/styling.
5. Board, palette, header, scale, and modal UI remain usable after migration.
6. Typecheck and build pass.

## Test Requirements

Add or update checks for:

- Build and typecheck after CSS-module removal.
- Basic render sanity for primary game route.
- Visual smoke verification notes (manual) for desktop and tablet/mobile widths.

If automated UI tests are not available, include a brief manual validation checklist in the implementation PR notes.

## Definition of Done

- Acceptance criteria satisfied.
- No unrelated refactors.
- `npm run typecheck` passes.
- `npm run build` passes.
- Removed CSS modules are not referenced anywhere in the codebase.

## Deliverable for Implementation Task

Produce a focused PR-sized diff that removes current styling dependencies, resets app container visuals, and keeps layout grounded in Mantine components for future redesign work.
