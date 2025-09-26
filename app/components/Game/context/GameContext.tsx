import { createContext } from 'react'

type GuessStatus = 'correct' | 'present' | 'absent'

type Guess = {
  text: string
  status: GuessStatus[]
}

type GameStatus = 'new' | 'started' | 'loss' | 'won'

type Game = {
  status: GameStatus
  target: number
  guesses: Guess[]
  maxGuesses: number
}

export const GameContext = createContext<Game | undefined>(undefined)
