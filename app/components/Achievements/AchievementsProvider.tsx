import { useEffect, useState } from 'react'

import { useGame } from '../Game/hooks/useGame'
import { type Achievement, AchievementsContext } from './context/AchievementsContext'
import { allAchievements, firstGuessCorrect, hasAllAchievements, isFirstGuessCorrect, isLastGuessCorrect, lastGuessCorrect } from './logic/achievements'
import { ACHIEVEMENTS_STORAGE_KEY } from '~/constant'

type Props = {
  children: React.ReactNode
}

export function AchievementsProvider({ children }: Props) {
  const { guesses, status } = useGame()
  const [achievement, setAchievement] = useState<Achievement>({})

  useEffect(() => {
    const result = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY)
    const parsed = result ? JSON.parse(result) : {}

    if (parsed) {
      setAchievement(parsed)
    }
  }, [setAchievement])

  useEffect(() => {
    if (isFirstGuessCorrect(status, guesses)) {
      setAchievement((prev) => {
        const result = { ...prev, ...firstGuessCorrect }
        localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(result))
        return result
      })
    }

    if (isLastGuessCorrect(status, guesses)) {
      setAchievement((prev) => {
        const result = { ...prev, ...lastGuessCorrect }
        localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(result))
        return result
      })
    }

    if (hasAllAchievements(status, achievement)) {
      setAchievement((prev) => {
        const result = { ...prev, ...allAchievements }
        localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(result))
        return result
      })
    }
  }, [status, guesses, setAchievement])

  return (
    <AchievementsContext.Provider value={{ achievement }}>
      {children}
    </AchievementsContext.Provider>
  )
}
