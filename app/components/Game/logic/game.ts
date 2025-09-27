import type { CellStatus, Guess } from '../context/GameContext'
import evaluate from './evaluate'
import { GAME_MAX_GUESSES } from '~/constant'

export function isGuessValid(guess: string, target: number): boolean {
  const value = evaluate(guess)
  console.log('Guess evaluated to', value, 'and target is', target)

  return value === target
}

export function isGameWon(guesses: Guess[], solution: string): boolean {
  return !!guesses.find(({ guess }) => guess === solution)
}

export function isGameLoss(guesses: Guess[]): boolean {
  return guesses.length >= GAME_MAX_GUESSES
}

export function buildCellStatus(guess: string, solution: string): CellStatus[] {
  const result: CellStatus[] = new Array(guess.length).fill('absent')
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

export function getCellStatus(char: string, guesses: Guess[]): CellStatus | undefined {
  for (const guess of guesses) {
    for (let i = 0; i < guess.guess.length; i++) {
      if (guess.guess[i] === char) {
        return guess.status[i]
      }
    }
  }

  return undefined
}

export function getStatusBackgroundColor(status?: CellStatus) {
  switch (status) {
    case 'correct':
      return 'green.6'
    case 'present':
      return 'yellow.6'
    case 'absent':
      return 'gray.6'
    default:
      return 'indigo.2'
  }
}

export function getStatusTextColor(status?: CellStatus) {
  switch (status) {
    case 'correct':
      return 'white'
    case 'present':
      return 'white'
    case 'absent':
      return 'white'
    default:
      return 'indigo.6'
  }
}

export function getBackgroundColor(isActiveRow: boolean) {
  return isActiveRow ? 'indigo.3' : 'indigo.2'
}

export function getTextColor(isActiveRow: boolean, char: string) {
  if (isActiveRow && char) {
    return 'white'
  }

  return isActiveRow ? 'indigo.6' : 'indigo.2'
}
