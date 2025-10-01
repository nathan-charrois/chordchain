import { createContext } from 'react'

export type GameStatus = 'new' | 'loss' | 'won'

export type GameEventTypes = 'INVALID_GUESS' | 'SET_GUESS' | 'SAVE_GAME'

export type GameEventPayload = { event: GameEventTypes, value?: string }

export type GameEventCallback = (payload: GameEventPayload) => void

export type GameEvents = {
  subscribe: (event: GameEventCallback) => () => boolean
  publish: GameEventCallback
}

export type CellStatus = 'absent' | 'present' | 'correct'

export type Guess = {
  guess: string
  status: CellStatus[]
}

export type Game = {
  status: GameStatus
  events: GameEvents
  target: number
  guess: string
  guesses: Guess[]
  maxCharacters: number
  maxGuesses: number
  setGuess: (guess: string) => void
  deleteGuess: () => void
  submitGuess: () => void
  restartGame: () => void
}

export const GameContext = createContext<Game | undefined>(undefined)
