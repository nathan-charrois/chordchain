import { useCallback, useEffect, useMemo, useState } from 'react'

import { GameContext, type GameEventPayload, type GameStatus, type Guess } from './context/GameContext'
import { buildCellStatus, isGameLoss, isGameWon, isGuessValid } from './logic/game'
import { GAME_MAX_CHARS, GAME_MAX_GUESSES } from '~/constant'
import { pubSub } from '~/utils/pubSub'

type Props = {
  children: React.ReactNode
}

const target = 1
const solution = '6+5-10'

export function GameProvider({ children }: Props) {
  const [status, setStatus] = useState<GameStatus>('new')
  const [guess, setGuess] = useState('')
  const [guesses, setGuesses] = useState<Guess[]>([])

  const events = useMemo(() => pubSub<GameEventPayload>(), [])

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
  }, [setGuess, events])

  const handleDeleteGuess = useCallback(() => {
    setGuess(prev => prev.slice(0, -1))
  }, [setGuess])

  const handleSubmitGuess = useCallback(() => {
    if (!isGuessValid(guess, target)) {
      events.publish({ event: 'INVALID_GUESS' })
    }
    else {
      setGuess('')
      setGuesses(prev => [...prev, {
        guess,
        status: buildCellStatus(guess, solution),
      }])
    }
  }, [guess, setGuesses, setGuess, events])

  const handleRestartGame = useCallback(() => {
    setStatus('new')
    setGuess('')
    setGuesses([])
  }, [guess, setGuess, setGuesses, setStatus])

  return (
    <GameContext.Provider value={{
      status,
      events,
      target,
      guess,
      guesses,
      maxCharacters: GAME_MAX_CHARS,
      maxGuesses: GAME_MAX_GUESSES,
      setGuess: handleSetGuess,
      deleteGuess: handleDeleteGuess,
      submitGuess: handleSubmitGuess,
      restartGame: handleRestartGame,
    }}
    >
      {children}
    </GameContext.Provider>
  )
}
