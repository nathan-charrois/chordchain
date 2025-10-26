import { useEffect, useState } from 'react'

import { type GameStatus, type Guess } from '../context/GameContext'
import { isGameLoss, isGameWon } from '../logic/game'

export function useStatus(guesses: Guess[], target: string[]) {
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
