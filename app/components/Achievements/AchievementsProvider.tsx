import { useEffect, useState } from 'react'

import { useGame } from '../Game/hooks/useGame'
import { type Achievement, AchievementsContext } from './context/AchievementsContext'
import { firstGuessCorrect, isFirstGuessCorrect, isLastGuessCorrect, lastGuessCorrect } from './logic/achievements'
import { ACHIEVEMENTS_STORAGE_KEY } from '~/constant'

type Props = {
  children: React.ReactNode
}

export function AchievementsProvider({ children }: Props) {
  const { guesses, status } = useGame()
  const [achievements, setAchievements] = useState<Achievement[]>([])

  useEffect(() => {
    const result = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY)
    const parsed = result ? JSON.parse(result) : []

    if (Array.isArray(parsed)) {
      setAchievements(parsed)
    }
  }, [])

  useEffect(() => {
    if (isFirstGuessCorrect(status, guesses)) {
      setAchievements((prev) => {
        const result = [...prev, firstGuessCorrect]
        localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(result))
        return result
      })
    }

    if (isLastGuessCorrect(status, guesses)) {
      setAchievements((prev) => {
        const result = [...prev, lastGuessCorrect]
        localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(result))
        return result
      })
    }
  }, [status, guesses, setAchievements])

  return (
    <AchievementsContext.Provider value={{
      achievements,
    }}
    >
      {children}
    </AchievementsContext.Provider>
  )
}
