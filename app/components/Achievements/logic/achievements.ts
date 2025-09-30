import type { GameStatus, Guess } from '~/components/Game/context/GameContext'
import { GAME_MAX_GUESSES } from '~/constant'

export const firstGuessCorrect = { ['firstGuessCorrect']: '🥇' }

export const lastGuessCorrect = { ['lastGuessCorrect']: '🧨' }

export const multiDayStreak = { ['multiDayStreak']: '🔗' }

export function isFirstGuessCorrect(status: GameStatus, guesses: Guess[]): boolean {
  return status === 'won' && guesses.length === 1
}

export function isLastGuessCorrect(status: GameStatus, guesses: Guess[]): boolean {
  return status === 'won' && guesses.length === GAME_MAX_GUESSES
}

export function isMultiDayStreak(status: GameStatus, guesses: Guess[]): boolean {
  return status === 'won' && guesses.length === GAME_MAX_GUESSES
}
