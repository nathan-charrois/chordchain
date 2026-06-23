import { createContext } from 'react'

import type { DailyPuzzle } from '~/utils/dailyPuzzle'
import type { ChordId } from '~/utils/music'
import type { PuzzleHistoryEntry } from '~/utils/puzzleHistory'

/* Game */
export type Game = {
  status: GameStatus
  activePuzzle: DailyPuzzle
  todayDate: string
  selectedPuzzleDate: string
  currentStreak: number
  guesses: Guess[]
  current: Guess
  puzzleDates: string[]
  historyEntries: Record<string, PuzzleHistoryEntry>
  maxLength: number
  maxGuesses: number
  selectPuzzleDate: (date: string) => void
  addCurrent: (chord: ChordId) => void
  removeCurrent: () => void
  submitGuess: () => void
  reset: () => void
  resetToday: () => void
}

export type GameStatus = 'new' | 'started' | 'loss' | 'won'

/* Guess */
export type Guess = {
  chords: ChordId[]
}

export type GuessStatus = 'absent' | 'present' | 'correct' | 'active' | 'current'

export const GameContext = createContext<Game | undefined>(undefined)
