import type { GameStatus, Guess } from '../context/GameContext'

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
