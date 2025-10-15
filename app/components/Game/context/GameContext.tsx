import { createContext } from 'react'

/* Game */
export type Game = {
  status: GameStatus
  target: GameTarget
  guesses: Guess[]
  maxLength: number
  maxGuesses: number
  addGuess: (chords: Chord[]) => void
  removeGuess: () => void
  reset: () => void
}

export type GameStatus = 'new' | 'started' | 'loss' | 'won'

export type GameTarget = Chord[]

/* Guess */
export type Guess = {
  chords: Chord[]
  status: GuessStatus[]
}

export type GuessStatus = 'absent' | 'present' | 'correct'

export const GameContext = createContext<Game | undefined>(undefined)

/* Chord */
export type Chord = string
