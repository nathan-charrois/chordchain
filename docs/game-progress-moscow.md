# Game Progress Analysis (MoSCoW)

Date: 2026-05-23
Spec: 001-analyze-game-progress

## Repository Evidence Reviewed

- Project docs: README.md, AGENTS.md, specs/001-analyze-game-progress.md
- App shell and routing: app/root.tsx, app/routes.ts, app/routes/Game/index.tsx
- Core game state and logic: app/components/Game/context/GameContext.tsx, app/components/Game/GameProvider.tsx, app/components/Game/hooks/useStatus.ts, app/components/Game/logic/game.ts, app/components/Game/logic/evaluate.ts
- Gameplay UI: app/components/Board/Board.tsx, app/components/Scale/Scale.tsx, app/components/Pallete/Pallete.tsx, app/components/PalleteButton/PalleteButton.tsx
- Audio and sequence playback: app/components/Board/hooks/useSequence.ts, app/utils/chain.ts, app/utils/music.ts, app/utils/zzfx.ts
- Theme/hooks/utilities: app/utils/theme.ts, app/hooks/useAnimation.ts, app/hooks/useIsTablet.ts, app/utils/pubSub.ts
- Assets and docs folders: public/images, docs
- Tests: searched for test/spec files in source tree

## 1) What type of game is this?

Chord Chain is a music ear training and chord progression guessing game. The player listens to a chord sequence and tries to reconstruct the sequence using a limited chord palette and limited guesses.

## 2) What is the current playable loop?

Current loop that exists today:

1. Open the app (single route at `/`).
2. Press Play to hear the fixed target progression.
3. Build a guess from on-screen chord buttons.
4. Press Enter to submit.
5. Submitted guess is displayed in a list and is auto-played once.
6. Repeat until max guesses reached.

Observed gaps in this loop:

- No per-chord correctness feedback is shown.
- Win condition does not trigger reliably due to array reference comparison logic.
- Loss can trigger after max guesses, but there is no end-of-game UX, no reset button, and no guard that blocks further submissions.
- Scale/key hint is hardcoded and not connected to active game state.

## 3) What already works?

- App boots with a clear single-screen game layout.
- Documented scripts work:
  - `npm run typecheck` completed with no TypeScript errors.
  - `npm run build` completed and produced client bundle output.
- Chord playback engine is present:
  - Plays target progression.
  - Supports looping and non-looping playback.
  - Supports arpeggiate toggle.
- Guess entry controls exist:
  - Chord buttons append to current guess.
  - Undo removes last chord.
  - Enter appends guess to submitted guesses list.
- Guess list rendering and current guess rendering are visible in board UI.
- Core game constants exist for max guesses and chain length.

## 4) What appears partially implemented?

- Status model exists (`new`, `started`, `won`, `loss`), but lifecycle is incomplete.
  - `started` status is never set.
  - `won` logic exists but is currently ineffective in practice.
- Guess status model exists (`absent`, `present`, `correct`) with helper functions and style mapping, but this is not wired into guess submission and display.
- Utility logic for string-expression evaluation appears inherited from a different game mechanic and is not integrated with chord-chain flow.
- Animation hook exists but appears unused in gameplay components.
- Theme/provider structure is present but theme customization is effectively empty.

## 5) What appears broken?

- Win detection is broken:
  - Current check compares array references instead of chord-by-chord values.
  - Result: matching chord sequences likely never produce `won`.
- Guess submission is not constrained:
  - No guard for required guess length before submit.
  - No guard for max guesses after loss.
  - No guard against submitting empty guesses.
- Guess grading pipeline is not active:
  - Submitted guesses keep `status: []` and are never evaluated against target.
  - Existing `buildGuessStatus` is string-char oriented and not adapted for chord token arrays.
- Status updates are inconsistent:
  - `useStatus` effect does not include `target` in dependencies.
  - `started` state appears dead.
- Board reveals internal target chords directly, which can undermine intended gameplay challenge if this is not explicitly a debug mode.

## 6) What major features are missing?

- End-to-end guess evaluation for chord sequences.
- Player-facing result feedback (per-chord correctness and summary).
- Clear game completion UX:
  - Win message/celebration.
  - Loss message and reveal of correct progression.
  - New game/reset action.
- Daily progression or deterministic progression selection strategy (README implies a daily puzzle concept).
- Basic UX constraints and validation around input length and submit rules.
- Persistence model for daily attempts/history (if daily mode is intended).
- Test coverage for core game rules and status transitions.

## 7) What features are required before the game can be considered complete?

Minimum required for a complete v1 by the spec's definition:

1. Correct and testable win/loss game-state transitions.
2. Correct submission validation (exact length, max attempts, no empty submit).
3. Guess scoring feedback shown in UI so players can improve subsequent attempts.
4. Clear ending conditions and messaging with restart path.
5. Ensure core loop cannot continue incorrectly after end state.
6. Keep build/run path reliable through documented scripts.

## 8) What features would improve the game but are not strictly required?

- Better visual/audio onboarding (first-play hint panel).
- Difficulty settings (loop speed, arpeggiation defaults, progression complexity).
- Keyboard shortcuts for faster input.
- Improved mobile layout polish and accessibility improvements (focus states, ARIA refinements).
- Session persistence (last game, audio toggles).
- Share results format for social posting.

## 9) What work should be deferred?

- Multi-mode gameplay expansions (custom scales, random generator lab, advanced chord qualities).
- Account/profile systems and cloud sync.
- Achievement systems (there is a storage key constant but no implementation yet).
- Broad theme/design system overhaul beyond gameplay clarity.
- Large architectural refactors not needed to ship v1.

## 10) What are the highest-risk technical areas?

1. Game-rule correctness in state transitions
- Current logic mismatch (array reference equality, missing grading hookup) can produce silent logic bugs that look like UX issues.

2. Sequence timing and side effects
- Playback uses multiple timeout channels and global timeout references. Re-entrancy and lifecycle edge cases can cause race-like behavior, especially when toggling loop and replay quickly.

3. Drift between intended product and implemented mechanics
- README describes daily puzzle and hint-based play, but current implementation hardcodes a visible target and static scale label. Product-rule drift can create repeated rework.

4. Lack of tests around core mechanics
- Without tests for evaluation, status transitions, and input constraints, regressions are likely as features are finished.

## MoSCoW Prioritization

### Must Have

- Correct win/loss determination for chord sequence guesses.
- Submission validation rules (length, max attempts, non-empty).
- Guess grading and feedback rendered in board/palette UI.
- End state UX (win/loss messaging and reset/new game path).
- Prevent invalid interaction after game end.
- Preserve build and typecheck health.
- Daily puzzle selection mechanism.
- Align visible hints with actual game state (key/scale source of truth).

### Should Have
- Add targeted tests for game logic and status hooks.
- Improve accessibility and mobile interaction quality.

### Could Have
- Enhanced audio controls and progression preview options.
- Optional keyboard input mode.
- Result sharing and lightweight stat tracking.
- Better visual transitions using existing animation utilities.

### Won't Have

- Accounts, leaderboards, cloud progression sync.
- Major architecture replacement or framework migration.
- Large feature packs beyond core ear-training loop.

## Suggested Next Issue Breakdown

1. Fix game outcome logic and submission constraints.
2. Implement chord-sequence grading and connect status to UI.
3. Add end-state UX and reset/new game flow.
4. Add tests for win/loss/validation/grading.
5. Reconcile daily puzzle requirement with implemented scope.

## Overall Completion Assessment

Current state is a strong prototype with functional audio playback and input controls, but not yet a complete first version. Core game-rule feedback and completion flow are still missing or broken, and these are required for players to understand, complete, and trust the gameplay loop.
