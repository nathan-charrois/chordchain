import type { Achievement } from '../context/AchievementsContext'
import type { GameStatus, Guess } from '~/components/Game/context/GameContext'
import { GAME_MAX_GUESSES } from '~/constant'

// Achievement evaluators
export function isFirstGuessCorrect(status: GameStatus, guesses: Guess[]): boolean {
  return status === 'won' && guesses.length === 1
}

export function isLastGuessCorrect(status: GameStatus, guesses: Guess[]): boolean {
  return status === 'won' && guesses.length === GAME_MAX_GUESSES
}

// Achievement objects
export const firstGuessCorrect: Achievement = { title: 'One and done!', emoji: '🥇' }

export const lastGuessCorrect: Achievement = { title: 'Just in time!', emoji: '🥈' }
