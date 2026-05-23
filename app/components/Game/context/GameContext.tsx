import { createContext } from 'react'

import type { DailyPuzzle } from '~/utils/dailyPuzzle'
import type { PuzzleHistoryEntry } from '~/utils/puzzleHistory'

/* Game */
export type Game = {
  status: GameStatus
  isGameOver: boolean
  activePuzzle: DailyPuzzle
  todayDate: string
  target: Chord[]
  guesses: Guess[]
  current: Guess
  puzzleDates: string[]
  historyEntries: Record<string, PuzzleHistoryEntry>
  maxLength: number
  maxGuesses: number
  addCurrent: (chord: Chord) => void
  removeCurrent: () => void
  submitGuess: () => void
  reset: () => void
}

export type GameStatus = 'new' | 'started' | 'loss' | 'won'

/* Guess */
export type Guess = {
  chords: Chord[]
  status: GuessStatus[]
}

export type GuessStatus = 'absent' | 'present' | 'correct'

export const GameContext = createContext<Game | undefined>(undefined)

/* Chord */
export type Chord = string
