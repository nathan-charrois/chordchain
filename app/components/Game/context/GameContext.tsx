import { createContext } from 'react'

export type GameStatus = 'new' | 'loss' | 'won'

export type CellStatus = 'absent' | 'present' | 'correct'

export type Guess = {
  guess: string
  status: CellStatus[]
}

export type Game = {
  status: GameStatus
  target: number
  guess: string
  guesses: Guess[]
  maxCharacters: number
  maxGuesses: number
  setGuess: (guess: string) => void
  deleteGuess: () => void
  submitGuess: () => void
  resetGame: () => void
}

export const GameContext = createContext<Game | undefined>(undefined)
