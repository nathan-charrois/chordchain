import { GameContext } from './context/GameContext'

type Props = {
  children: React.ReactNode
}

export function GameProvider({ children }: Props) {
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
