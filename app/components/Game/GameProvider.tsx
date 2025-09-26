import { useCallback, useEffect, useState } from 'react'

import { GameContext, type GameStatus } from './context/GameContext'
import isGuessValid from './logic/game'
import { GAME_MAX_CHARS, GAME_MAX_GUESSES } from '~/constant'

type Props = {
  children: React.ReactNode
}

const target = 50
const targetEquation = '25+25'

export function GameProvider({ children }: Props) {
  const [status, setStatus] = useState<GameStatus>('new')
  const [guess, setGuess] = useState('')
  const [guesses, setGuesses] = useState<string[]>([])

  useEffect(() => {
    console.log('Game status updated:', status)
  }, [status])

  useEffect(() => {
    if (guesses.includes(targetEquation)) {
      setStatus('won')
    }
    else if (guesses.length >= GAME_MAX_GUESSES) {
      setStatus('loss')
    }
    else if (guesses.length) {
      setStatus('started')
    }
  }, [guesses, setStatus])

  const handleSetGuess = useCallback((subString: string) => {
    setGuess((prev) => {
      if (prev.length === GAME_MAX_CHARS) {
        return prev
      }

      return prev + subString
    })
  }, [setGuess])

  const handleDeleteGuess = useCallback(() => {
    setGuess(prev => prev.slice(0, -1))
  }, [setGuess])

  const handleSubmitGuess = useCallback(() => {
    if (isGuessValid(guess, target)) {
      setGuesses(prev => [...prev, guess])
      setGuess('')
    }
    else {
      console.error(`Guess was not submitted`)
    }
  }, [guess, setGuesses])

  return (
    <GameContext.Provider value={{
      status,
      target,
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
