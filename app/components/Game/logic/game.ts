import type { DefaultMantineColor } from '@mantine/core'

import type { GameStatus, Guess, GuessStatus } from '../context/GameContext'
import evaluate from './evaluate'
import { GAME_MAX_GUESSES } from '~/constant'

export function isGuessValid(guess: string, target: number): boolean {
  const value = evaluate(guess)
  console.log('Guess evaluated to', value, 'and target is', target)

  return value === target
}

export function isGameWon(guesses: Guess[], solution: string[]): boolean {
  return !!guesses.find(guess => guess.chords === solution)
}

export function isGameLoss(guesses: Guess[]): boolean {
  return guesses.length >= GAME_MAX_GUESSES
}

export function isGameRowActive(guesses: Guess[], status: GameStatus, index: number): boolean {
  return status === 'won' ? index === guesses.length - 1 : index === guesses.length
}

export function buildGuessStatus(guess: string, solution: string): GuessStatus[] {
  const result: GuessStatus[] = new Array(guess.length).fill('absent')
  const chars = new Map<string, number>()

  // Count characters
  for (const char of solution) {
    const count = chars.get(char) ?? 0
    chars.set(char, count + 1)
  }

  // Set correct status
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === solution[i]) {
      result[i] = 'correct'
      const count = chars.get(guess[i]) ?? 0
      chars.set(guess[i], count - 1)
    }
  }

  // Set present status
  for (let i = 0; i < guess.length; i++) {
    if (result[i] === 'correct') {
      continue
    }

    const count = chars.get(guess[i]) ?? 0
    if (count > 0) {
      result[i] = 'present'
      chars.set(guess[i], count - 1)
    }
  }

  return result
}

export function getGuessStatus(char: string, guesses: Guess[]): GuessStatus | undefined {
  for (const guess of guesses) {
    for (let i = 0; i < guess.chords.length; i++) {
      if (guess.chords[i] === char) {
        return guess.status[i]
      }
    }
  }

  return undefined
}

export function getCellTextColor(status?: GuessStatus): DefaultMantineColor {
  switch (status) {
    case 'correct':
    case 'present':
      return 'white'
    case 'absent':
      return 'dark.2'
    default:
      return 'dark.5'
  }
}

export function getCellClassName(status?: GuessStatus): string {
  switch (status) {
    case 'correct':
      return 'cell cell-correct'
    case 'present':
      return 'cell cell-present'
    case 'absent':
      return 'cell cell-absent'
    default:
      return 'cell cell-default'
  }
}

export function getKeyClassName(status?: GuessStatus): string {
  switch (status) {
    case 'correct':
      return 'key key-correct'
    case 'present':
      return 'key key-present'
    case 'absent':
      return 'key key-absent'
    default:
      return 'key key-default'
  }
}
