import type { GameStatus, Guess } from '../context/GameContext'
import { createSubmittedGuess, isGameLoss, isGameWon } from './game'
import type { ChordId } from '~/utils/music'
import type { PuzzleHistoryEntry } from '~/utils/puzzleHistory'

export type GameSessionState = {
  puzzleDate: string
  status: GameStatus
  guesses: Guess[]
  current: Guess
}

export function createEmptyGuess(): Guess {
  return {
    chords: [],
  }
}

export function createResetSessionState(puzzleDate: string): GameSessionState {
  return {
    puzzleDate,
    status: 'new',
    guesses: [],
    current: createEmptyGuess(),
  }
}

export function getNextStatusFromGuesses(
  currentStatus: GameStatus,
  guesses: Guess[],
  solution: ChordId[],
): GameStatus {
  if (!guesses.length || isGameOverStatus(currentStatus)) {
    return currentStatus
  }

  if (isGameWon(guesses, solution)) {
    return 'won'
  }

  if (isGameLoss(guesses)) {
    return 'loss'
  }

  return currentStatus === 'new' ? 'started' : currentStatus
}

export function createSessionStateFromHistory(
  puzzleDate: string,
  entry: PuzzleHistoryEntry | undefined,
  solution: ChordId[],
): GameSessionState {
  const guesses = (entry?.guesses ?? []).map(guess => createSubmittedGuess(guess.chords))
  let status: GameStatus = guesses.length ? 'started' : 'new'

  if (entry?.completed) {
    status = 'won'
  }
  else if (entry?.failed) {
    status = 'loss'
  }
  else if (isGameWon(guesses, solution)) {
    status = 'won'
  }
  else if (isGameLoss(guesses)) {
    status = 'loss'
  }

  return {
    puzzleDate,
    status,
    guesses,
    current: createEmptyGuess(),
  }
}

export function isGameOverStatus(status: GameStatus): boolean {
  return status === 'won' || status === 'loss'
}

export function isGuessInputLocked(status: GameStatus): boolean {
  return isGameOverStatus(status)
}

export function shouldRevealProgression(status: GameStatus): boolean {
  return status === 'loss'
}

export function getEndStateMessage(status: GameStatus): string | null {
  if (status === 'won') {
    return 'You entered the correct chord chain for this puzzle. Wait for the next puzzle or choose a puzzle from a different date.'
  }

  if (status === 'loss') {
    return 'You reached the maximum number of guesses without guessing the correct chain of chords. Try again tomorrow or choose a puzzle from a different date.'
  }

  return null
}
