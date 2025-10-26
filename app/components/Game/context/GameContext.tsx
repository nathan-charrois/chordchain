import { createContext } from 'react'

/* Game */
export type Game = {
  status: GameStatus
  target: Chord[]
  guesses: Guess[]
  current: Guess
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
