import type { DefaultMantineColor } from '@mantine/core'

import type { Chord, GameStatus, Guess, GuessStatus } from '../context/GameContext'
import evaluate from './evaluate'
import { GAME_MAX_GUESSES } from '~/constant'

export function isGuessValid(guess: string, target: number): boolean {
  const value = evaluate(guess)
  console.log('Guess evaluated to', value, 'and target is', target)

  return value === target
}

export function isChordSequenceEqual(guess: Chord[], solution: Chord[]): boolean {
  if (guess.length !== solution.length) {
    return false
  }

  return guess.every((chord, index) => chord === solution[index])
}

export function isGameWon(guesses: Guess[], solution: Chord[]): boolean {
  return guesses.some(guess => isChordSequenceEqual(guess.chords, solution))
}

export function isGameLoss(guesses: Guess[]): boolean {
  return guesses.length >= GAME_MAX_GUESSES
}

export function isGameRowActive(guesses: Guess[], status: GameStatus, index: number): boolean {
  return status === 'won' ? index === guesses.length - 1 : index === guesses.length
}

export function buildGuessStatus(guess: Chord[], solution: Chord[]): GuessStatus[] {
  const result: GuessStatus[] = new Array(guess.length).fill('absent')
  const remaining = new Map<Chord, number>()

  for (const chord of solution) {
    const count = remaining.get(chord) ?? 0
    remaining.set(chord, count + 1)
  }

  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === solution[i]) {
      result[i] = 'correct'
      const count = remaining.get(guess[i]) ?? 0
      remaining.set(guess[i], count - 1)
    }
  }

  for (let i = 0; i < guess.length; i++) {
    if (result[i] === 'correct') {
      continue
    }

    const count = remaining.get(guess[i]) ?? 0
    if (count > 0) {
      result[i] = 'present'
      remaining.set(guess[i], count - 1)
    }
  }

  return result
}

export function createSubmittedGuess(chords: Chord[], solution: Chord[]): Guess {
  const nextChords = [...chords]

  return {
    chords: nextChords,
    status: buildGuessStatus(nextChords, solution),
  }
}

export function mergeGuessStatus(
  current?: GuessStatus,
  incoming?: GuessStatus,
): GuessStatus | undefined {
  if (!incoming) {
    return current
  }

  if (!current) {
    return incoming
  }

  if (current === 'correct' || incoming === 'correct') {
    return 'correct'
  }

  if (current === 'present' || incoming === 'present') {
    return 'present'
  }

  return 'absent'
}

export function getGuessStatus(chord: Chord, guesses: Guess[]): GuessStatus | undefined {
  let bestStatus: GuessStatus | undefined

  for (const guess of guesses) {
    for (let i = 0; i < guess.chords.length; i++) {
      if (guess.chords[i] === chord) {
        bestStatus = mergeGuessStatus(bestStatus, guess.status[i])
      }
    }
  }

  return bestStatus
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
