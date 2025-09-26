import { createContext } from 'react'

type GameStatus = 'new' | 'started' | 'loss' | 'won'

type Game = {
  status: GameStatus
  target: number
  guess: string
  guesses: string[]
  maxGuesses: number
  setGuess: (guess: string) => void
  deleteGuess: () => void
  submitGuess: () => void
}

export const GameContext = createContext<Game | undefined>(undefined)
