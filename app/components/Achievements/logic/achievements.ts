import type { Achievement } from '../context/AchievementsContext'
import type { GameStatus, Guess } from '~/components/Game/context/GameContext'
import { GAME_MAX_GUESSES } from '~/constant'

export const firstGuessCorrect = { ['firstGuessCorrect']: '🥇' }

export const lastGuessCorrect = { ['lastGuessCorrect']: '🧨' }

export const allAchievements = { ['allAchievements']: '🔗' }

export function isFirstGuessCorrect(status: GameStatus, guesses: Guess[]): boolean {
  return status === 'won' && guesses.length === 1
}

export function isLastGuessCorrect(status: GameStatus, guesses: Guess[]): boolean {
  return status === 'won' && guesses.length === GAME_MAX_GUESSES
}

export function hasAllAchievements(status: GameStatus, achievement: Achievement): boolean {
  const maxAchievements = 3
  const count = Object.keys(achievement).length + 1

  return maxAchievements === count
}
