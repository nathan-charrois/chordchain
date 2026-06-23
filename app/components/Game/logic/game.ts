import type { DefaultMantineColor } from '@mantine/core'

import type { GameStatus, Guess, GuessStatus } from '../context/GameContext'
import { GAME_MAX_GUESSES } from '~/constant'
import type { ChordId } from '~/utils/music'
import { areChordIdsEqual, chordIdKey } from '~/utils/music'

export type GuessRowKind = 'submitted' | 'playing' | 'active' | 'empty'

export type GuessRow = {
  index: number
  kind: GuessRowKind
  chords: ChordId[]
  status: GuessStatus[]
}

export function isChordSequenceEqual(guess: ChordId[], solution: ChordId[]): boolean {
  if (guess.length !== solution.length) {
    return false
  }

  return guess.every((chord, index) => areChordIdsEqual(chord, solution[index]))
}

export function isGameWon(guesses: Guess[], solution: ChordId[]): boolean {
  return guesses.some(guess => isChordSequenceEqual(guess.chords, solution))
}

export function isGameLoss(guesses: Guess[]): boolean {
  return guesses.length >= GAME_MAX_GUESSES
}

export function isGameRowActive(guesses: Guess[], status: GameStatus, index: number): boolean {
  return status === 'won' ? index === guesses.length - 1 : index === guesses.length
}

export function buildGuessRows({
  guesses,
  current,
  status,
  maxGuesses,
  solution,
  isSubmittingGuess = false,
}: {
  guesses: Guess[]
  current: Guess
  status: GameStatus
  maxGuesses: number
  solution: ChordId[]
  isSubmittingGuess?: boolean
}): GuessRow[] {
  const isPlayable = status !== 'won' && status !== 'loss'

  return Array.from({ length: maxGuesses }, (_, index) => {
    const submittedGuess = guesses[index]

    if (submittedGuess) {
      return {
        index,
        kind: 'submitted',
        chords: submittedGuess.chords,
        status: buildGuessStatus(submittedGuess.chords, solution),
      }
    }

    if (isPlayable && index === guesses.length) {
      return {
        index,
        kind: isSubmittingGuess ? 'playing' : 'active',
        chords: current.chords,
        status: isSubmittingGuess
          ? buildGuessStatus(current.chords, solution)
          : [],
      }
    }

    return {
      index,
      kind: 'empty',
      chords: [],
      status: [],
    }
  })
}

export function buildGuessStatus(guess: ChordId[], solution: ChordId[]): GuessStatus[] {
  const result: GuessStatus[] = new Array(guess.length).fill('absent')
  const remaining = new Map<string, number>()

  for (const chord of solution) {
    const key = chordIdKey(chord)
    const count = remaining.get(key) ?? 0
    remaining.set(key, count + 1)
  }

  for (let i = 0; i < guess.length; i++) {
    if (areChordIdsEqual(guess[i], solution[i])) {
      result[i] = 'correct'
      const key = chordIdKey(guess[i])
      const count = remaining.get(key) ?? 0
      remaining.set(key, count - 1)
    }
  }

  for (let i = 0; i < guess.length; i++) {
    if (result[i] === 'correct') {
      continue
    }

    const key = chordIdKey(guess[i])
    const count = remaining.get(key) ?? 0
    if (count > 0) {
      result[i] = 'present'
      remaining.set(key, count - 1)
    }
  }

  return result
}

export function createSubmittedGuess(chords: ChordId[]): Guess {
  return {
    chords: chords.map(chord => ({ ...chord })),
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

export function getGuessStatus(chord: ChordId, guesses: Guess[], solution: ChordId[]): GuessStatus | undefined {
  let bestStatus: GuessStatus | undefined

  for (const guess of guesses) {
    const statuses = buildGuessStatus(guess.chords, solution)

    for (let i = 0; i < guess.chords.length; i++) {
      if (areChordIdsEqual(guess.chords[i], chord)) {
        bestStatus = mergeGuessStatus(bestStatus, statuses[i])
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

export function getCellColorByStatus(status?: GuessStatus): string {
  switch (status) {
    case 'correct':
      return 'forest.8'
    case 'present':
      return 'amber.6'
    case 'absent':
      return 'dark.6'
    case 'current':
      return 'brand.3'
    case 'active':
      return 'brand.2'
    default:
      return 'brand.1'
  }
}

export function getGuessCellColor(
  row: GuessRow,
  cellIndex: number,
  activeIndex: number | null,
  isGuessPlaying = false,
) {
  const isRevealPending = isGuessPlaying
    && activeIndex !== null
    && cellIndex <= activeIndex

  if (row.kind === 'submitted') {
    return {
      background: getCellColorByStatus(row.status[cellIndex]),
      color: 'gray.0',
      border: undefined,
    }
  }

  if (row.kind === 'playing' && !isRevealPending) {
    return {
      background: 'gray.3',
      color: 'gray.7',
      border: undefined,
    }
  }

  if (row.kind === 'playing') {
    return {
      background: getCellColorByStatus(row.status[cellIndex]),
      color: 'gray.0',
      border: undefined,
    }
  }

  if (row.kind === 'active' && activeIndex === cellIndex) {
    return {
      background: 'brand.2',
      color: 'brand.8',
      border: undefined,
    }
  }

  return {
    background: getCellColorByStatus(),
    color: undefined,
    border: undefined,
  }
}
