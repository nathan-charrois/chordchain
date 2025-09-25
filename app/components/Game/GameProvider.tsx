import { createContext, useContext } from 'react'

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

const GameContext = createContext<Game | undefined>(undefined)

type Props = {
  children: React.ReactNode
}

export const GameProvider = ({ children }: Props) => {
  return (
    <GameContext.Provider value={{
      status: 'new',
      target: 50,
      guesses: [],
      maxGuesses: 6,
    }}
    >
      {children}
    </GameContext.Provider>
  )
}

export const useGame = () => {
  const context = useContext(GameContext)

  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }

  return context
}
