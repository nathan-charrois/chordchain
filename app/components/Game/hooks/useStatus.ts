import { useEffect, useState } from 'react'

import { type Chord, type GameStatus, type Guess } from '../context/GameContext'
import { isGameLoss, isGameWon } from '../logic/game'

export function useStatus(guesses: Guess[], target: Chord[]) {
  const [status, setStatus] = useState<GameStatus>('new')

  useEffect(() => {
    if (!guesses.length) {
      return
    }

    if (isGameWon(guesses, target)) {
      setStatus('won')
      return
    }

    if (isGameLoss(guesses)) {
      setStatus('loss')
      return
    }

    setStatus(prev => (prev === 'new' ? 'started' : prev))
  }, [guesses, target, setStatus])

  return [status, setStatus] as const
}
