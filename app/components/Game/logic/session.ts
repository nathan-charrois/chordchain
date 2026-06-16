import type { Chord, GameStatus, Guess } from '../context/GameContext'
import { createSubmittedGuess, isGameLoss, isGameWon } from './game'
import type { PuzzleHistoryEntry } from '~/utils/puzzleHistory'

export type GameSessionState = {
  status: GameStatus
  guesses: Guess[]
  current: Guess
}

export function createEmptyGuess(): Guess {
  return {
    chords: [],
    status: [],
  }
}

export function createResetSessionState(): GameSessionState {
  return {
    status: 'new',
    guesses: [],
    current: createEmptyGuess(),
  }
}

export function createSessionStateFromHistory(
  entry: PuzzleHistoryEntry | undefined,
  target: Chord[],
): GameSessionState {
  const guesses = (entry?.guesses ?? []).map(guess => createSubmittedGuess(guess.chords, target))
  let status: GameStatus = guesses.length ? 'started' : 'new'

  if (entry?.completed) {
    status = 'won'
  }
  else if (entry?.failed) {
    status = 'loss'
  }
  else if (isGameWon(guesses, target)) {
    status = 'won'
  }
  else if (isGameLoss(guesses)) {
    status = 'loss'
  }

  return {
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

export function shouldRevealTarget(status: GameStatus): boolean {
  return status === 'loss'
}

export function getEndStateMessage(status: GameStatus): string | null {
  if (status === 'won') {
    return 'You won!'
  }

  if (status === 'loss') {
    return 'You lost.'
  }

  return null
}
