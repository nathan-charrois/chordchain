import { useCallback, useState } from 'react'

import { GameContext } from './context/GameContext'
import { GAME_MAX_CHARS, GAME_MAX_GUESSES } from '~/constant'

type Props = {
  children: React.ReactNode
}

export function GameProvider({ children }: Props) {
  const [guess, setGuess] = useState('')
  const [guesses, setGuesses] = useState<string[]>([])
  console.log({
    guess,
    guesses,
  })

  const handleSetGuess = useCallback((subString: string) => {
    setGuess((prev) => {
      if (prev.length === GAME_MAX_CHARS) {
        return prev
      }

      return prev + subString
    })
  }, [setGuess])

  const handleDeleteGuess = useCallback(() => {
    setGuess((prev) => {
      if (prev.length < 1) {
        return prev
      }

      return prev.slice(0, -1)
    })
  }, [setGuess])

  const handleSubmitGuess = useCallback(() => {
    if (guesses.length === GAME_MAX_GUESSES) {
      console.log('Max guesses reached')
      return
    }

    if (guess.length !== GAME_MAX_CHARS) {
      console.log('Insufficient characters')
      return
    }

    setGuesses(prev => [...prev, guess])
    setGuess('')
  }, [guess, setGuesses])

  return (
    <GameContext.Provider value={{
      status: 'new',
      target: 50,
      guess,
      guesses,
      maxCharacters: GAME_MAX_CHARS,
      maxGuesses: GAME_MAX_GUESSES,
      setGuess: handleSetGuess,
      deleteGuess: handleDeleteGuess,
      submitGuess: handleSubmitGuess,
    }}
    >
      {children}
    </GameContext.Provider>
  )
}
