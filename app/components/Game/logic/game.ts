import type { DefaultMantineColor } from '@mantine/core'

import type { Chord, GameStatus, Guess, GuessStatus } from '../context/GameContext'
import { GAME_MAX_CHARS, GAME_MAX_GUESSES } from '~/constant'
import { type DailyPuzzle, getEnabledPaletteSectionIds } from '~/utils/dailyPuzzle'
import { filterPaletteSections, flattenPaletteSections, getPaletteSections, normalizeChordLabel } from '~/utils/music'

export type GuessRowKind = 'submitted' | 'active' | 'empty'

export type GuessRow = {
  index: number
  kind: GuessRowKind
  chords: Chord[]
  status: GuessStatus[]
}

export function getPuzzleTarget(puzzle: DailyPuzzle): Chord[] {
  const enabledPaletteSectionIds = getEnabledPaletteSectionIds(puzzle.difficulty)
  const puzzlePaletteSections = getPaletteSections(puzzle.key, puzzle.mode)
  const enabledPuzzlePaletteSections = filterPaletteSections(puzzlePaletteSections, enabledPaletteSectionIds)
  const puzzlePaletteChords = flattenPaletteSections(enabledPuzzlePaletteSections)
  const normalizedTarget = puzzle.target.map(chord => normalizeChordLabel(chord))
  const invalidTargetChords = normalizedTarget.filter(chord => !puzzlePaletteChords.includes(chord))

  if (!invalidTargetChords.length) {
    return normalizedTarget
  }

  console.warn(
    `[game] Puzzle '${puzzle.date}' contains target chords missing from the ${puzzle.difficulty} palette: ${invalidTargetChords.join(', ')}. `
    + `Falling back to first ${GAME_MAX_CHARS} palette chords.`,
  )

  return puzzlePaletteChords.slice(0, GAME_MAX_CHARS)
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

export function buildGuessRows({
  guesses,
  current,
  status,
  maxGuesses,
}: {
  guesses: Guess[]
  current: Guess
  status: GameStatus
  maxGuesses: number
}): GuessRow[] {
  const isPlayable = status !== 'won' && status !== 'loss'

  return Array.from({ length: maxGuesses }, (_, index) => {
    const submittedGuess = guesses[index]

    if (submittedGuess) {
      return {
        index,
        kind: 'submitted',
        chords: submittedGuess.chords,
        status: submittedGuess.status,
      }
    }

    if (isPlayable && index === guesses.length) {
      return {
        index,
        kind: 'active',
        chords: current.chords,
        status: current.status,
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

export function getBadgeColor(status?: GuessStatus): string {
  switch (status) {
    case 'correct':
      return 'green.7'
    case 'present':
      return 'yellow.7'
    case 'absent':
    default:
      return 'dark.3'
      return 'gray.5'
  }
}

export function getGuessCellColor(row: GuessRow, cellIndex: number, activeIndex: number | null): string {
  if (row.kind === 'submitted') {
    return getBadgeColor(row.status[cellIndex])
  }

  if (row.kind === 'active' && cellIndex === activeIndex) {
    return 'lime.6'
  }

  if (row.kind === 'active' && row.chords[cellIndex]) {
    return 'gray.4'
  }

  return 'gray.4'
}

export function getGuessCellVariant(row: GuessRow): 'filled' | 'light' | 'outline' {
  if (row.kind === 'submitted') {
    return 'filled'
  }

  if (row.kind === 'active') {
    return 'light'
  }

  return 'light'
}
