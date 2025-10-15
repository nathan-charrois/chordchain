import { useCallback, useEffect, useState } from 'react'

import { type Chord, GameContext, type GameStatus, type Guess } from './context/GameContext'
import { isGameLoss, isGameWon } from './logic/game'
import { GAME_MAX_CHARS, GAME_MAX_GUESSES } from '~/constant'

type Props = {
  children: React.ReactNode
}

const target = ['C', 'Fm', 'Am', 'G']

function useStatus(guesses: Guess[]) {
  const [status, setStatus] = useState<GameStatus>('new')

  useEffect(() => {
    if (isGameWon(guesses, target)) {
      setStatus('won')
    }
    else if (isGameLoss(guesses)) {
      setStatus('loss')
    }
  }, [guesses, setStatus])

  return [status, setStatus] as const
}

export function GameProvider({ children }: Props) {
  const [guesses, setGuesses] = useState<Guess[]>([])
  const [status, setStatus] = useStatus(guesses)

  const handleAddGuess = useCallback((chords: Chord[]) => {
    setGuesses(prev => ({
      ...prev,
      chords,
    }))
  }, [setGuesses])

  const handleRemoveGuess = useCallback(() => {
    setGuesses(prev => prev.slice(0, -1))
  }, [setGuesses])

  const handleReset = useCallback(() => {
    setStatus('new')
    setGuesses([])
  }, [setGuesses, setStatus])

  return (
    <GameContext.Provider value={{
      status,
      target,
      guesses,
      maxLength: GAME_MAX_CHARS,
      maxGuesses: GAME_MAX_GUESSES,
      addGuess: handleAddGuess,
      removeGuess: handleRemoveGuess,
      reset: handleReset,
    }}
    >
      {children}
    </GameContext.Provider>
  )
}
