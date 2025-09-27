import { useContext } from 'react'

import { AchievementsContext } from '../context/AchievementsContext'

export function useAchievements() {
  const context = useContext(AchievementsContext)

  if (!context) {
    throw new Error('useAchievements must be used within a AchievementsProvider')
  }

  return context
}
