import { createContext } from 'react'

export type Achievement = {
  emoji: '🥇' | '🥈'
}

export type Achievements = {
  achievements: Achievement[]
}

export const AchievementsContext = createContext<Achievements | undefined>(undefined)
