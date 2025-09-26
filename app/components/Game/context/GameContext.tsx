import { createContext } from 'react'

export type GameStatus = 'new' | 'started' | 'loss' | 'won'

export type Game = {
  status: GameStatus
  target: number
  guess: string
  guesses: string[]
  maxCharacters: number
  maxGuesses: number
  setGuess: (guess: string) => void
  deleteGuess: () => void
  submitGuess: () => void
}

export const GameContext = createContext<Game | undefined>(undefined)
