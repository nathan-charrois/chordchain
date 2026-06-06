# Spec 019 — Puzzle Name URL Routing

## Goal

Add puzzle-specific URLs based on each puzzle's sanitized name so selected puzzles can be refreshed, shared, and loaded directly.

## Why This Exists

History puzzle selection currently changes provider state only. Refreshing the page loses the selected puzzle and returns to the default daily puzzle. A URL containing the puzzle name lets the app restore a selected puzzle after refresh without adding new persistence state.

## Scope

In scope:

- Generate a URL-safe slug from each daily puzzle name.
- Support game URLs shaped like `/<puzzle-slug>`, for example `/golden-thread`.
- Load the matching puzzle automatically when a puzzle slug is present in the URL.
- Update the URL when a different puzzle is selected from history.
- Preserve the existing root `/` behavior for normal daily puzzle loading.
- Keep direct puzzle loading constrained to known catalog puzzles.

Out of scope:

- Adding date-based puzzle URLs.
- Persisting selected puzzle state outside the URL.
- Adding puzzle name to the URL on ordinary initial page load.
- Adding puzzle name to the URL when the user is already on `/` and no history selection occurred.
- Remote puzzle lookup, accounts, cloud sync, or sharing metadata.
- Database schema, auth, deployment config, or CI changes.
- New npm dependencies.

## Product Behavior

- Visiting `/` continues to load the default puzzle for today.
- Selecting a puzzle from the history modal updates the browser URL to that puzzle's slug.
- Example: selecting the puzzle named `Golden Thread` updates the URL to `/golden-thread`.
- Refreshing a URL with a known puzzle slug loads that puzzle automatically.
- Browser back/forward navigation updates the active puzzle to match the URL.
- Unknown puzzle slugs should not crash the app.
- Unknown puzzle slugs should fall back safely to today's puzzle and avoid writing history for an invalid slug.
- The board and history modal continue to show the selected puzzle's name, date, difficulty, completion state, and historical label as they do today.

## Functional Requirements

### R1: Puzzle slug generation

- Add a deterministic slug helper for puzzle names.
- Slugs must be based on puzzle `name`, not date.
- Slugs must be lowercase and hyphen-separated.
- Slugs must strip or normalize punctuation so common names produce readable paths.
- Slugs must be URL-safe after escaping.
- Minimum expected transformation:
  - `Golden Thread` -> `golden-thread`
- Slug generation must be stable across refreshes and builds.
- Slug generation should be centralized in `app/utils/dailyPuzzle.ts` or an adjacent daily puzzle helper so route loading and history selection use the same logic.

### R2: Catalog slug lookup

- Build slug lookup from the existing daily puzzle catalog.
- Only known catalog slugs may resolve to puzzles.
- If two catalog entries produce the same slug, resolution must remain deterministic and the duplicate should be surfaced during development.
- Prefer treating duplicate slugs as catalog authoring errors rather than silently loading an arbitrary puzzle.
- The lookup should expose enough helper functions to:
  - resolve a puzzle by slug.
  - get a puzzle's slug from its catalog entry or resolved puzzle.
  - validate whether a slug exists.

### R3: Route support

- Add route support for an optional puzzle slug without changing the main game screen structure.
- Both `/` and `/<puzzle-slug>` should render the existing game route.
- The slug route should not require a new page layout.
- Route parsing should decode URL path segments before slug lookup.
- Invalid percent-encoded path input must be handled safely and must not crash rendering.
- Avoid broad routing changes beyond adding the slug route needed for this feature.

### R4: Initial puzzle selection from URL

- On initial render, if a valid puzzle slug is present in the URL, initialize the selected puzzle date from that slug's resolved catalog puzzle.
- If no puzzle slug is present, initialize selected puzzle date to today's local date.
- If an unknown or malformed slug is present, initialize selected puzzle date to today's local date.
- Loading a puzzle from a slug must preserve existing behavior for:
  - completed selected puzzles.
  - failed selected puzzles.
  - hint progress.
  - target/key/mode/difficulty resolution.
  - history entries.
- URL-derived selection should not create or mutate puzzle history by itself.

### R5: URL updates on history selection

- When a user selects a puzzle from the history modal, update the browser URL to the selected puzzle's slug.
- Use normal client-side navigation so the app does not reload.
- The URL update must happen for today's puzzle too if it is selected from history.
- It is not required to add today's puzzle slug to the URL during ordinary first load on `/`.
- Reselecting the already active puzzle should not add a duplicate history entry or perform a no-op navigation.
- The history modal should still close after a successful selection.

### R6: Back and forward navigation

- Browser back/forward navigation should keep provider state synchronized with the URL.
- Navigating from `/<known-slug>` to `/` should restore today's puzzle.
- Navigating between known slugs should reset transient gameplay state for the newly selected puzzle, using the same reset behavior as history selection.
- Navigating to an unknown slug should fall back safely to today's puzzle.
- Avoid carrying current guesses or current chord input across URL-driven puzzle changes.

### R7: Slug escaping and sanitization

- Slugs written to the URL must be escaped with standard URL path-segment escaping.
- Slugs read from the URL must be decoded before lookup.
- Sanitization should prevent empty path segments from resolving as puzzles.
- Names containing repeated whitespace, punctuation, apostrophes, or symbols should produce stable readable slugs.
- If sanitization produces an empty slug for a future catalog entry, fall back to a deterministic safe slug and surface the catalog problem during development.

### R8: Error and fallback behavior

- Unknown slug behavior must be deterministic.
- Recommended fallback:
  - active puzzle becomes today's puzzle.
  - URL may remain unchanged to avoid surprising navigation, or may be replaced with `/`; choose one behavior and document it in implementation notes.
- The app must not mark any puzzle complete or failed because of an unknown slug fallback.
- Malformed URL input must not crash route rendering or game provider initialization.
- Existing malformed local storage recovery must remain unchanged.

## UX/Behavior Expectations

- Puzzle URLs are readable and shareable.
- The root daily puzzle experience stays unchanged.
- Selecting from history feels like opening a specific puzzle, with the URL reflecting that selection.
- Refreshing a selected historical puzzle returns the player to that same puzzle.
- Browser navigation behaves predictably and does not leak gameplay state between puzzles.
- The history modal remains the only required UI path for adding puzzle names to the URL.

## Technical Constraints

- Preserve the existing game provider/context architecture.
- Preserve existing board/history modal layout unless a small navigation prop is needed.
- No new npm dependencies.
- Keep changes focused to daily puzzle utilities, route configuration, provider initialization/synchronization, and history selection wiring.
- Do not change database schema, auth, deployment config, or CI.
- Use only scripts already defined in `package.json`.
- Avoid unrelated refactors or visual redesign.

## Suggested Implementation Notes

- Add helpers such as `getPuzzleSlug`, `resolveDailyPuzzleBySlug`, and `getPuzzleSlugForDate` in `dailyPuzzle.ts`.
- Consider deriving the initial selected date from React Router params in the game route and passing it into `GameProvider`.
- Consider using React Router navigation in the history selection handler rather than direct `window.history` mutation.
- Keep `selectPuzzleDate(date)` as the provider-level state transition and layer URL navigation around the UI action that selects from history.
- Add an effect that watches the current route slug and calls the existing puzzle selection reset path when the slug changes.
- Use `replace` rather than `push` only for invalid slug cleanup if implementation chooses to canonicalize unknown URLs.
- Development warnings for duplicate or empty slugs should identify the affected puzzle dates and names.

## Acceptance Criteria

1. Visiting `/` still loads today's puzzle by default.
2. Every catalog puzzle has a deterministic URL slug derived from its sanitized puzzle name.
3. The puzzle named `Golden Thread` resolves to `/golden-thread`.
4. Selecting a puzzle from the history modal updates the URL to that puzzle's slug.
5. Selecting today's puzzle from history also updates the URL to today's puzzle slug.
6. Initial page load at a known puzzle slug loads that puzzle automatically.
7. Refreshing a known puzzle slug keeps that puzzle selected.
8. Browser back/forward navigation updates the selected puzzle to match the URL.
9. Navigating from a puzzle slug back to `/` restores today's puzzle.
10. Unknown or malformed slugs do not crash the app and fall back safely to today's puzzle.
11. URL-derived puzzle loading does not create, complete, fail, or otherwise mutate history entries.
12. Switching puzzles through URL or history clears transient guesses/current input for the newly selected puzzle.
13. Existing hint, history selection, grading, reset, win, loss, difficulty, and palette behavior are unchanged.
14. Typecheck and build pass.

## Definition of Done

- Acceptance criteria satisfied.
- No unrelated refactors.
- `npm run typecheck` passes.
- `npm run build` passes.
- Added tests pass, or blockers are documented with evidence.
- Direct manual verification covers `/`, `/golden-thread`, unknown slug fallback, refresh, and browser back/forward behavior.
- The final diff is small enough for human review.

## Deliverable for Implementation Task

Produce a focused PR-sized diff that adds puzzle-name URL slugs, loads known puzzle slugs on refresh/direct navigation, and updates the URL when selecting puzzles from history while preserving the existing daily puzzle and gameplay behavior.
