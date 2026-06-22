# Spec 024 — Responsive Design for Existing Components

## Goal

Update the existing ChordChain interface so it remains usable and readable on mobile, tablet, and desktop screens.

The implementation must use Mantine components, responsive component props, and Mantine style props. Do not add custom CSS. If a responsive requirement cannot be implemented with Mantine's existing APIs, document the limitation and leave that behavior unchanged.

## Why This Exists

The current interface is primarily arranged for a desktop-width viewport:

- the main route always renders a `3 / 9` sidebar-and-game grid;
- the Header always renders a `7 / 5` grid;
- the app container always uses `xl` horizontal padding;
- each board row contains four `160px`-high cells separated by a large fixed gap;
- playback controls assume a single horizontal row;
- palette sections attempt to keep all chord buttons on one row;
- header tool buttons have fixed desktop dimensions;
- modal layouts do not intentionally adapt to small screens.

These constraints cause content to become narrow, crowded, clipped, or unnecessarily tall on mobile screens. The app should adapt its existing content hierarchy without changing gameplay, routes, state ownership, or visual identity.

## Current Implementation Review

### Application shell

- `app/components/App/AppLayout.tsx` uses a `Container` with `size="lg"` and fixed `px="xl"`.
- The document already includes `width=device-width, initial-scale=1` in `app/root.tsx`.
- `app/utils/theme.ts` does not override Mantine's default breakpoints.

### Main game layout

- `app/routes/Game/index.tsx` renders the Sidebar at `span={3}` and the gameplay column at `span={9}` for every viewport width.
- The Grid uses `overflow="hidden"`, which can conceal layout problems instead of allowing components to reflow.
- Sidebar and gameplay use one stable source order.

### Header

- `Header.tsx` uses fixed `7 / 5` columns.
- Header tools are right-aligned in one horizontal `Group`.
- `Icon.tsx` gives interactive header buttons fixed `95px` width and `105px` height.
- Additional header tools, including the Stats tool described by spec 023, increase the chance of overflow on narrow screens.

### Board and playback

- Each guess row is a non-wrapping `Group`.
- Each guess cell uses `w="25%"`, `h={160}`, and `Text size="xl"`.
- Four percentage-width cells plus three fixed gaps compete for more than the available row width.
- `PlaybackControls.tsx` uses one outer horizontal `Group` with two nested horizontal groups.
- The play button, checkboxes, tempo label, slider, and BPM value do not have a defined narrow-screen layout.

### Palette and actions

- `Pallete.tsx` already stacks the chord sections and piano roll at the `md` breakpoint.
- Each chord section uses one growing `Group`, so all available chords attempt to remain on the same row.
- Undo and Submit Chain use one right-aligned horizontal `Group`.
- `PianoRoll.tsx` uses percentage-based key positions and can scale with its parent width, but its heading row can become crowded.

### Sidebar, history, and modals

- Sidebar cards naturally take the width of their column and require only content-level overflow checks.
- About, History, and Daily Puzzles use Mantine `Modal`.
- Mantine supports switching modals to fullscreen on mobile with `useMediaQuery`.
- History and puzzle rows contain groups whose text and badges must be allowed to wrap.

### Existing custom styling

- `PianoRoll.tsx` contains existing inline styles for keyboard geometry.
- `DebugPanel.tsx` contains existing inline styles for fixed positioning and viewport bounds.
- These existing styles are not the responsive styling mechanism for this spec and do not need to be rewritten as part of this work.

## Mantine Implementation Guidance

Follow the Mantine 8 responsive guidance used by the installed `@mantine/core` and `@mantine/hooks` packages:

- Use mobile-first responsive values: define the smallest layout under `base`, then add `sm`, `md`, or larger overrides.
- Use responsive `Grid.Col` `span` values for page structure.
- Use `SimpleGrid` when children should have equal widths and a responsive column count.
- Use `Flex` when direction, wrapping, alignment, or gaps must change responsively. Mantine documents `Flex` as the responsive alternative to `Group` and `Stack`.
- Use responsive Mantine style props for focused layout values such as padding, gap, width, height, and font size.
- Do not use responsive style props throughout large generated lists when one responsive parent layout can solve the same problem.
- Do not use `useMediaQuery` as the primary styling mechanism in this React Router SSR app.
- `useMediaQuery` may be used for modal-only behavior because Mantine documents that changing props of content not rendered on the server, including modals, is safe.
- Keep Mantine's default breakpoints unless implementation testing demonstrates a specific problem. Do not add project-specific breakpoints preemptively.

Reference documentation:

- [Mantine 8 responsive styles](https://v8.mantine.dev/styles/responsive/)
- [Mantine 8 Grid](https://v8.mantine.dev/core/grid/)
- [Mantine 8 Flex](https://v8.mantine.dev/core/flex/)
- [Mantine 8 SimpleGrid](https://v8.mantine.dev/core/simple-grid/)
- [Mantine 8 Modal](https://v8.mantine.dev/core/modal/)

## Responsive Layout Contract

### Mobile: below Mantine `sm`

The mobile page order must be:

1. Header branding;
2. header tools;
3. Sidebar;
4. Board;
5. playback controls;
6. Palette and piano preview;
7. palette actions;
8. Footer.

Additional mobile expectations:

- The page must not have horizontal document scrolling at a `320px` viewport width.
- Primary content uses reduced horizontal padding and spacing.
- The four progression cells remain on one row so guess position remains immediately scannable.
- Palette chord choices wrap into multiple equal-width columns.
- Playback controls and primary actions may stack vertically.
- Header tools wrap or distribute within the available width without clipping.
- Modal content uses the full viewport where appropriate.

### Tablet: Mantine `sm` through below `md`

- The main gameplay and Sidebar remain stacked.
- Spacing and control widths may increase from mobile values.
- Palette chord sections may use more columns than mobile.
- Playback controls may remain stacked until all controls fit without compression.

### Desktop: Mantine `md` and above

- Preserve the existing Sidebar-left and gameplay-right arrangement.
- Preserve the approximate `3 / 9` column proportions.
- Restore desktop spacing, board cell height, header alignment, and horizontal playback controls.
- Preserve the existing palette-and-piano side-by-side layout.

## Scope

In scope:

- Responsive application container padding.
- Responsive Header columns, alignment, typography, and tool sizing.
- Responsive main game columns while preserving one coherent content order.
- Responsive Board cell sizing and spacing.
- Responsive playback controls.
- Responsive palette chord layout and action layout.
- Responsive piano-preview heading behavior.
- Responsive Sidebar content wrapping where needed.
- Responsive About, History, Daily Puzzles, and any other existing header modal present at implementation time.
- Manual verification at representative mobile, tablet, and desktop widths.

Out of scope:

- A visual redesign, new theme, or new component library.
- Changing colors, copy, icons, game rules, music behavior, puzzle data, or state ownership.
- A mobile navigation drawer or persistent bottom navigation.
- Hiding gameplay features on mobile.
- Changing routes, storage schema, auth, deployment, or CI.
- Replacing the existing piano keyboard geometry.
- Reworking the development-only Debug Panel unless it causes document overflow during verification.
- Supporting legacy browsers outside Mantine's existing browser support.
- New npm dependencies.

## Functional Requirements

### R1: Keep the document viewport configuration

- Preserve the existing viewport meta tag in `app/root.tsx`.
- Do not add JavaScript viewport-width state for general layout.
- The responsive layout must be driven by Mantine's generated media queries and component APIs.

### R2: Make the application container mobile-first

- Keep the centered `Container` and its desktop maximum width.
- Replace fixed `xl` horizontal padding with responsive Mantine padding.
- Use a compact `base` value suitable for `320px` screens and increase padding at larger breakpoints.
- Do not add container CSS to `app/app.css`.

An implementation equivalent to the following intent is acceptable:

```tsx
<Container
  size="lg"
  px={{ base: 'sm', sm: 'md', lg: 'xl' }}
>
```

Exact spacing tokens may be adjusted during manual verification, but mobile must retain a visible page gutter.

### R3: Stack the main game layout

- Update the main route Grid to use responsive column spans.
- Below `md`, Sidebar and gameplay must each span all 12 columns.
- At `md` and above, preserve Sidebar `3 / 12` and gameplay `9 / 12`.
- Preserve Sidebar before gameplay in both DOM and visual order.
- Do not duplicate Sidebar or gameplay markup.
- Use responsive Grid gutter values where reduced mobile spacing improves fit.
- Remove `overflow="hidden"` from the route Grid unless a verified Mantine layout requirement still needs it.

### R4: Make the Header adapt without duplicating controls

- Change both Header columns to full width below `sm`.
- Preserve the existing approximate `7 / 5` split at desktop widths.
- Keep branding before tools in reading and DOM order.
- Left-align branding on mobile.
- Allow header tools to wrap or distribute across the available width.
- Keep every existing tool visible and operable; do not replace tools with a menu in this spec.
- Keep the exact existing labels and icon meanings.
- Reduce excessive mobile vertical and horizontal spacing through responsive Mantine props.
- Use responsive `fz` style props for heading changes instead of attempting to pass responsive objects to component `size` props.
- Make interactive `Icon` buttons narrower and shorter on mobile while preserving a practical touch target.
- Ensure the Header can accommodate History, About, and Stats if spec 023 is implemented before or alongside this spec.

### R5: Preserve four board cells while making them fit

- Keep exactly four cells in every guess row.
- Replace the percentage-width, non-wrapping row calculation with a Mantine equal-column layout such as `SimpleGrid cols={4}`.
- Use one responsive parent spacing definition rather than calculating widths in each cell.
- Each cell must fill its grid track.
- Reduce cell height, corner radius, and text size on mobile through Mantine props where needed.
- Restore the existing larger presentation at desktop widths.
- Chord labels must remain centered, legible, and unclipped.
- Active playback color, grading color, status semantics, row count, and guess behavior must remain unchanged.
- The win/loss answer badges must wrap without horizontal overflow.

### R6: Reflow playback controls

- Use Mantine `Flex`, `Stack`, `Group`, or a combination that provides a clear mobile-first arrangement.
- The layout must support a vertical mobile arrangement and a horizontal desktop arrangement without conditional rendering.
- The Play/Stop button must remain visually prominent and must not shrink below its readable content width.
- Arpeggiate and Drums checkboxes must remain visible and individually operable.
- The tempo label, Slider, and BPM value must share a full-width row or section on mobile.
- The Slider must retain enough width for accurate touch interaction.
- Preserve all playback callbacks, ranges, labels, and state behavior.

### R7: Make palette chord choices wrap into equal columns

- Preserve the existing section order and labels.
- Replace each section's single-row growing `Group` with a Mantine responsive equal-column layout.
- Use `SimpleGrid` or an equivalent Mantine component with:
  - at least two columns on the smallest supported mobile width;
  - additional columns at `xs`/`sm` where space permits;
  - a compact gap on mobile;
  - enough width for chord name and numeral text.
- Keep all chord buttons visible; do not introduce horizontal scrolling or hide lower-priority chords.
- Preserve chord selection, disabled state, grading color, hover preview, focus preview, and keyboard accessibility.
- Avoid applying responsive style props separately to every generated chord button when the section's responsive parent can control the layout.

### R8: Keep the piano preview usable

- Preserve the existing one-octave keyboard and clickable-note behavior.
- Keep the piano below the palette sections below `md` and beside them at `md` and above.
- Allow the chord-preview heading and note summary to wrap or stack when they do not fit in one row.
- Keep the keyboard at the full available width of its column.
- Do not add responsive CSS for key placement; the existing percentage-based key geometry should continue to scale with its parent.
- Do not redesign or rewrite the piano keyboard under this spec.

### R9: Make palette actions usable on narrow screens

- Preserve the exact `Undo` and `Submit Chain` labels and actions.
- Keep both actions visible.
- Use Mantine responsive layout props so the controls can stack or occupy full available width on mobile.
- Preserve the current desktop right alignment.
- Do not make Submit Chain sticky or fixed-positioned in this spec.

### R10: Protect Sidebar content from overflow

- Keep SidebarCalendar before SidebarDetails within the Sidebar.
- Preserve all current labels, values, icons, countdown behavior, and modal trigger behavior.
- Allow long puzzle names, formatted dates, key/mode labels, and status text to wrap instead of forcing horizontal overflow.
- Keep the Today's Puzzle row recognizable as one interactive control.
- The calendar icon tile may retain a fixed square size, but adjacent text must be allowed to shrink and wrap.
- Do not truncate user-facing puzzle information unless Mantine wrapping cannot prevent overflow.

### R11: Adapt modals for mobile

- Apply the behavior consistently to About, History, Daily Puzzles, Stats if present, and any equivalent header modal present at implementation time.
- At mobile widths, use Mantine's documented `fullScreen` modal behavior.
- Use `useMediaQuery` only for the `fullScreen` decision and related modal props such as radius or transition.
- Match the mobile query to the intended Mantine breakpoint instead of introducing an arbitrary device-specific width.
- Prefer the documented fade transition when a modal is fullscreen.
- Preserve Mantine focus management, close button, Escape handling, overlay behavior, and portal behavior.
- At tablet and desktop widths, preserve the existing centered modal and intended size.
- Allow History timeline titles, status badges, puzzle row headings, and metadata groups to wrap.
- Do not duplicate modal contents into separate mobile and desktop components.

### R12: Do not add custom CSS

- Do not add or modify responsive rules in `app/app.css` or `app/animate.css`.
- Do not add CSS modules, Sass, styled-components, Emotion, Tailwind responsive utility classes, or PostCSS configuration.
- Do not add `className`, `classNames`, `styles`, or `style` objects for new responsive behavior.
- Use Mantine layout components, responsive component props, and responsive style props.
- Existing inline styles in PianoRoll and DebugPanel may remain when unrelated to this work.
- If a requirement cannot be implemented with Mantine APIs under these constraints:
  1. leave the existing behavior unchanged;
  2. document the limitation in the implementation PR;
  3. do not add a custom CSS workaround.

No known requirement in this spec currently requires custom CSS.

### R13: Preserve application behavior

- Responsive changes must not alter game state, submission rules, grading, playback timing, puzzle selection, route synchronization, history persistence, or modal data.
- Do not move responsive state into `GameProvider`, `GameContext`, or session state.
- Do not change component ownership solely for styling.
- Prefer focused substitutions between Mantine layout primitives over new wrapper abstractions.
- Desktop behavior must remain functionally equivalent after layout changes.

## UX and Accessibility Expectations

- The app must remain operable with touch, mouse, and keyboard at every supported width.
- Interactive controls must not overlap or be clipped.
- Focus indicators must remain visible.
- Touch controls must retain practical target sizes; compact mobile layout must not make buttons difficult to activate.
- Text may wrap, but important labels and current values must not disappear.
- Visual order and keyboard/reading order must remain coherent.
- Do not rely on hover as the only way to understand or use palette chords; existing focus behavior must remain.
- Modal dialogs must continue to expose their title and close control.
- The page must not introduce horizontal document scrolling at tested viewport widths.
- Browser zoom and increased text size should reflow rather than clip primary controls where practical.

## Suggested Files To Change

- `app/components/App/AppLayout.tsx`
- `app/components/Header/Header.tsx`
- `app/components/Icon/Icon.tsx`
- `app/routes/Game/index.tsx`
- `app/components/Board/Board.tsx`
- `app/components/Board/components/PlaybackControls.tsx`
- `app/components/Pallete/Pallete.tsx`
- `app/components/Pallete/PianoRoll.tsx`
- `app/components/PalleteButton/PalleteButton.tsx`, only if parent layout changes are insufficient
- `app/components/Sidebar/components/SidebarCalendar.tsx`
- `app/components/Sidebar/components/SidebarDetails.tsx`, only if content verification finds overflow
- `app/components/About/About.tsx`
- `app/components/History/History.tsx`
- `app/components/Sidebar/components/PuzzleCalendarModal.tsx`
- the Stats modal component, if spec 023 has been implemented

`app/app.css`, routing configuration, state providers, music utilities, and storage utilities should not need changes.

`app/utils/theme.ts` should remain unchanged unless manual testing proves the default Mantine breakpoints are unsuitable. Any breakpoint change would require explicit justification because it affects every responsive Mantine component.

## Suggested Implementation Sequence

1. Update the outer Container, Header, and route Grid.
2. Convert Board rows to an equal four-column Mantine layout.
3. Reflow playback controls.
4. Convert palette chord groups and palette actions to responsive Mantine layouts.
5. Verify PianoRoll and Sidebar wrapping.
6. Apply consistent mobile fullscreen behavior to modals.
7. Perform viewport, keyboard, and interaction checks before making any further spacing adjustments.

Keep each step focused. Do not combine this work with visual redesign or unrelated component cleanup.

## Acceptance Criteria

1. The app has no horizontal document scrollbar at `320px`, `375px`, `390px`, `768px`, `992px`, and a representative desktop width.
2. The outer page gutter is compact on mobile and returns to the existing spacious desktop presentation.
3. Header branding and tools stack or wrap cleanly on mobile.
4. All existing Header tools remain visible, labeled, and operable.
5. Sidebar and gameplay stack in their existing source order below `md`.
6. Sidebar and gameplay return to the existing approximate `3 / 9` layout at `md` and above.
7. Every Board row still displays exactly four ordered cells.
8. Board cells and labels remain readable at `320px` without clipping.
9. Playback controls form a usable mobile layout with a touch-operable tempo Slider.
10. All palette chords remain visible and wrap into equal-width columns without horizontal scrolling.
11. Hover and focus chord preview behavior remains unchanged.
12. The one-octave piano remains usable and scales to its available width.
13. Undo and Submit Chain remain visible and operable on mobile and desktop.
14. Sidebar puzzle names, dates, status, streak, countdown, difficulty, and key/mode values do not overflow their cards.
15. Existing modals use fullscreen behavior on mobile and retain their centered desktop behavior.
16. History and puzzle modal rows wrap without clipping titles, badges, dates, or actions.
17. No new responsive CSS, CSS module, inline style object, `styles`, `classNames`, or dependency is added.
18. Game logic, playback behavior, puzzle selection, history, routing, and persistence remain unchanged.
19. Typecheck passes.
20. Build passes.

## Test Requirements

The project currently has no automated test script. Do not add a test framework solely for this responsive work.

Run:

```sh
npm run typecheck
npm run build
git diff --check
```

If component tests or browser tests exist by implementation time, update only focused tests that already cover affected components.

## Manual Verification

Verify at minimum:

- `320 × 568` — smallest supported mobile layout;
- `375 × 667` or `390 × 844` — common phone layout;
- `768 × 1024` — tablet and `sm` boundary behavior;
- immediately below and above Mantine `md` (`992px` by default);
- `1200px` or wider — desktop preservation.

At each relevant width:

1. Confirm the document does not scroll horizontally.
2. Confirm Header text and all tools are visible.
3. Confirm the main content order matches the responsive layout contract.
4. Confirm four Board cells fit each row and all guess states remain distinguishable.
5. Play and stop a sequence.
6. Toggle Arpeggiate and Drums.
7. Change tempo with mouse/touch-equivalent input and keyboard input.
8. Select, undo, and submit chords.
9. Hover and keyboard-focus a palette chord and confirm the piano preview updates.
10. Click piano keys.
11. Open and close About, History, Daily Puzzles, and Stats if present.
12. Select a puzzle through Daily Puzzles and confirm navigation still works.
13. Verify a completed or failed game state and its answer badges.
14. Tab through interactive controls and confirm focus remains visible and ordered coherently.

Also test with browser zoom or increased text size at a mobile width and record any Mantine-only limitation that cannot be resolved without custom CSS.

## Definition of Done

- Acceptance criteria are satisfied.
- Responsive behavior is implemented with Mantine APIs only.
- Any behavior that could not be implemented without custom CSS is explicitly documented and left unchanged.
- Existing desktop behavior remains functionally intact.
- `npm run typecheck` passes.
- `npm run build` passes.
- `git diff --check` passes.
- Manual viewport verification results are included in the implementation PR summary.
- No unrelated refactors or dependency changes are included.

## Deliverable for Implementation Task

Produce a focused PR-sized diff that makes the existing Header, game layout, Board, playback controls, Palette, Sidebar, Footer flow, and modal surfaces usable from `320px` mobile widths through desktop widths using Mantine components and responsive props only.
