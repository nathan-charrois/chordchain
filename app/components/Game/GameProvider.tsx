import { useCallback, useEffect, useState } from 'react'

import { GameContext, type GameStatus, type Guess } from './context/GameContext'
import { buildCellStatus, isGameLoss, isGameWon, isGuessValid } from './logic/game'
import { GAME_MAX_CHARS, GAME_MAX_GUESSES } from '~/constant'

type Props = {
  children: React.ReactNode
}

const target = 6
const solution = '3+3'

export function GameProvider({ children }: Props) {
  const [status, setStatus] = useState<GameStatus>('new')
  const [guess, setGuess] = useState('')
  const [guesses, setGuesses] = useState<Guess[]>([])

  useEffect(() => {
    if (isGameWon(guesses, solution)) {
      setStatus('won')
    }
    else if (isGameLoss(guesses)) {
      setStatus('loss')
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
      setGuess('')
      setGuesses(prev => [...prev, {
        guess,
        status: buildCellStatus(guess, solution),
      }])
    }
    else {
      console.error(`Guess was not submitted`)
    }
  }, [guess, setGuesses, setGuess])

  const handleResetGame = useCallback(() => {
    setStatus('new')
    setGuess('')
    setGuesses([])
  }, [guess, setGuess, setGuesses, setStatus])

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
      resetGame: handleResetGame,
    }}
    >
      {children}
    </GameContext.Provider>
  )
}
