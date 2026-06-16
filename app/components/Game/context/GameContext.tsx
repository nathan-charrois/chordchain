import { createContext } from 'react'

import type { DailyPuzzle } from '~/utils/dailyPuzzle'
import type { ModeId, PaletteSectionId, PaletteSections } from '~/utils/music'
import type { PuzzleHistoryEntry } from '~/utils/puzzleHistory'

/* Game */
export type Game = {
  status: GameStatus
  activePuzzle: DailyPuzzle
  selectedKey: string
  selectedMode: ModeId
  todayDate: string
  selectedPuzzleDate: string
  currentStreak: number
  paletteSections: PaletteSections
  enabledPaletteSectionIds: PaletteSectionId[]
  paletteChords: Chord[]
  target: Chord[]
  guesses: Guess[]
  current: Guess
  puzzleDates: string[]
  historyEntries: Record<string, PuzzleHistoryEntry>
  maxLength: number
  maxGuesses: number
  selectPuzzleDate: (date: string) => void
  setSelectedKey: (key: string) => void
  setSelectedMode: (mode: ModeId) => void
  addCurrent: (chord: Chord) => void
  removeCurrent: () => void
  submitGuess: () => void
  reset: () => void
  resetToday: () => void
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
